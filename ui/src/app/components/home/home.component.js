"use strict";
/* eslint-disable no-console*/
module.exports = {
  bindings: {
    configDone: '<',
    onConfigDoneChanged: '&'
  },
  template: require('./home.component.html'),
  styles: require('./home.component.scss'),
  controller: function (/*, colorService*/) {
    var ctrl = this;
    ctrl.$onChanges = onChanges;
    ctrl.$onInit = onInit;
    ctrl.configDoneChanged = configDoneChanged;
    
    function onInit() {
      //do init stuff
      ctrl.output = "out";
    }
    
    function onChanges(change) {
      console.log(change);
      if (change.configDone) {
        // todo
      }
      
    }
    
    function configDoneChanged(newValue) {
      ctrl.configDone = newValue;
      ctrl.onConfigDoneChanged({configDone: newValue});
    }
    
  }
};
/* eslint-enable no-console*/
