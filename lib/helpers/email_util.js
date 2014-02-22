var ejs = require('ejs'),
    config = require('../config/config');

var Helper = (function() {

  var mailgun = require('mailgun-js')(config.mailgun.key, 'lemonfy.com');

  var textTemplate = ejs.compile(
    "Hi,\r\n\r\n" +
    "You just submitted a review on http://lemonfy.com " +
    "and the score was <%= s %>.0 (out of 5.0).\r\n\r\n" +
    "If that is the case, please click the link below:\r\n" +
    "http://lemonfy.com/#/validate/<%= tk %>\r\n\r\n" + // hashbang # is for IE
    "If you do not know anything about it, please ignore this email.\r\n\r\n" + 
    "Cheers,\r\n" +
    "Frank at lemonfy\r\n"
  );

  var from = 'Frank at lemonfy <frank@lemonfy.com>';
  var subject = 'Please verify your submission';

  return {
    send : function(email, rating, cb) {
      var data = { 
        from: from,
        to: email,
        subject: subject,
        text: textTemplate(rating),
        'o:tag': 'rating'
      };
      mailgun.messages.send(data, cb);

    }
  };
})(); 

exports.send = function(email, rating, cb) {
  Helper.send(email, rating, function(err, res, body) {

    cb(err);
  });
};


