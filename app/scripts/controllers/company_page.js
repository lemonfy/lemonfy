'use strict';

angular.module('lemonfyApp')
  .controller('CompanyPageController', ['$scope', '$route', '$location', 'DataStore', 'AlertService', '_', 'RouteCache', function ($scope, $route, $location, DataStore, AlertService, _, RouteCache) {
    DataStore.getCompanyRatings($route.current.params.id, function(err, data) {
      if (err) {
        err.keep = true;
        AlertService.throwError(err);
        $location.path('/');
      } else {
        $scope.company = {
          id: data.company.id,
          name: data.company.n,
          domain: data.company.d,
          webDomain: data.company.wd,
          ratingsCount: data.company.r,
          avgScore: data.company.s,
        };

        $scope.ratings = _.map(data.ratings, function(rating) {
          return {
            score: rating.s,
            title: rating.t,
            location: rating.l,
            comment: rating.c,
            submitted: rating.ts
          };
        });

        var company = $scope.company;
        company.webDomain = _.isEmpty(company.webDomain) ? company.domain : company.webDomain;

        $scope.rating = {score : Math.floor(company.avgScore)};

        RouteCache.set('rating-submit-company', company);
      }
    });
    
  }]);
