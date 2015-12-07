'use strict';

angular.module('app.contact', [
  'app.contact.factories',
  'ui.router'
])

  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('contact', {
        url: '/contact',
        views: {
          app: {
            controller: 'ContactCtrl',
            templateUrl: 'contact/contact.tpl.html'
          }
        }
      });
  }])

  .controller('ContactCtrl', ['$scope', '$state', function($scope, $state){

    $scope.$state = $state;

  }])
;