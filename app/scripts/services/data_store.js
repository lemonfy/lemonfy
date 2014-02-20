'use strict';

angular.module('lemonfyApp')
  .factory('DataStore', ['$http', '$cacheFactory', function ($http, $cacheFactory) {

    var API_COMPANY_NAMES = '/api/companynames/';

    var apiCompanyRatings = function(companyId) {
      return '/api/companyratings/' + companyId;
    };

    return {
      getCompanyNames: function (callback) {
        $http.get(API_COMPANY_NAMES, {cache: true}).success(function(data) {
          callback(null, data);
        }).error(function(data) {
          callback(data, null);
        });
      },

      getCompanyRatings: function (companyId, callback) {
        if (companyId.match(/^[0-9a-fA-F]{24}$/)) {
          $http.get(apiCompanyRatings(companyId), {cache: true}).success(function(data) {
            callback(null, data);
          }).error(function(data) {
            callback(data, null);
          });
        } else {
          var err = new Error();
          err.msg = 'Invalid company url';
          callback(err);
        }
      },

      getTagNames: function () {
        return $http.get('/api/tags/', {cache: true});
      },

      companySubmit: function(company, callback) {
        $http.post('/api/companysubmit', company).success(function(data) {

          var cache = $cacheFactory.get('$http');
          cache.remove(API_COMPANY_NAMES);

          callback(null, data);
        }).error(function(data) {
          callback(data, null);
        });
      },

      ratingSubmit: function(rating, callback) {
        $http.post('/api/ratingsubmit', rating).success(function(data) {
          callback(null, data);
        }).error(function(data) {
          callback(data, null);
        });
      },

      validateRating: function(token, callback) {
        $http.post('/api/validaterating', {token: token}).success(function(data) {
          callback(null, data);
        }).error(function(data) {
          callback(data, null);
        });
      }
    };
  }]);
