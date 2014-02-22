var _ = require('lodash');

var SCORE_VALS = [1, 2, 3, 4, 5];

exports.checkOptionalString = function(val, max) {
  return _.isEmpty(val) || (_.isString(val) && val.length > 0 && val.length <= max);
};

exports.checkScore = function(score) {
  return _.contains(SCORE_VALS, score);
};
