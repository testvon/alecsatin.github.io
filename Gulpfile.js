var gulp = require('gulp'),
    shell = require('gulp-shell');
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    minifyHTML = require('gulp-minify-html');
    sass = require('gulp-sass'),
    importCss = require('gulp-import-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    glob = require('glob');    
    
// Change default task to use compress_images task
gulp.task('default', ['compress_images']);

// run jekyll task first, as it clears out _site directory
gulp.task('jekyll', function() {
  return gulp.src('index.html', { read: false })
    .pipe(shell([
      'bundle exec jekyll build'
  ]));
});

// minify html task
gulp.task('html', ['jekyll'], function() {
    return gulp.src('_site/**/*.html')
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(gulp.dest('_site/'));
});

// minify css task
gulp.task('css', ['jekyll'], function() {
   return gulp.src('css/style.scss')
       .pipe(sass())
       .pipe(importCss())
       .pipe(autoprefixer())
       .pipe(uncss({
           html: glob.sync("_site/**/*.html"),
           ignore: [
               'label.active', 
               '.dark-mode', 
               'span.tweet-time',
               /(#|\.)(is-)/,
               /(#|\.)(has-)/,
               /(#|\.)(js-)/           
          ]
       }))
       .pipe(minifyCss({keepBreaks:false}))
       .pipe(rename('style.min.css'))
       .pipe(gulp.dest('_site/style/'));
});

// seo task
var gulp = require('gulp'),
    request = require('request');

gulp.task('seo', ['build'], function(cb) {
    request('http://www.google.com/webmasters/tools/ping?sitemap=http://www.alecsatin.com/sitemap.xml');
    request('http://www.bing.com/webmaster/ping.aspx?siteMap=http://www.alecsatin.com/sitemap.xml');
    cb();
});

// Compress png images from images/ folder
gulp.task('images', function () {
   return gulp.src('assets/images/**')
       .pipe(imagemin({
           progressive: true,
           use: [pngquant()]
       }))
       .pipe(gulp.dest('_site/assets/images'));
});

gulp.task('build', ['css', 'images', 'html']);
