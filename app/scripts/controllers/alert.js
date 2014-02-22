'use strict';

angular.module('lemonfyApp')
  .controller('AlertController', ['$scope', '$location', '$timeout', '$anchorScroll', 'AlertService', function ($scope, $location, $timeout, $anchorScroll, AlertService) {
    $scope.alerts = [];

    $scope.close = function(index) {
      $scope.alerts.splice(index, 1);
    };

    var scrollHere = function() {
      var old = $location.hash();
      $location.hash('scroll-to-alerts');
      $anchorScroll();
      $location.hash(old);
    };

    var clear = function() {
      $scope.alerts.length = 0;
    };

    var flashPromise = null;

    var cancelFlash = function() {
      if (flashPromise) {
        $timeout.cancel(flashPromise);
      }
      flashPromise = null;
    };

    var add = function(detail) {
      $scope.alerts[0] = detail; //show only one alert at a time
      scrollHere();
      if (detail.flash) {
        cancelFlash();
        flashPromise = $timeout(function() {
          if ($scope.alerts[0] === detail) {
            clear();
          }
        }, 15000);
      }
    };

    var keepAlert = function() {
      var curr = $scope.alerts[0];
      var keep = false;
      if (curr) {
        keep = curr.keep;
        curr.keep = false; // keep for only one route change
      }
      return keep;
    };

    AlertService.onAlert($scope, function(detail) {
      add(detail);
    });

    $scope.$on('$routeChangeSuccess', function(/*evt, current, previous*/) {
      if (!keepAlert()) {
        clear();
        cancelFlash();
      }
    });

    $scope.$on('$routeChangeError', function() {
      add({type: 'warning', msg: AlertService.getGenericError()});
    });
  }]);
