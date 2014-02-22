'use strict';

angular.module('lemonfyApp')
  .controller('RatingSubmitController', ['$scope', '$location', '_', 'RouteCache', 'DataStore', 'AlertService', function ($scope, $location, _, RouteCache, DataStore, AlertService) {

    $scope.company = RouteCache.get('rating-submit-company');
    if (!$scope.company) {
      $location.path('/');
      return;
    }
    //RouteCache.set('rating-submit-company', null);

    DataStore.getTagNames().then(function(res) {
      $scope.titles = res.data.titles;
      $scope.locations = res.data.locations;
    });

    $scope.showLoading = false;
    $scope.showSuccess = false;

    $scope.rating = {
      score: 0
    };

    $scope.submitted = false;

    $scope.checkScore = function() {
      return _.contains([1, 2, 3, 4, 5], $scope.rating.score);
    };

    $scope.submit = function() {
      $scope.submitted = true;
      if ($scope.checkScore() && this.form.email.$valid &&
          this.form.title.$valid && this.form.location.$valid && this.form.comment.$valid) {
        var rating = {
          cid: $scope.company.id,
          email: $scope.rating.email,
          s: $scope.rating.score,
          t: $scope.rating.title,
          l: $scope.rating.location,
          c: $scope.rating.comment
        };
        $scope.showLoading = true;
        DataStore.ratingSubmit(rating, function(error) {
          $scope.showLoading = false;
          if (error){
            AlertService.throwError(error);
          } else {
            $scope.rating.email = $scope.rating.email.toLowerCase() + '@' + $scope.company.domain;

            AlertService.show({
              type: 'success',
              msg: '<div><strong>Thanks for submitting your review!</strong></div>' +
                    '<p>Please check your email <em>' + $scope.rating.email +
                    '</em> for our instruction to verify your submission.</p>'
            });

            $scope.showSuccess = true;
          }
        });
      }
    };
  }]);
