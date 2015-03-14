var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserify  = require('browserify');
var browserSync = require('browser-sync');
var source      = require('vinyl-source-stream');
var reactify    = require('reactify');
var less        = require('gulp-less');
var clean       = require('gulp-clean');

var port = process.env.port || 3000;

gulp.task('browserify', function() {
    return browserify('./app/js/main.js')
        .transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('less', function() {
    return gulp.src('./app/styles/main.less')
        .pipe(plumber())
        .pipe(less({ compress: true }))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('html', function() {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest('./build'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('img', function() {
    return gulp.src('./app/img/**')
        .pipe(gulp.dest('./build/img'))
        .pipe(gulp.dest('./dist/img'))
});

gulp.task('clean:build', function() {
    return gulp.src('./build/**.*')
        .pipe(clean({force: true}))
});

gulp.task('clean:dist', function() {
    return gulp.src('./dist/**.*')
        .pipe(clean({force: true}))
});

gulp.task('copy:fonts', function() {
    return gulp.src('./node_modules/font-awesome/fonts/**')
        .pipe(gulp.dest('./build/fonts'))
        .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('server', function () {
    browserSync({
        port: port,
        server: {
            baseDir: 'build'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['./app/js/**/*.js'], ['browserify', browserSync.reload]);
    gulp.watch(['./app/styles/**/*.less'], ['less', browserSync.reload]);
    gulp.watch(['./app/index.html'], ['html', browserSync.reload]);
});

gulp.task('default', [
    'clean:build',
    'clean:dist',
    'copy:fonts',
    'html',
    'img',
    'browserify',
    'less',
    'server',
    'watch'
]);
