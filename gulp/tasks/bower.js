/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

  BOWER
  supports LIBS task

  runs `bower install` before the libs are concatenated

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

var gulp = require('gulp');
var bower = require('bower');

gulp.task('bower', function(cb){
  bower.commands.install([], { save: true }, {})
    .on('end', function(installed){
      cb(); // notify gulp that this task is finished
    });
});
