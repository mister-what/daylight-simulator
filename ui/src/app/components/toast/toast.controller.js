module.exports = function ($interval) {
  "use strict";
  var ctrl = this;
  ctrl.count = 30;
  var interval;
  interval = $interval(function () {
    if (ctrl.count > 0) {
      --ctrl.count;
    }
  }, 1000);
  ctrl.$onDestroy = function () {
    if (interval) {
      $interval.cancel(interval);
    }
  };
};
