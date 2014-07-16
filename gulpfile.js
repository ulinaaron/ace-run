// Assset Directories & Files
var dir_scss = 'assets/src/scss/',
    dir_css = 'assets/css/',
    dir_src_js = 'assets/src/js/',
    dir_src_js_plug = 'assets/src/js/plugins/',
    dir_js = 'assets/js/',
    dir_src_img = 'assets/src/img/',
    dir_img = 'assets/img/',
    js_final = 'main' // JS final name of all the combined JS files
;

// Initialization sequence
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    lr = require('tiny-lr'),
    server = lr(),
    build = '';;

/*
.pipe(plugins.sass({
           errLogToConsole: true
        }))

.pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
*/

gulp.task('styles', function () {
    return gulp.src([dir_scss + '*.scss', !dir_scss + '_*.scss'])
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest(dir_css))
        .pipe(plugins.minifyCss({
            keepSpecialComments: 1
        }))
        .pipe(plugins.livereload(server))
        .pipe(gulp.dest(build));
});

gulp.task('plugins', function () {
    return gulp.src([dir_js + '*.js', dir_src_js_plug + 'plugins.js'])
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
    return gulp.src([dir_src_js + '*.js', dir_src_js + '!plugins.js'])
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

gulp.task('clean', function () {
    return gulp.src(build + '**/.DS_Store', {
            read: false
        })
        .pipe(plugins.rimraf());
});

gulp.task('bower_components', function () { // Executed on bower update
    return gulp.src(['assets/bower_components/normalize.css/normalize.css'])
        .pipe(plugins.rename('_base_normalize.scss'))
        .pipe(gulp.dest(dir_scss));
});

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
