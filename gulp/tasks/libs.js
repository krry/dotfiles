var gulp = require('gulp')
var changed = require('gulp-changed')
var concat = require('gulp-concat');

var handleErrors = require('../util/handleErrors')

var libSrc = [
  './src/lib/jquery/dist/jquery.js',
  './src/lib/openlayers3/build/ol-debug.js',
  './src/lib/openlayers3/build/ol.js',
  './src/lib/openlayers3/build/ol.css',
  './src/lib/angular-ui-router/release/angular-ui-router.min.js',
  './src/lib/angular-touch/angular-touch.js',
  './src/lib/angular-mocks/angular-mocks.js',
  './src/lib/angular/angular.js',
  './src/lib/angular/angular.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
  './src/lib/angular-bootstrap/ui-bootstrap.min.js',
  './src/lib/normalize.css/normalize.css',
  './src/lib/firebase/firebase.js',
  './src/lib/firebase/firebase-debug.js',
  './src/lib/angularfire/dist/angularfire.js',
  './src/lib/angularfire/dist/angularfire.min.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.js',
  './src/lib/matthewlein-jQuery-widowFix/js/jquery.widowFix-1.3.2.min.js',
  './src/lib/rxjs/dist/rx.all.js',
  './src/lib/rxjs/dist/rx.all.min.js',
  './src/js/rxjs-firebase/rx.firebase.js',
  './src/lib/angular-rx/dist/rx.angular.js',
]

var libPub = './public/lib/'

gulp.task('libs', ['bower'], function(){
  return gulp.src(libSrc)
        .pipe(changed(libPub))
        .on('error', handleErrors)
        .pipe(gulp.dest(libPub))
        .pipe
})
