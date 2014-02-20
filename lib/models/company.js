'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var util = require('../helpers/validation_util');
    
var DOMAIN_REGEX = /^[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;

var CompanySchema = new Schema({
  n: { //name
    type: String, 
    required: true, 
    unique: true, 
    trim: true
  },
  d: { //domain
    type: String, 
    required: true, 
    unique: true, 
    match: DOMAIN_REGEX
  },
  wd: { //web domain
    type: String, 
    match: DOMAIN_REGEX
  },
  r: { //ratings count
    type: Number, 
    min: 0, 
    default: 0
  },
  s: { // average score
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0
  }
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      delete ret._id;
      delete ret.__v;
    }
  }
});

/**
 * Validations
 */
var COMPANY_NAME_LEN_MIN = 2;
var COMPANY_NAME_LEN_MAX = 200;
var DOMAIN_LEN_MAX = 50;

CompanySchema.path('n').validate(function (name) {
  return name.length >= COMPANY_NAME_LEN_MIN && name.length <= COMPANY_NAME_LEN_MAX;
}, 'Company name must be between ' + COMPANY_NAME_LEN_MIN + ' and ' + COMPANY_NAME_LEN_MAX + ' characters');

CompanySchema.path('d').validate(function (domain) {
  return domain.length <= DOMAIN_LEN_MAX;
}, 'Company domain must be less than ' + DOMAIN_LEN_MAX + ' characters');

CompanySchema.path('wd').validate(function (webDomain) {
  return util.checkOptionalString(webDomain, DOMAIN_LEN_MAX);
}, 'Company web domain must be less than ' + DOMAIN_LEN_MAX + ' characters');

mongoose.model('Company', CompanySchema);