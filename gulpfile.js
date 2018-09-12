var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var del = require('del');

// Less plugins
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var LessAutoprefix = new LessAutoprefix({
    browsers: ['last 2 versions']
})

// Handlebars plugins
var handlebars = require('gulp-handlebars');
var handlebarsLib = require('handlebars');
var declare = require('gulp-declare');
var wrap = require('gulp-wrap');

// File paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/scripts/**/*.js';
var CSS_PATH = 'public/css/**/*.css';
var SCSS_PATH = 'public/scss/**/*.scss';
var LESS_CSS_PATH = 'public/less/**/*.less';
var TEMPLATES_PATH = 'templates/**/*.hbs';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Image compression
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// zip
var zip = require('gulp-zip');

// // Styles for standard css
// gulp.task('styles', function(){
//     console.log('starting styles task');
//     // return gulp.src(CSS_PATH)
//     return gulp.src(['public/css/reset.css',CSS_PATH])
//         .pipe(plumber(function(err){
//             console.log('styles task error');
//             console.log(err);
//             console.log('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(concat('style.css'))
//         .pipe(minifyCss())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// });

// // Styles for scss
// gulp.task('styles', function(){
//     console.log('starting styles task');
//     // return gulp.src(CSS_PATH)
//     return gulp.src('public/scss/styles.scss')
//         .pipe(plumber(function(err){
//             console.log('styles task error');
//             console.log(err);
//             console.log('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(sass({
//             outputStyle: 'compressed'
//         }))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// });

// Styles for less
gulp.task('styles', function(){
    console.log('starting styles task');
    // return gulp.src(CSS_PATH)
    return gulp.src('public/less/styles.less')
        .pipe(plumber(function(err){
            console.log('styles task error');
            console.log(err);
            console.log('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [LessAutoprefix]
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function(){
    console.log('starting scripts task');

    // return gulp.src('public/scripts/*.js')
    return gulp.src(SCRIPTS_PATH)
    .pipe(plumber(function(err){
        console.log('Scripts task error');
        console.log(err);
        console.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

// Images
gulp.task('image', function(){
    return gulp.src(IMAGES_PATH)
    .pipe(imagemin(
        [
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminPngquant(),
            imageminJpegRecompress()
        ]
    ))
    .pipe(gulp.dest(DIST_PATH+'/images'));
});

gulp.task('templates', function(){
    return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
        handlebars: handlebarsLib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
        namespace: 'templates',
        noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('default', ['clean', 'templates', 'styles', 'image'],function(){
    console.log('stating default task');
});

gulp.task('clean', function(){
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('export', function(){
    return gulp.src('public/**/*')
    .pipe(zip('website.zip'))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', ['default'] ,function(){
    console.log('stating default watch');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    //gulp.watch(CSS_PATH, ['styles']);
    //gulp.watch(SCSS_PATH, ['styles']);
    gulp.watch(LESS_CSS_PATH, ['styles']);
    gulp.watch(TEMPLATES_PATH, ['templates']);
});
