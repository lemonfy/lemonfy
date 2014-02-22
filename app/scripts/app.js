'use strict';

angular.module('lemonfyApp', [
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap'
])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home',
        title: 'Home',
        hideHeader: true,
        controller: 'HomeController'
      })
      .when('/companies/:id', {
        templateUrl: 'partials/company_page',
        title: 'Company reviews',
        controller: 'CompanyPageController'
      })
      .when('/ratingsubmit', {
        templateUrl: 'partials/rating_submit',
        title: 'Submit review',
        controller: 'RatingSubmitController'
      })
      .when('/validate/:token', {
        templateUrl: 'partials/validate_rating',
        title: 'Verifying review ...',
        controller: 'ValidateRatingController'
      })
      .when('/companysubmit', {
        templateUrl: 'partials/company_submit',
        title: 'Add company profile',
        controller: 'CompanySubmitController'
      })
      .when('/about', {
        title: 'About',
        templateUrl: 'partials/about'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);

    $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
  }])
  .directive('initFocus', function(){
    var timer;
    return function(scope, elm){
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        elm.focus();
      }, 0);
    };
  })
  .factory('_', function() {
    return window._;
  })
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/validate_rating',
      '<div class="spinner"></div>');
  }]);
