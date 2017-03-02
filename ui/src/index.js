var angular = require('angular');

var hello = require('./app/hello');
require('angular-ui-router');
var routesConfig = require('./routes');

require('./index.scss');

var app = 'app';
module.exports = app;
 // bla
 
angular
  .module(app, ['ui.router'])
  .config(routesConfig)
  .component('app', hello)
  .service('configService', require('./app/services/config.service'));
