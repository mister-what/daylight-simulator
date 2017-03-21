require('../index.scss');
var parts = {
  routes: require('../routes'),
  configPage: require('../app/components/configuration/configPage.component'),
  configService: require('../app/components/configuration/configPage.component'),
  colorService: require('../app/services/color.service'),
  topBar: require('../app/components/toolbar/toolbar.component'),
  home: require('../app/components/home/home.component'),
  hueBtnToastController: require('../app/components/toast/toast.controller')
};

require.ensure(["../index", "angular"], function (require) {
  var angular = require("angular");
  var moduledef = require("../index");
  angular.module(moduledef.app, moduledef.deps)
    .config(parts.routes)
    .component('configPage', parts.configPage)
    .service('configService', parts.configService)
    .service('colorService', parts.colorService)
    .component('topBar', parts.topBar)
    .component('home', parts.home)
    .controller('hueBtnToastController', parts.hueBtnToastController);
}, "framework");
