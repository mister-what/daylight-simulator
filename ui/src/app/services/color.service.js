module.exports = function ($http, $q, $timeout) {
  "use strict";
  var vm = this;
  vm.get24hColors = get24hColors;
  vm.setColor = setColor;
  vm.getColorConfig = getColorConfig;
  vm.setColorConfig = setColorConfig;
  
  var colorArray;
  
  function get24hColors() {
    var deferred = $q.defer();
    if (colorArray) {
      $timeout(function () {
        deferred.notify(colorArray);
      });
    }
    $http.get('/api/colors/byMinute').then(function (result) {
      if (result.status < 300 && result.status >= 200) {
        colorArray = result.data;
        deferred.resolve(colorArray);
      } else {
        deferred.reject();
      }
    }, deferred.reject);
    return deferred.promise;
  }
  
  var colorConfig;
  
  function getColorConfig() {
    var deferred = $q.defer();
    if (colorConfig) {
      $timeout(function () {
        deferred.notify(colorConfig);
      });
    }
    $http.get('/api/colors/intervals').then(function (result) {
      if (result.status < 300 && result.status >= 200) {
        colorConfig = result.data;
        deferred.resolve(colorConfig);
      } else {
        deferred.reject();
      }
    }, deferred.reject);
    return deferred.promise;
  }
  
  function setColorConfig(colorConfig) {
    var deferred = $q.defer();
    $http.put('/api/colors/intervals', colorConfig).then(function(result) {
      if (result.status < 300 && result.status >= 200) {
        colorConfig = result.data;
        deferred.resolve(colorConfig);
      } else {
        deferred.reject();
      }
    }, deferred.reject);
  }
  
  function setColor(hours, minutes, color) {
    var deferred = $q.defer();
    $http.post('/api/colors/' + hours + ':' + minutes + '/new', color).then(function(result) {
      if (result.status < 300 && result.status >= 200) {
        colorConfig = result.data;
        deferred.resolve(colorConfig);
      } else {
        deferred.reject();
      }
    }, deferred.reject);
  }
  
  get24hColors();
  getColorConfig();
  
};
