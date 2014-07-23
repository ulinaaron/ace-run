// Assset Directories & Files
var dir_assets = "assets/",
    dir_scss = 'assets/src/scss/',
    dir_css = 'assets/css/',
    dir_src_js = 'assets/src/js/',
    dir_src_js_plug = 'assets/src/js/plugins/',
    dir_js = 'assets/js/',
    dir_src_img = 'assets/src/img/',
    dir_img = 'assets/img/',
    dir_bower = 'assets/src/bower_components/',
    js_final = 'main' // JS final name of all the combined JS files
;

// Initialization sequence
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    lr = require('tiny-lr'),
    merge = require('merge-stream'),
    server = lr(),
    build = '';;

/**
 * Task: Styles
 * ========================
 */

gulp.task('styles', function () {
    return gulp.src([dir_scss + '*.scss', !dir_scss + '_*.scss'])
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
        .pipe(plugins.bless())
        .pipe(gulp.dest(dir_css))
        .pipe(plugins.minifyCss({
            keepSpecialComments: 1
        }))
        .pipe(plugins.livereload(server))
        .pipe(gulp.dest(build));
});

gulp.task('plugins', function () {
    return gulp.src([dir_src_js_plug + '*.js'])
        .pipe(plugins.concat(js_final + '-plugins.js'))
        .pipe(gulp.dest(dir_js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.livereload(server))
        .pipe(gulp.dest(dir_js));
});

gulp.task('scripts', function () {
    return gulp.src([dir_src_js + '*.js', dir_src_js + 'functions.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat(js_final + '.js'))
        .pipe(gulp.dest(dir_js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.livereload(server))
        .pipe(gulp.dest(dir_js));
});

/**
 * Who Watches The Watchmen
 * ========================
 */

gulp.task('images', function () {
    return gulp.src(dir_src_img + '**/*')
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        })))
        .pipe(plugins.livereload(server))
        .pipe(gulp.dest(dir_img));
});

/**
 * Task: Clean
 * ========================
 */

gulp.task('clean', function () {
    return gulp.src(build + '**/.DS_Store', {
            read: false
        })
        .pipe(plugins.rimraf());
});

/**
 * Task: Bower Components
 * ================
 * This is a manual process for components that should be included.
 * However the advantage is Gulp will fetch the latest version on bower update.
 * This function is not included in the default Gulp process.
 * Run 'gulp bower' to use.
 */

gulp.task('bower', function () {

    return merge(
        // Normalize
        gulp.src([dir_bower + 'normalize.css/normalize.css'])
            .pipe(plugins.rename('_base_normalize.scss'))
            .pipe(gulp.dest(dir_scss)),

        // Animate.css
        gulp.src([dir_bower + 'animate.css/animate.css'])
            .pipe(plugins.rename('_animate.scss'))
            .pipe(gulp.dest(dir_scss)),

        // Move Font Awesome Fonts
        gulp.src(dir_bower + 'Font-Awesome/fonts/**/*.*', ['clean'])
            .pipe(gulp.dest(dir_assets + 'fonts'))
    );

});

/**
 * Who Watches The Watchmen
 * ========================
 */

gulp.task('watch', function () {
    server.listen(95134, function (err) { // Listen on port 35729
        if (err) {
            return console.log(err)
        };
        gulp.watch(dir_scss + '*.scss', ['styles']);
        gulp.watch(dir_src_js + '**/*.js', ['plugins', 'scripts']);
        gulp.watch(dir_src_img + '**/*', ['images']);
        gulp.watch(build + '**/*.php').on('change', function (file) {
            plugins.livereload(server).changed(file.path);
        });
    });
});

gulp.task('default', ['styles', 'plugins', 'scripts', 'images', 'clean', 'watch']);

/*
This gulpfile was forked from https://github.com/synapticism/wordpress-gulp-bower-sass
*/
