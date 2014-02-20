'use strict';

angular.module('lemonfyApp')
  .controller('HeaderController', ['$scope', '$window', function ($scope, $window) {
    $scope.$on('$routeChangeSuccess', function(evt, current) {
      var config = current.$$route;
      $scope.showHeader = config.hideHeader !== true;
      $window.document.title = config.title + ' - lemonfy';
    });
  }]);
