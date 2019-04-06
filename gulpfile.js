var gulp = require('gulp');
var uglifyjs = require('uglify-es');
var composer = require('gulp-uglify/composer');
var pump = require('pump');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');

var minify = composer(uglifyjs, console);

gulp.task('compressJS', function (cb) {
    // the same options as described above
    var options = {};
   
    pump([
        gulp.src('src/*.js'),
        sourcemaps.init(),
        minify(options),
        sourcemaps.write('.'),
        gulp.dest('dist')
      ],
      cb
    );
  });

  gulp.task('clean:dist', function() {
    return del.sync('dist');
  });

  gulp.task('watch', function(){
    gulp.watch('src/*.js', gulp.series('compressJS')); 
  })