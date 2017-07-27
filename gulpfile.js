// 引入插件变量
var gulp = require('gulp'),  
    uglify = require('gulp-uglify'),  
    pump = require('pump'),
    minifycss = require('gulp-minify-css'),  
    imgmin = require('gulp-imagemin'),  
    gutil = require('gulp-util'),  
    watchPath = require('gulp-watch-path'),  
    combiner = require('stream-combiner2'),
    less = require('gulp-less'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] }),
    path = require('path');

// 新建代码着色与显示错误日志方法，这个方法用到了gulp-util和stream-combiner2插件
var handleError=function(err){  
    console.log('\n');  
    gutil.log('fileName: '+gutil.colors.red(err.fileName));  
    gutil.log('lineNumber: '+gutil.colors.red(err.lineNumber));  
    gutil.log('message: ' + err.message);  
    gutil.log('plugin: ' + gutil.colors.yellow(err.plugin));  
};  

// less 转换
gulp.task('less', function () {
  return gulp.src('less/*.less')
    .pipe(less({
      plugins: [autoprefix],
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('dist/css')); 
});

// 新建js批量压缩任务  
gulp.task('compress', function (cb) {
    //将文件的源路径和发布路径赋值给相应变量  
    var srcJsPath='js/*.js';  
    var destJsPath='dist/js/';   
    pump([
        gulp.src(srcJsPath), //获取文件源地址 
        // uglify(), //执行压缩 
        gulp.dest(destJsPath) //将压缩的文件发布到新路径  
    ],
    cb
  );
});

// 编写default任务和监听任务
gulp.task('watchjs',function(){  
    gulp.watch('js/*.js',function(event){  
    var paths=watchPath(event,'js/','dist/js/');  
        //打印修改类型和路径  
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);  
        gutil.log('Dist: ' + paths.distPath);  
        //获取错误信息，继续执行代码  
        var combined = combiner.obj([  
                gulp.src(paths.srcPath),  
                uglify(),  
                gulp.dest(paths.distDir)  
            ]);  
        combined.on('error', handleError);  
    });  
});  

// 编写default任务和监听任务
gulp.task('default',function(){  
    //默认执行的方法，引号内的内容对应上面task写的内容  
    gulp.run('watchjs','less','css','images');  
    //监控js  
    gulp.watch('js/*.js',['watchjs']);  
    //监控less  
    gulp.watch('less/*.less',['less']);  
    //监控css  
    gulp.watch('css/*.css',['css']);  
    //监控img  
    gulp.watch('images/*.*',['images']);  
});  

// 将本文件夹下的文件发布到其他盘 
//注意src的参数  
// gulp.task('distCopyEclipse',function(){  
//     return gulp.src('src/cssEclispe/*',{nodir:true})  
//     .pipe(cached('distCopyEclipse'))  
//     .pipe(gulp.dest('D:/workSpace/makerplateform/webapp/instantcommunication/theme/css'))  
//     .pipe(gulp.dest('D:/tomcat7/webapps/makerplateform/instantcommunication/theme/css'));  
// });  

// 参考网址： http://blog.csdn.net/zchcode/article/details/51556699