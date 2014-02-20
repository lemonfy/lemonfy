'use strict';

var api = require('./controllers/api'),
    index = require('./controllers/index');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/companynames', api.companyNames);
  app.get('/api/companyratings/:id', api.companyRatings);
  app.get('/api/tags', api.tags);

  app.post('/api/companysubmit', api.companySubmit);
  app.post('/api/ratingsubmit', api.ratingSubmit);
  app.post('/api/validaterating', api.validateRating);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};