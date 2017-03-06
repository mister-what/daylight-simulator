module.exports = {
  template: require('./configPage.template.html'),
  bindings: {},
  controller: function (configService, $timeout, $mdToast) {
    var ctrl = this;
    ctrl.loaded = false;
    var saveHandler = {
      successful: function (result) {
        ctrl.error = false;
        ctrl.loaded = true;
        ctrl.saved = true;
        ctrl.config = result;
        $timeout(function () {
          ctrl.saved = null;
        }, 5000);
      },
      failed: function (result) {
        ctrl.error = true;
        ctrl.loaded = true;
        ctrl.config = result;
      }
    };
    ctrl.$onInit = onInit;
    ctrl.saveConfig = saveConfig;
    ctrl.newUser = newUser;
    
    function configRetrieveHandler(config) {
      ctrl.config = config;
      ctrl.loaded = true;
      $mdToast.hide();
    }
    
    function rejectHandler() {
      ctrl.error = true;
    }
    
    function saveConfig() {
      configService.setConfig(ctrl.config).then(saveHandler.successful, saveHandler.failed);
    }
    
    function newUser() {
      ctrl.pressHueBridgeButton = true;
      configService.newUser().then(function () {
        onInit();
        $mdToast.show(
          $mdToast.simple()
            .textContent('Press Button on Hue Bridge')
            .position('Bottom Left')
            .hideDelay(30000)
        );
      });
    }
    
    function onInit() {
      configService.getConfig().then(configRetrieveHandler, rejectHandler, configRetrieveHandler);
    }
  }
};
