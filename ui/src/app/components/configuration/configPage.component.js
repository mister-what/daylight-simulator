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
        $mdToast.show(
          $mdToast.simple()
            .textContent('Saved!')
            .position('bottom left')
            .hideDelay(3000)
        );
      },
      failed: function (result) {
        ctrl.error = true;
        ctrl.loaded = true;
        ctrl.config = result;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Save failed...')
            .position('bottom left')
            .hideDelay(3000)
        );
      }
    };
    ctrl.$onInit = onInit;
    ctrl.saveConfig = saveConfig;
    ctrl.resetConfig = resetConfig;
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
    
    function resetConfig() {
      function configRetrieveHandler(config) {
        ctrl.config = config;
        $mdToast.show(
          $mdToast.simple()
            .textContent('Config Reset!')
            .position('bottom left')
            .hideDelay(3000)
        );
      }
      
      configService.getConfig().then(configRetrieveHandler, rejectHandler);
    }
    
    function newUser() {
      $mdToast.show({
        hideDelay: 30000,
        position: 'bottom left',
        template: require('../toast/toast.template.html'),
        controller: 'hueBtnToastController',
        controllerAs: '$ctrl'
      });
      configService.newUser().then(function () {
        $mdToast.hide();
        onInit();
      });
    }
    
    function onInit() {
      configService.getConfig().then(configRetrieveHandler, rejectHandler, configRetrieveHandler);
    }
  }
};
