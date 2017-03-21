const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
const webpackConf = require('../conf/webpack.conf');
const webpackDistConf = require('../conf/webpack-dist.conf');
const gulpConf = require('../conf/gulp.conf');
const browsersync = require('browser-sync');

gulp.task('webpack:dev', function () {
  //webpackWrapper(false, webpackConf, done);
  webpackDevServerWrapper();
});

gulp.task('webpack:watch', done => {
  webpackWrapper(true, webpackConf, done);
});

gulp.task('webpack:dist', done => {
  process.env.NODE_ENV = 'production';
  webpackWrapper(false, webpackDistConf, done);
});


function webpackWrapper(watch, conf, done) {
  const webpackBundler = webpack(conf);

  const webpackChangeHandler = (err, stats) => {
    if (err) {
      gulpConf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if (done) {
      done();
      done = null;
    } else {
      browsersync.reload();
    }
  };

  if (watch) {
    webpackBundler.watch(1000, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
}


function webpackDevServerWrapper() {
  
  // First we fire up Webpack an pass in the configuration we
  // created
  var bundleStart = null;
  var compiler = webpack(webpackConf);
  
  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', function () {
    console.log('Bundling...');
    bundleStart = Date.now();
  });
  
  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', function () {
    console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
  });
  
  var bundler = new WebpackDevServer(compiler, {
    
    // We need to tell Webpack to serve our bundled application
    // from the build path. When proxying:
    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath: '/',
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: {"^/api": ""}
      }
    },
    // Configure hot replacement
    hot: true,
    
    // The rest is terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });
  
  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(8080, 'localhost', function () {
    console.log('Bundling project, please wait...');
  });
  
}
