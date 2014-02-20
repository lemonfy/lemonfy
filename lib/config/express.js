'use strict';

var express = require('express'),
    path = require('path'),
    config = require('./config');

/**
 * Express configuration
 */
module.exports = function(app) {
  // Should be placed before express.static
  app.use(express.compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
      level: 9
    }));

  app.configure('development', function(){
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));
    //app.use(express.errorHandler());
    app.use(express.logger('dev'));
    app.set('views', config.root + '/app/views');
  });

  app.configure('production', function(){
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public'),  { maxAge: 31536000 }));
    app.set('views', config.root + '/views');
  });

  app.configure(function(){
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    // Request body parsing middleware should be above methodOverride  
    app.use(express.json({limit: '16kb'}));
    app.use(express.urlencoded({limit: '16kb'})); 
    app.use(express.methodOverride());

    app.use(app.router);

    // error handler
    app.use(function(err, req, res, next) {       
      if (err.code && err.code < 500) {
        console.error(err);
        res.send(400, err);
      } else {
        console.error(err.stack);
        res.send(500, err);
      }
    });
  });

  
};