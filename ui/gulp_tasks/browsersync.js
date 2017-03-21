const gulp = require('gulp');
var webpackSettings = require("../conf/webpack.conf");
var webpack = require("webpack");
const conf = require('../conf/gulp.conf');
const browserSync = require('browser-sync');
var url = require('url');
var proxy = require('proxy-middleware');
const spa = require('browser-sync-spa');

const browserSyncConf = require('../conf/browsersync.conf');
const browserSyncDistConf = require('../conf/browsersync-dist.conf');

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");

var bundler = webpack(webpackSettings);

browserSync.use(spa());

gulp.task('browsersync', browserSyncServe);
gulp.task('browsersync:dist', browserSyncDist);
gulp.task('browsersync:proxy', function() {
  var proxyOptions = url.parse('http://localhost:3000/');
  proxyOptions.route = '/api';
  // requests to `/api/x/y/z` are proxied to `http://localhost:3000/secret-api`
  
  browserSync({
    open: true,
    port: 5000,
    server: {
      baseDir: [
        webpackSettings.output.path,
        conf.paths.src
      ],
      middleware: [
        proxy(proxyOptions),
        webpackDevMiddleware(bundler, {
          publicPath: webpackSettings.output.publicPath,
          stats: {colors: true}
        }),
        webpackHotMiddleware(bundler)
      ]
    }
  });
});

function browserSyncServe(done) {
  browserSync.init(browserSyncConf());
  done();
}

function browserSyncDist(done) {
  browserSync.init(browserSyncDistConf());
  done();
}
