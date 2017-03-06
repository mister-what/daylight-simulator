module.exports = {
  template: require('./toolbar.template.html'),
  bindings: {},
  controller: function ($mdSidenav, $timeout) {
    var ctrl = this;
    ctrl.toggleLeft = function () {
      $mdSidenav("left").toggle();
    };
    ctrl.closeLeft = function () {
      $timeout(function () {
        $mdSidenav("left").close();
      }, 100);
    };
  }
};
