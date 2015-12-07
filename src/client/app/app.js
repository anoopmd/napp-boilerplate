'use strict';

// TODO app.tpl.html should be a container and index.html moved to public, which assets injected in.

angular.module('app', [
  // global deps
  'app.templates',
  'app.filters',
  'app.factories',
  'app.directives',
  // module deps
  'app.home',
  'app.about',
  'app.contact',
  // 3rd party deps
  'ui.bootstrap',
  'ui.router'
])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    // Edit your default route
    $urlRouterProvider.otherwise('/home');
    $locationProvider.hashPrefix('!');
  }])

  .run(['$rootScope', '$http', function($rootScope, $http) {
    $rootScope.appName = 'APP_NAME';
    $rootScope.appVersion = 'APP_VERSION';

    // set http defaults
    $http.defaults.headers.common.Accept = 'application/json';

    // allow CORS
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
  }])

  .controller('AppCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {

    $scope.$state = $state;

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if ('data' in toState && angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = $rootScope.appName + ' : ' + toState.data.pageTitle;
        document.title = $scope.pageTitle;
      }
    });

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      if ('data' in toState && angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = $rootScope.appName + ' : ' + toState.data.pageTitle;
        document.title = $scope.pageTitle;
      }
    });

    // global root variables
    $rootScope.amDateFormat = 'MM/DD/YYYY';

  }])

;
