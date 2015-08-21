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
  gulp.src('dist/')
    .pipe(notify({ message : 'modified HTML'}))
    .pipe(livereload());
});

// concat and minify js loaders
gulp.task('vendorsloaders', function() {
  gulp.src([
      'src/js/vendors/loadCSS.js',
      'src/js/vendors/angular-loader.min.js',
      'src/js/vendors/scripts-loader.min.js'
    ])
    .pipe(concat('vendorsloaders.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({ message : "vendors loaders"}))
    .pipe(livereload());
});

// concat and minify js scripts
gulp.task('appjs', function() {
  gulp.src([
      'src/app/app.js',
      'src/app/controllers/*.js'
    ])
    .pipe(concat('appscripts.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({ message : "appjs"}))
    .pipe(livereload());
});

// compile sass and add prefixes
gulp.task('sass', function () {
  gulp.src('src/sass/styles.s*ss')
    .pipe(sass({ indentedSyntax: true }).on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefixes('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(notify({ message : "sass autoprefixer"}))
    .pipe(livereload());
});

// watch modified files
gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('dist/**/*.html', ['html']);
  gulp.watch(['src/sass/**/.s*ss'], ['sass']);
  gulp.watch(['src/js/vendors/**/*.js'], ['vendorsloaders']);
  gulp.watch(['src/app/**/*.js'], ['appjs']);
});

gulp.task('default', ['sass', 'vendorsloaders', 'appjs', 'watch']);