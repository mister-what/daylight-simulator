module.exports = function ($http, $q, $timeout) {
  "use strict";
  var vm = this;
  // var config = {};
  vm.getConfig = function () {
    
  };
  vm.newUser = function (bridgeIp) {
    var deferred = $q.defer();
    var startTime = new Date();
    var body = {
      bridgeIp: bridgeIp
    };
    function reRequest() {
      if(startTime.setSeconds(60) < new Date()) {
        return deferred.reject();
      }
      $http.post('/api/user/new', body).then(function (result) {
        if(result.data.done) {
          return deferred.resolve();
        }
        deferred.notify();
        $timeout(reRequest, 1000);
      }, deferred.reject);
    }
    reRequest();
    return deferred.promise;
  };
  vm.setConfig = function () {
    
  };
};
