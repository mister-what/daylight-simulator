require("angular/angular-csp.css");
require('angular-material/angular-material.css');


/* eslint-disable no-console, no-undef*/

var uiRouter = require("angular-ui-router").default;
var ngaria = require('angular-aria'), sanitize = require('angular-sanitize'), animate = require('angular-animate'), messages = require('angular-messages'), material = require('angular-material');

module.exports = {app: 'app', deps: [uiRouter, ngaria, sanitize, animate, messages, material]};
