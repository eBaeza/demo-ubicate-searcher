var gulp       = require('gulp');
var concat     = require('gulp-concat');
var jsmin      = require('gulp-jsmin');
var sass       = require('gulp-sass');
var prefixes   = require('gulp-autoprefixer');
var watch      = require('gulp-watch');
var livereload = require('gulp-livereload');
var notify     = require('gulp-notify');

// only reload when modified html
gulp.task('html', function() {
  gulp.src('app/')
    .pipe(notify({ message : 'modified HTML'}))
    .pipe(livereload());
});

// concat and minify js
gulp.task('js', function() {
  gulp.src([
      './app/core/*.js',
      './app/app.js',
      './app/controllers/*.js'
    ])
    .pipe(concat('allscripts.js'))
    // .pipe(jsmin())
    .pipe(gulp.dest('./app/'))
    .pipe(notify({ message : "js"}))
    .pipe(livereload());;
});

// compile sass and add prefixes
gulp.task('sass', function () {
  gulp.src('./app/css/styles.s*ss')
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefixes('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
    .pipe(gulp.dest('./app/css/'))
    .pipe(notify({ message : "sass autoprefixer"}))
    .pipe(livereload());
});

// watch modified files
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch(['app/**/*.js', '!app/allscripts.js'], ['js']);
  gulp.watch(['app/css/**/*.scss','app/css/**/*.sass'], ['sass']);
});

gulp.task('default', ['sass', 'js', 'watch']);