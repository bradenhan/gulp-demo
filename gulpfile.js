// 引入插件变量
var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),

    // ejs 模版处理
    data = require('gulp-data'),
    ejs = require('gulp-ejs'),

    //html处理
    w3cjs = require('gulp-w3cjs'),
    htmlmin = require('gulp-htmlmin'),

    // css处理
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    cssBase64 = require('gulp-css-base64'),
    less = require('gulp-less'),

    // js处理 
    // 安装babel npm install --save-dev gulp-babel babel-core babel-preset-env
    watchPath = require('gulp-watch-path'),
    combiner = require('stream-combiner2'),
    babel = require('gulp-babel'),

    //图片压缩
    imagemin = require('gulp-imagemin'),

    //css 雪碧图
    spritesmith = require('gulp.spritesmith'),

    //本地服务器
    browserSync = require('browser-sync'),
    reload = browserSync.reload; 

var Asset = {
    origin: {
        all: 'src/**/*.*', 
        tplDir: './src/html', // 模版目录
        distDir: './dist/html',  // 生成目录
        less: ['src/less/*.less', 'src/less/*/*.less'],
        js: 'src/js/*.js',
        css: 'src/css/*.css',
        images: 'src/images/*.*', 
        distImages: 'dist/images'
    }
};

// 新建代码着色与显示错误日志方法，这个方法用到了gulp-util和stream-combiner2插件
var handleError = function(err) {
    console.log('\n');
    gutil.log('fileName: ' + gutil.colors.red(err.fileName));
    gutil.log('lineNumber: ' + gutil.colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));
};

// 模版合并
gulp.task('ejs', function(){
    gulp.src(Asset.origin.tplDir + '/**/*.html')
        .pipe(data(function (file) {

            var filePath = file.path;

            // global.json 全局数据，页面中直接通过属性名调用
            return Object.assign(JSON.parse(fs.readFileSync(Asset.origin.tplDir + '/global.json')), {
                // local: 每个页面对应的数据，页面中通过 local.属性 调用
                local: JSON.parse(fs.readFileSync( path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json')))
            }) 
        }))
        .pipe(ejs().on('error', function(err) {
            gutil.log(err);
            this.emit('end');
        }))

        .pipe(w3cjs()) 
        .pipe(w3cjs.reporter())

        .pipe(htmlmin({
           collapseWhitespace: true
        }))

        .pipe(gulp.dest(Asset.origin.distDir));
});

gulp.task('ejs-watch', ['ejs'], browserSync.reload);

// less 转换 、压缩 CSS
gulp.task('less', function() {
    return gulp.src(Asset.origin.less)
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer('last 10 versions', 'ie 9')) // https://gist.github.com/gorork/92de3a4316c7c00307a5
        .pipe(cssBase64())
        .pipe(gulp.dest('src/css'))
        .pipe(cleanCSS({
            debug: true
        }, function(details) {
           // console.log(details.name + ': ' + details.stats.originalSize);
            // console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css'))
});

// 监听watchjs
gulp.task('watchjs', function() {
    gulp.watch(Asset.origin.js, function(event) {
        var paths = watchPath(event, 'src/js/', 'dist/js/');
        //打印修改类型和路径
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist: ' + paths.distPath);
        //获取错误信息，继续执行代码
        var combined = combiner.obj([
            gulp.src(paths.srcPath)
            .pipe(babel({
              presets: ['env']
            })),
            // uglify(),   //执行压缩-暂时不压缩
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});

//图片压缩
gulp.task('imagemin', function() {
    return gulp.src(Asset.origin.images)
        .pipe(imagemin())
        .pipe(gulp.dest(Asset.origin.distImages))
});

// 监控
gulp.task('watch', function() { 
    //监控less
    gulp.watch(Asset.origin.less, ['less']).on('change', reload);

    //监控js
    gulp.watch(Asset.origin.js, ['watchjs']).on('change', reload);

    // 无论是数据文件更改还是模版更改都会触发页面自动重载
    gulp.watch(Asset.origin.tplDir + '/**/*.*', ['ejs-watch']);

    //监控img
    gulp.watch(Asset.origin.images, ['imagemin']).on('change', reload);
});

// CSS sprite 设置
// gulp.task('sprite', function () {
//   var spriteData = gulp.src('src/less/background/*.png').pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.css'
//   }));
//   return spriteData.pipe(gulp.dest('dist/css/background/'));
// });  

// 开发服务
gulp.task('dev', function() {
    browserSync.init({
        server: {
            baseDir: './dist/html/'
        },
        reloadDebounce: 0
    }); 
});

// 编写default任务和监听任务
gulp.task('default', ['watch', 'dev'], function() {
     
});

// 将本文件夹下的文件发布到其他盘 暂时不准确
//注意src的参数   
gulp.task('copy', function() {
    var destDir = "";
    return gulp.src('./*', {
            base: '.'
        })
        .pipe(gulp.dest(destDir))
});