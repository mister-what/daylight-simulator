"use strict";
module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
    .state('home', {
      url: '/',
      component: 'home',
      resolve: {
        configDone: function ($http, $state) {
          return $http.get('/api/config/done').then(function (result) {
            if (result.data.configDone !== true) {
              return $state.go('config');
            }
            return true;
          });
        }
      }
    })
    .state('config', {
      url: '/config',
      component: 'configPage'
    });
}
