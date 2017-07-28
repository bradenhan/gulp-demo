// 引入插件变量
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    gutil = require('gulp-util'),
    watchPath = require('gulp-watch-path'),
    combiner = require('stream-combiner2'),
    less = require('gulp-less'),
    htmlminify = require("gulp-html-minify"),
    path = require('path'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload');

// 新建代码着色与显示错误日志方法，这个方法用到了gulp-util和stream-combiner2插件
var handleError = function (err) {
    console.log('\n');
    gutil.log('fileName: ' + gutil.colors.red(err.fileName));
    gutil.log('lineNumber: ' + gutil.colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));
};

// less 转换
gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});

// 压缩 CSS   
gulp.task('minify-css', function () {
    return gulp.src('src/css/*.css')
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

// 生成html
gulp.task('build-html', function () {
    return gulp.src("src/html/*.html")
        // .pipe(htmlminify()) 暂时不压缩html
        .pipe(gulp.dest("dist/html"))
        .pipe(livereload());
});

// 新建js批量压缩任务  
gulp.task('compress', function (cb) {
    //将文件的源路径和发布路径赋值给相应变量  
    var srcJsPath = 'src/js/*.js';
    var destJsPath = 'dist/js/';
    pump([
        gulp.src(srcJsPath), //获取文件源地址 
        // uglify(), //执行压缩-暂时不压缩
        gulp.dest(destJsPath) //将压缩的文件发布到新路径  
    ],
        cb
    );
});

//图片压缩
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(livereload());
});

// 编写default任务和监听任务
gulp.task('watchjs', function () {
    gulp.watch('src/js/*.js', function (event) {
        var paths = watchPath(event, 'src/js/', 'dist/js/');
        //打印修改类型和路径  
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist: ' + paths.distPath);
        //获取错误信息，继续执行代码  
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            // uglify(),   //执行压缩-暂时不压缩
            gulp.dest(paths.distDir)
        ]);
        combined.on('error', handleError);
    });
});

// 监控
gulp.task('watch', function () {
    livereload.listen();
    //监控 html  
    gulp.watch('src/html/*.html', ['build-html']);
    //监控js  
    gulp.watch('src/js/*.js', ['watchjs']);
    //监控less  
    gulp.watch('src/less/*.less', ['less']);
    //监控 CSS  
    gulp.watch('src/css/*.css', ['minify-css']);
    //监控img  
    gulp.watch('src/images/*.*', ['images']);
});

// 监测测试地址
gulp.task('connectDev', function () {
    connect.server({
        name: 'Dev App',
        root: ['src'],
        port: 8000,
        livereload: true
    });
});

// 监测正式地址
gulp.task('connectDist', function () {
    connect.server({
        name: 'Dist App',
        root: 'dist',
        port: 8001,
        livereload: true
    });
});


// 编写default任务和监听任务
gulp.task('default', ['watchjs', 'less', 'images', 'minify-css', 'watch', 'build-html', 'connectDev', 'connectDist'], function () {

});

// 将本文件夹下的文件发布到其他盘 暂时不准确
//注意src的参数   
gulp.task('copy', function () {
    var destDir = "目标路径"
    return gulp.src('./src/*,./dist', {base: '.'})
        .pipe(gulp.dest(destDir))
});
 