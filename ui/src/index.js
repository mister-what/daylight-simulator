var angular = require('angular');
require('angular-animate');
require('angular-messages');
require('angular-aria');
require('angular-sanitize');
require('angular-material');
require('angular-material/angular-material.css');

var hello = require('./app/hello');
var configPage = require('./app/components/configuration/configPage.component');
require('angular-ui-router');
var routesConfig = require('./routes');

require('./index.scss');

var app = 'app';
module.exports = app;
 // bla
 
angular
  .module(app, ['ui.router', 'ngAria', 'ngSanitize', 'ngAnimate', 'ngMessages', 'ngMaterial'])
  .config(routesConfig)
  .component('app', hello)
  .component('configPage', configPage)
  .service('configService', require('./app/services/config.service'));
