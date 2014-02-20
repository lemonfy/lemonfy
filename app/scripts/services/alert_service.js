'use strict';

angular.module('lemonfyApp')
  .factory('AlertService', ['$rootScope', function ($rootScope) {
    var _ALERT_EVENT_ = '_ALERT_EVENT_';
    var GENERIC_ERROR = 'Something went wrong, please try again later, or <a class="alert-link" href="http://twitter.com/lemonfyteam">tweet us</a>.';

    return {
      throwError: function (err) {
        var msg = err;
        var keep = false;
        if (!angular.isString(err)) {
          msg = err.msg;
          keep = err.keep;
        }
        if (!msg) {
          msg = GENERIC_ERROR;
        }
        $rootScope.$broadcast(_ALERT_EVENT_, {type: 'warning', msg: msg, keep: keep});
      },

      show: function (alert) {
        $rootScope.$broadcast(_ALERT_EVENT_, alert);
      },

      onAlert: function(scope, handler) {
        scope.$on(_ALERT_EVENT_, function(evt, detail) {
          handler(detail);
        });
      },

      getGenericError: function() {
        return GENERIC_ERROR;
      }
    };
  }]);
