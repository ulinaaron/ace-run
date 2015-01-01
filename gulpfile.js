/**
 * Setup
 * ========================
 */

var dir_assets = "assets/",
    dir_scss = 'assets/src/scss/',
    dir_scss_vendor = 'assets/src/scss/vendor/',
    dir_css = 'assets/css/',
    dir_src_js = 'assets/src/js/',
    dir_src_js_standalone = 'assets/src/js/standalone/',
    dir_src_js_plug = 'assets/src/js/plugins/',
    dir_js = 'assets/js/',
    dir_src_img = 'assets/src/img/',
    dir_img = 'assets/img/',
    dir_bower = 'assets/src/bower_components/',
    dir_npm = 'node_modules/',
    js_final = 'main', // JS final name of all the combined JS files
    // Browser Sync Settings
    dev_domain = 'genesisone.dev', // Domain or IP of project
    dev_port = '7280'
;

/**
 * Javascript Contatenation Order
 * Note: This is a temporary process.
 * Todo: Iteration needs to occur that automates the Javascript Source directory and file extension. There is no point repeating these as they will not change.
 */

var js_order = [
    // dir_src_js + 'modernizr.js',
    dir_src_js + 'conditionizr.js',
    dir_src_js + 'wow.js',
    dir_src_js + 'functions.js'
];


/**
 * Initialize
 * ========================
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    build = '';

/**
 * Task: Styles
 * ========================
 */

gulp.task('styles', function () {
    return gulp.src([dir_scss + '*.scss', '!' + dir_scss + '_*.scss'])
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
        .pipe(plugins.bless())
        .pipe(gulp.dest(dir_css))
        .pipe(reload({stream:true}));
});

/**
 * Task: Style Testing
 * ========================
 */

gulp.task('style-test', function() {
});


/**
 * Task: JS Scripts
 * ========================
 * DEPRECATION WARNING!
 * The Gulp Concat plugin will be removed in future versions as Browserfiy matures for use with Gulp.
 */

gulp.task('scripts', function () {
    return gulp.src(js_order)
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat(js_final + '.js'))
        .pipe(gulp.dest(dir_js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dir_js))
        .pipe(reload({stream:true, once:true}));
});

/**
 * Task: JS Standalone
 * ========================
 * Outputs files that are not concatenated
 */

gulp.task('scripts-standalone', function () {
    return gulp.src([dir_src_js_standalone + '*.js'])
        .pipe(gulp.dest(dir_js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dir_js))
        .pipe(reload({stream:true, once:true}));
});

/**
 * Task: JS Plugins
 * ========================
 */

gulp.task('plugins', function () {
    return gulp.src([dir_src_js_plug + '*.js'])
        .pipe(plugins.concat(js_final + '-plugins.js'))
        .pipe(gulp.dest(dir_js))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dir_js))
        .pipe(reload({stream:true, once:true}));
});


/**
 * Task: Images
 * ========================
 */

gulp.task('images', function () {
    return gulp.src(dir_src_img + '**/*')
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(dir_img))
        .pipe(reload({stream:true, once:true}));
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
 * Task: Reload
 * ========================
 */

gulp.task('reload', function () {
    browserSync.reload();
});


/**
 * Task: Bower Packages
 * ================
 * This is a manual process for components that should be included.
 * However the advantage is Gulp will fetch the latest version on bower update.
 * This function is not included in the default Gulp process.
 * Run 'gulp bower' to use.
 */

gulp.task('bower-packages', function () {

    return merge(

        // Animate.css
        gulp.src([dir_bower + 'animate.css/animate.css'])
            .pipe(plugins.rename('_animate.scss'))
            .pipe(gulp.dest(dir_scss_vendor)), // Copies to src/scss

        // Conditionizr.js
        gulp.src([dir_bower + 'conditionizr/dist/conditionizr.js'])
            .pipe(gulp.dest(dir_src_js)), // Copies to src/js

        // Move Font Awesome Fonts
        gulp.src(dir_bower + 'Font-Awesome/fonts/**/*.*', ['clean'])
            .pipe(gulp.dest(dir_assets + 'fonts')), // Copies to fonts

        // Move Font Awesome SCSS
        gulp.src(dir_bower + 'Font-Awesome/scss/**/*.*', ['clean'])
            .pipe(gulp.dest(dir_scss_vendor + 'font-awesome')), // Copies to src/scss

        // Modernizr
        gulp.src([dir_bower + 'modernizr/modernizr.js'])
            .pipe(gulp.dest(dir_src_js)), // Copies to src/js

        // Normalize
        gulp.src([dir_bower + 'normalize.css/normalize.css'])
            .pipe(plugins.rename('_base_normalize.scss'))
            .pipe(gulp.dest(dir_scss_vendor)), // Copies to src/scss

        // WOW.js
        gulp.src([dir_bower + 'WOW/dist/wow.js'])
            .pipe(gulp.dest(dir_src_js)) // Copies to src/js

    );

});

/**
 * Task: NPM Components
 * ================
 * This is a manual process for components that should be included.
 * This function is not included in the default Gulp process.
 * Run 'gulp npm-packages' to use.
 */

gulp.task('npm-packages', function () {

    return merge(

        // Node Bourbon
        gulp.src(dir_npm + 'node-bourbon/assets/stylesheets/**/*.*', ['clean'])
            .pipe(gulp.dest(dir_scss_vendor + 'node-bourbon')), // Copies to src/scss

        // Node Neat
        gulp.src(dir_npm + 'node-neat/assets/stylesheets/**/*.*', ['clean'])
            .pipe(gulp.dest(dir_scss_vendor + 'node-neat')) // Copies to src/scss
    );
});

/**
 * Task: Watch
 * ========================
 * Initiates BrowserSync and watches files for any tasks.
 */

gulp.task('watch', function() {

    browserSync.init({
        proxy: dev_domain,
        port: dev_port,
        https: false
    });

    gulp.watch(dir_scss + '**/*.scss', ['styles']);
    gulp.watch(dir_src_js + '**/*.js', ['plugins', 'scripts']);
    gulp.watch(dir_src_img + '**/*', ['images']);
    gulp.watch('**/*.php', ['reload']);
});

/**
 * Task: Default
 * ========================
 */

gulp.task('default', ['styles', 'plugins', 'scripts', 'scripts-standalone', 'images', 'clean', 'watch']);
