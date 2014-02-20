var CryptoJS = require("crypto-js");

exports.hash = function(str) {
  return CryptoJS.SHA1(str).toString();
};

exports.randomToken = function() {
  return CryptoJS.lib.WordArray.random(128/8).toString();
};


