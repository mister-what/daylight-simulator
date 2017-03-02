module.exports = {
  template: require('./hello.html'),
  controller: function () {
    this.hello = 'Hello World!';
  }
};
