'use strict';

angular.module('lemonfyApp')
  .factory('RouteCache', function () {
    
    var _cache = {};

    return {
      set: function(key, val) {
        _cache[key] = val;
      },

      get: function(key) {
        return _cache[key];
      }
    };
  });
