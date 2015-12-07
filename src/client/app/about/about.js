'use strict';

angular.module('app.about', [
  'app.about.factories',
  'ui.router'
])

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('about', {
        url: '/about',
        views: {
          app: {
            controller: 'AboutCtrl',
            templateUrl: 'about/about.tpl.html'
          }
        }
      });
  }])

  .controller('AboutCtrl', ['$scope', '$state', function($scope, $state){

    $scope.$state = $state;

  }])
;