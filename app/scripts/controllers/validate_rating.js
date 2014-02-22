'use strict';

angular.module('lemonfyApp')
  .controller('ValidateRatingController', ['$route', '$location', 'DataStore', 'AlertService', function ($route, $location, DataStore, AlertService) {
    DataStore.validateRating($route.current.params.token, function(error, data) {
      if (error) {
        AlertService.show({
          type: 'warning',
          msg: '<strong>We cannot verify your submission.</strong><br>Your review might have been expired. Please try submitting it again.',
          keep: true,
          flash: true
        });
        $location.path('/');
      } else {
        AlertService.show({
          type: 'success',
          msg: '<div><strong>Your review has been verified!</strong></div>' +
                '<p>Thanks again for your submission.</p>',
          keep: true,
          flash: true
        });
        $location.path('/companies/' + data.companyId);
      }
    });
  }]);
