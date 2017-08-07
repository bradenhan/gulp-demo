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
    htmlInsert = require('gulp-html-build').htmlInsert,
    htmlRename = require('gulp-html-build').htmlRename,
    spritesmith = require('gulp.spritesmith'),
    livereload = require('gulp-livereload');

    var Asset = { 
        origin : {
            all: 'src/**/*.*',
            js: 'src/js/*.js',
            less: 'src/less/*.less',
            html : 'src/html/*.html',
            css : 'src/css/*.css' ,
            images : 'src/images/*.*' 
        } 
    };

// 新建代码着色与显示错误日志方法，这个方法用到了gulp-util和stream-combiner2插件
var handleError = function (err) {
    console.log('\n');
    gutil.log('fileName: ' + gutil.colors.red(err.fileName));
    gutil.log('lineNumber: ' + gutil.colors.red(err.lineNumber));
    gutil.log('message: ' + err.message);
    gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));
};

// less 转换 、压缩 CSS 
gulp.task('less', function () {
    return gulp.src(Asset.origin.less)
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload({start : true}));
}); 
 

// 模块化引用html
gulp.task('insert', function () {
    return gulp.src(Asset.origin.html)
        .pipe(htmlInsert({ src: "src/html/include/" }))
        .pipe(gulp.dest('dist/html'))
        .pipe(livereload({start : true}));
});

// 新建js批量压缩任务  
gulp.task('compress', function (cb) {
    //将文件的源路径和发布路径赋值给相应变量  
    var srcJsPath = Asset.origin.js;
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
        .pipe(livereload({start : true}));  
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

// CSS sprite 设置
// gulp.task('sprite', function () {
//   var spriteData = gulp.src('src/less/background/*.png').pipe(spritesmith({
//     imgName: 'sprite.png',
//     cssName: 'sprite.css'
//   }));
//   return spriteData.pipe(gulp.dest('dist/css/background/'));
// });  

// 监控
gulp.task('watch', function () {
    //监控 html  
    gulp.watch(Asset.origin.all, ['insert']);

    //监控js  
    gulp.watch(Asset.origin.js, ['watchjs']);

    //监控less  
    gulp.watch(Asset.origin.less, ['less']); 

    //监控img  
    gulp.watch(Asset.origin.images, ['images']);

    livereload.listen({start: true});
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
gulp.task('default', ['watch','connectDist'], function () {
    return gulp.src('dist/html/*.html')
        .pipe(htmlRename());
});

// 将本文件夹下的文件发布到其他盘 暂时不准确
//注意src的参数   
/* gulp.task('copy', function () {
    var destDir = "目标路径"
    return gulp.src('./src/*,./dist', {base: '.'})
        .pipe(gulp.dest(destDir))
}); */
