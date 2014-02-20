'use strict';

angular.module('lemonfyApp')
  .controller('HomeController', ['$scope', '$location', '$timeout', '_', 'DataStore', 'AlertService', function ($scope, $location, $timeout, _, DataStore, AlertService) {
    
    DataStore.getCompanyNames(function(err, data) {
      if (err) {
        AlertService.throwError('Could not retrieve existing companies from server. Please try again later.');
      } else {
        $scope.companyNames = _.map(data, function(c) {
          return {id: c.id, name: c.n};
        });
      }    
    });
    
    $scope.showAdd = false;

    $scope.select = function($item) {
      $location.path('/companies/' + $item.id);
    };

    $scope.inputChange = function() {
      if (!$scope.showAdd) {
        $timeout(function() {
          $scope.showAdd = true;
        }, 1000);
      }
    };
  }]);
