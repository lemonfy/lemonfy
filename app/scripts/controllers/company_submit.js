'use strict';

angular.module('lemonfyApp')
  .controller('CompanySubmitController', ['$scope', '$route', '$location', 'DataStore', 'AlertService', function ($scope, $route, $location, DataStore, AlertService) {
    var name = $route.current.params.q || '';
    if (name.length < 2) {
      name = 'Example';
    }
    var domain = name.toLowerCase() + (name.indexOf('.com') < 0 ? '.com' : '');
    $scope.company = {
      name: name,
      domain : domain,
      webDomain : domain
    };

    $scope.domainRegex = /^[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;
    $scope.showLoading = false;

    $scope.onDomainChange = function() {
      if (this.form.webDomain.$pristine) {
        $scope.company.webDomain = $scope.company.domain;
      }
    };

    $scope.submit = function() {
      $scope.submitted = true;
      if (this.form.name.$valid && this.form.domain.$valid && this.form.webDomain.$valid) {
        var company = {
          n: $scope.company.name,
          d: $scope.company.domain,
          wd: $scope.company.webDomain
        };
        $scope.showLoading = true;
        DataStore.companySubmit(company, function(error, data) {
          if (error) {
            if (error.sameCompanyId) {
              AlertService.show({
                type: 'warning',
                msg: 'This company has already been added.',
                keep: true,
                flash: true
              });
              $location.path('/companies/' + error.sameCompanyId);
            } else {
              AlertService.throwError(error);
              $scope.showLoading = false;
            }
          } else {
            $location.path('/companies/' + data.companyId);
          }
        });
      }
      
    };
  }]);
