module.exports = function ($http, $q, $timeout) {
  "use strict";
  var vm = this;
  
  var config = null;
  vm.getConfig = getConfig;
  vm.setConfig = setConfig;
  vm.newUser = newUser;
  
  function getConfig() {
    var deferred = $q.defer();
    $timeout(function () {
      if (config) {
        deferred.notify(config);
      }
    });
    $http.get('/api/config').then(function (result) {
      if(result.status < 200 || result.status >= 300) {
        return deferred.reject();
      }
      result = result.data;
      if (!result) {
        return deferred.reject();
      }
      config = result;
      deferred.resolve(config);
    }, deferred.reject);
    return deferred.promise;
  }
  
  function setConfig(newConfig) {
    var deferred = $q.defer();
    newConfig = newConfig || {};
    $http.put('/api/config', newConfig).then(function (result) {
      if (result.status !== 200) {
        return deferred.reject(config);
      }
      result = result.data;
      config = result;
      deferred.resolve(config);
    }, function () {
      deferred.reject(config);
    });
    return deferred.promise;
  }
  
  function newUser(bridgeIp) {
    var deferred = $q.defer();
    var startTime = new Date();
    var body = {
      bridgeIp: bridgeIp
    };
    
    function reRequest() {
      if (startTime.setSeconds(60) < new Date()) {
        return deferred.reject();
      }
      $http.post('/api/user/new', body).then(function (result) {
        if (result.data.done) {
          return deferred.resolve();
        }
        deferred.notify();
        $timeout(reRequest, 1000);
      }, deferred.reject);
    }
    
    reRequest();
    return deferred.promise;
  }
  
  getConfig();
};
