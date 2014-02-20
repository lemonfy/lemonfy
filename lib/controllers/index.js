'use strict';

var path = require('path'),
    config = require('../config/config');

var cache = {};
var render = function(view, res) {
  if (config.cache && cache[view]) {
    return res.send(cache[view]);
  }
  res.render(view, function(err, html) {
    if(err) {
      res.send(404);
    } else {
      cache[view] = html;
      res.send(html);
    }
  });
};

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function(req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  render(requestedView, res);
};

/**
 * Send our single page app
 */
exports.index = function(req, res) {
  render('index', res);
};
