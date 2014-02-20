'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    Rating = mongoose.model('Rating'),
    Tag = mongoose.model('Tag'),
    _ = require('lodash');

var crypto = require('../helpers/crypto_util'),
    emailUtil = require('../helpers/email_util'),
    config = require('../config/config');


var throwBadInput = function(next, msg) {
  msg || (msg = 'Bad input');
  var e = new Error(msg);
  e.code = 400;
  e.msg = msg;
  return next(e);
};

var isValidString = function(str) {
  return !_.isEmpty(str) && _.isString(str) && str.trim().length > 0;
};

var cache = {
  companies: null,
  tags: {
    titles: [],
    locations: []
  }
};

exports.companyNames = function(req, res, next) {
  if (cache.companies) {
    return res.json(cache.companies);
  }
  Company.find({}, {id: 1, n: 1}, function (err, companies) {
    if (!err) {
      cache.companies = companies;
      res.json(companies);
    } else {
      next(err);
    }
  });
};

exports.companyRatings = function(req, res, next) {
  var companyId = req.params.id;
  if (!companyId.match(/^[0-9a-fA-F]{24}$/)) {
    return throwBadInput(next, 'Invalid company url');
  }
  Company.findOne({_id: companyId}, {__v: 0}, function (err, company) {
    if (!err) {
      Rating.find({cid: company._id, v: true}, 
        {cid: 0, h: 0, tk: 0, v: 0, __v: 0}, 
        //{sort: {_id: -1}},
        function(err, ratings) {
          if (!err) {
            res.json({
              company: company,
              ratings: ratings
            });
          } else {
            next(err);
          }
        });
    } else {
      next(err);
    }
  });
};

exports.tags = function(req, res, next) {
  if (cache.tags.titles.length > 0) {
    return res.json(cache.tags);
  }
  Tag.find({}, {_id: 0, __v: 0}, function (err, tags) {
    if (!err) {
      _.each(tags, function(tag) {
        if (tag.k === 't') {
          cache.tags.titles.push(tag.n);
        } else {
          cache.tags.locations.push(tag.n);
        }
      });
      res.json(cache.tags);
    } else {
      next(err);
    }
  });
};


exports.companySubmit = function(req, res, next) {
  var attrs = req.body;

  if (!attrs || !isValidString(attrs.n) || !isValidString(attrs.d)) {
    throwBadInput(next);
  }

  var company = {
    n: attrs.n.trim(),
    d: attrs.d.trim().toLowerCase(),
    r: 0,
    s: 0
  };

  var webDomain = isValidString(attrs.wd) ? attrs.wd.trim().toLowerCase() : null;
  if (webDomain && webDomain !== company.d) {
    company.wd = webDomain;
  }

  Company.findOne({$or: [{d: company.d}, {n: company.n}]}, {id: 1}, 
    function(err, sameCompany) {
      if (err) {
        next(err);
      } else if (sameCompany) {
        var msg = 'Company already added';
        var e = new Error(msg);
        e.code = 400;
        e.msg = msg;
        e.sameCompanyId = sameCompany.id;
        next(e);
      } else {
        Company.create(company, function(err, c) {
          if (err) {
            next(err);
          } else {
            cache.companies = null;
            res.json({companyId: c.id});
          }
        });
      }
    });
};

exports.ratingSubmit = function(req, res, next) {
  var attrs = req.body;
  
  if (!attrs || !isValidString(attrs.cid) || !isValidString(attrs.email) || !attrs.s) {
    return throwBadInput(next);
  }

  Company.findOne({_id: attrs.cid}, {_id: 1, d: 1}, function(err, company) {
    if (!company) {
      return throwBadInput(next);
    }

    var email = attrs.email + '@' + company.d;
    var rating = {
      cid: company._id,
      h: crypto.hash(email),
      v: false,
      tk: crypto.randomToken(),
      s: parseInt(attrs.s, 10)
    };

    _.each(['t', 'l', 'c'], function(key) {
      var val = attrs[key];
      if (isValidString(val)) {
        rating[key] = val.trim();
      }
    });

    Rating.create(rating, function(err, r) {
      if (err) {
        return next(err);
      } 
      emailUtil.send(email, r, function(err) {
        if (err) {
          return next(err);
        }
        res.json({});
      });

    });
  });
};


exports.validateRating = function(req, res, next) {
  var attrs = req.body;

  if (!attrs || !isValidString(attrs.token)) {
    return throwBadInput(next);
  }

  Rating.findOne({tk: attrs.token}, {tk: 0, c: 0}, function(err, rating) {
    if (!rating || rating.v) {
      return throwBadInput(next, 'Invalid token');
    }

    var expire = rating.ts + config.validationHrs * 3600 * 1000;
    var now = new Date().getTime();
    if (expire < now) {
      Rating.remove({_id: rating._id}).exec();
      return throwBadInput(next, 'Token expired');
    }

    Company.findOne({_id: rating.cid}, {_id: 1, r: 1, s: 1}, function(err, company) {
      if (err) {
        return next(err);
      }
      Rating.findOne({cid: rating.cid, h: rating.h, v: true}, {_id: 1, s: 1}, function(err, oldRating) {
        if (err) {
          return next(err);
        }  
        var companyModifier;

        if (oldRating) {
          Rating.remove({_id: oldRating._id}).exec();

          companyModifier = {$set: {
            s: (company.s * company.r - oldRating.s + rating.s) / company.r
          }};
        } else {
          companyModifier = {$inc: {
            r: 1
          }, $set: {
            s: (company.s * company.r + rating.s) / (company.r + 1)
          }};
        }

        Rating.update({_id: rating._id}, {$set: {v: true, tk: null}}, function(err) {
          if (err) {
            return next(err);
          }  
          Company.update({_id: company._id}, companyModifier).exec();

          // save new title/location tags if any
          if (rating.t) {
            Tag.update({k: 't', n: rating.t}, {$set: {k: 't', n: rating.t}}, {upsert: true}).exec();
          }
          if (rating.l) {
            Tag.update({k: 'l', n: rating.l}, {$set: {k: 'l', n: rating.l}}, {upsert: true}).exec();
          }
          if (rating.t || rating.l) {
            cache.tags.titles.length = 0;
            cache.tags.locations.length = 0;
          }

          // clear previously submtted but not validated ratings if any
          Rating.remove({cid: rating.cid, h: rating.h, v: false}).exec();

          res.json({companyId: company.id});
        });

      });
    });
    
  });
};