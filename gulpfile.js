var gulp = require('gulp'), // init
    uglify = require('gulp-uglify'), // min - js
    uglifycss = require('gulp-uglifycss'), // min - css
    plumber = require('gulp-plumber'), // plumber - error log
    concat = require('gulp-concat'), // concat - connect all file into one - node 6
    sourcemaps = require('gulp-sourcemaps'), // sourcemaps generater
    autoprefixer = require('gulp-autoprefixer'), // add pre-fix for all browser
    imagemin = require('gulp-imagemin'), // image min
    htmlmin = require('gulp-htmlmin'), // image min
    swPrecache = require('sw-precache'), // precache for service worker
    critical = require('critical'), // critical fold generator
    browserSync = require('browser-sync'); // browser reload

gulp.task('html', function() {
    gulp.src('*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
    console.log('Uglify CSS from MANUAL ');
});
gulp.task('css', function() {
    gulp.src('css/*.css')
        .pipe(sourcemaps.init())
        .pipe(uglifycss({
            "uglyComments": true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
    console.log('Uglify CSS from MANUAL ');
});
gulp.task('js', function() {
    gulp.src('js/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('other.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
    console.log('Uglify JS off from MANUAL ');
});
gulp.task('image', () =>
	gulp.src('img/*.*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/img/'))
);
gulp.task('critical', function (cb) {
    critical.generate({
        inline: true,
        base: '.',
        src: 'dist/index.html',
        dest: 'dist/index.html',
        minify: true,
        width: 320,
        height: 480,
        timeout: 900000
    });
    console.log('critical off from MANUAL ');
});
gulp.task('sw', function(callback) {
  var swPrecache = require('sw-precache');
  var rootDir = 'dist/';

  swPrecache.write('dist/service-worker.js', {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2,json,ico}'],
    stripPrefix: rootDir,
    maximumFileSizeToCacheInBytes: 10485760
  }, callback);
});

// browser-sync task for starting the server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('watch', ['browser-sync', 'js', 'css', 'html'], function() {
    console.log('Browser Sync off MANUAL RELOAD');
    gulp.watch("js/*.js", ['js']);
    gulp.watch("css/*.css", ['css']);
    gulp.watch("*.html", ['html']).on('change', browserSync.reload);
});
gulp.task('default', ['watch'], function() {
    console.log('gulp watch');
});