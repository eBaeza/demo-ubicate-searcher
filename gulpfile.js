var gulp       = require('gulp');
var concat     = require('gulp-concat');
var jsmin      = require('gulp-jsmin');
var sass       = require('gulp-sass');
var prefixes   = require('gulp-autoprefixer');
var watch      = require('gulp-watch');
var livereload = require('gulp-livereload');
var notify     = require('gulp-notify');
var replace    = require('gulp-replace');
var fs         = require('fs');
var rename     = require('gulp-rename');

// only reload when modified html
gulp.task('html', function() {
  return gulp.src('dist/')
    .pipe(notify({ message : 'modified HTML'}))
    .pipe(livereload());
});

// concat and minify js loaders
gulp.task('vendors-loaders', function() {
  return gulp.src([
      'src/js/vendors/loadCSS.js',
      'src/js/vendors/angular-loader.min.js',
      'src/js/vendors/scripts-loader.min.js'
    ])
    .pipe(concat('vendorsloaders.js'))
    .pipe(jsmin())
    .pipe(gulp.dest('dist/js/'))
    .pipe(notify({ message : "vendors loaders"}))
});

// inject loaders
gulp.task('inject-loaders', ['vendors-loaders'], function () {
  var wrapinit = '\/\*\* START_loaders \*\*\/\n\t\t\t';
  var wrapend  = '\n\t\t\t\/\*\* END_loaders \*\*\/';

  fs.readFile('dist/js/vendorsloaders.js', 'utf8', function (err, data) {
    data = data || '';
    var content = wrapinit +  data.replace(/[\n]/g, '') + wrapend;

    return gulp.src('src/index-src.html')
      .pipe(replace(/(\/\*\* START_loaders \*\*\/)(.|[\r\n])*(\/\*\* END_loaders \*\*\/)/g, content))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('dist/'))
      .pipe(notify({ message : 'inject loaders'}))
      .pipe(livereload());;
  });
});

// concat and minify js scripts
gulp.task('appjs', function() {
  return gulp.src([
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
  return gulp.src('src/sass/styles.s*ss')
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
  gulp.watch('src/js/vendors/**/*.js', ['inject-loaders']);
  gulp.watch('src/index-src.html', ['inject-loaders'])
  gulp.watch('src/sass/**/.s*ss', ['sass']);
  gulp.watch('src/app/**/*.js', ['appjs']);
});

// default task
gulp.task('default', [
  'sass',
  'inject-loaders',
  'appjs',
  'watch'
]);