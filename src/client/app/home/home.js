'use strict';

angular.module('app.home', [
  'app.home.factories',
  'ui.router'
])

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          app: {
            controller: 'HomeCtrl',
            templateUrl: 'home/home.tpl.html'
          }
        }
      });
  }])

  .controller('HomeCtrl', ['$scope', '$state', function($scope, $state){

    $scope.$state = $state;

  }])
;