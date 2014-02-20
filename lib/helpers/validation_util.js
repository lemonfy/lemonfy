var _ = require('lodash');

exports.checkOptionalString = function(val, max) {
  return _.isEmpty(val) || (_.isString(val) && val.length > 0 && val.length <= max);
};