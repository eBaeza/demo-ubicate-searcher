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

// concat and minify js loaders
gulp.task('vendorsloaders', function() {
  gulp.src([
      './app/js/vendors/loadCSS.js',
      './app/js/vendors/angular-loader.min.js',
      './app/js/vendors/scripts-loader.min.js'
    ])
    .pipe(concat('vendorsloaders.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('./app/dist/js/'))
    .pipe(notify({ message : "vendors loaders"}))
    .pipe(livereload());
});

// concat and minify js scripts
gulp.task('js', function() {
  gulp.src([
      './app/app.js',
      './app/controllers/*.js'
    ])
    .pipe(concat('appscripts.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('./app/dist/js/'))
    .pipe(notify({ message : "app scripts"}))
    .pipe(livereload());
});

// compile sass and add prefixes
gulp.task('sass', function () {
  gulp.src('./app/sass/styles.s*ss')
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefixes('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
    .pipe(gulp.dest('./app/dist/css/'))
    .pipe(notify({ message : "sass autoprefixer"}))
    .pipe(livereload());
});

// watch modified files
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch(['app/css/**/*.s*ss'], ['sass']);
  gulp.watch(['app/js/vendors/**/*.js'], ['vendorsloaders']);
  gulp.watch([
      'app/**/*.js', 
      '!app/dist/**/*.js', 
      '!app/js/vendors/**/*.js'
    ], ['js']);
});

gulp.task('default', ['sass', 'vendorsloaders', 'js', 'watch']);