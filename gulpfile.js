// 引入插件变量
var gulp = require('gulp'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    gutil = require('gulp-util'),
    watchPath = require('gulp-watch-path'),
    combiner = require('stream-combiner2'),

    //动态模版处理 - 暂时未用
    fs = require('fs'),
    //ejs = require('gulp-ejs'),
    //data = require('gulp-data'), 

    // html处理 
    htmlmin = require('gulp-htmlmin'),
    htmlInsert = require('gulp-html-build').htmlInsert,
    htmlRename = require('gulp-html-build').htmlRename,
    w3cjs = require('gulp-w3cjs'),

    //图片压缩
    imagemin = require('gulp-imagemin'),

    // css处理
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    cssBase64 = require('gulp-css-base64'),
    less = require('gulp-less'),

    // js处理
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'), 

    //css 雪碧图
    spritesmith = require('gulp.spritesmith'),

    //本地服务器
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

       
var Asset = {
    origin: {
        all: 'src/**/*.*',
        js: 'src/js/*.js',
        less: ['src/less/*.less', 'src/less/*/*.less'],
        html: ['src/html/*.html', 'src/html/*/*.html'],
        css: 'src/css/*.css',
        images: 'src/images/*.*'
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


// 模块化引用html
gulp.task('insert', function() {
    return gulp.src(Asset.origin.html) 
        .pipe(htmlInsert({
            src: "src/html/include/"
        }))

        // .pipe(data(function (file) {
        // 　　 var filePath = file.path;
        // 　　　　// global.json 全局数据，页面中直接通过属性名调用
        // 　　　　return Object.assign(JSON.parse(fs.readFileSync('src/html/include/global.json')), {
        // 　　　　　　// local: 每个页面对应的数据，页面中通过 local.属性 调用
        // 　　　　　　local: JSON.parse(fs.readFileSync( path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json')))
        // 　　　　}) 
        // 　　 })
        // ) 

        // .pipe(w3cjs()) 
        // .pipe(w3cjs.reporter())

        //.pipe(htmlmin({
          //  collapseWhitespace: true
       // }))

        .pipe(gulp.dest('dist/html'))
});

var tplDir = './src/html'  // 模版目录
var distDir = './dist/html'      // 生成目录

// 模版合并 -- 暂时未用
// gulp.task('ejs', function(){
//     gulp.src(tplDir + '/**/*.html')
//         .pipe(data(function (file) {

//             var filePath = file.path;

//             // global.json 全局数据，页面中直接通过属性名调用
//             return Object.assign(JSON.parse(fs.readFileSync(tplDir + '/global.json')), {
//                 // local: 每个页面对应的数据，页面中通过 local.属性 调用
//                 local: JSON.parse(fs.readFileSync( path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json')))
//             }) 
//         }))
//         .pipe(ejs().on('error', function(err) {
//             gutil.log(err);
//             this.emit('end');
//         }))
//         .pipe(gulp.dest(distDir));
// });

// JS 文件错误检查
gulp.task('lint', function() {
    var srcJsPath = Asset.origin.js;
    gulp.src(srcJsPath)
        .pipe(babel({
          presets: ['es2015']
        })) 
        .pipe(eslint({
            // rules: {
            //     "no-alert": 0,
            //     "no-bitwise": 0,
            //     "camelcase": 1,
            //     "curly": 1,
            //     "eqeqeq": 0,
            //     "no-eq-null": 0,
            //     "guard-for-in": 1,
            //     "no-empty": 1
            // },
            rules: {
              "no-alert": 0,  
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser',
                'node'
            ]
        }))
        .pipe(eslint.format())
        .pipe(eslint.formatEach('compact', process.stderr));
});

// 新建js批量压缩任务  
// gulp.task('compress', function(cb) {
//     //将文件的源路径和发布路径赋值给相应变量  
//     var srcJsPath = Asset.origin.js;
//     var destJsPath = 'dist/js/';
//     pump([
//             gulp.src(srcJsPath), //获取文件源地址 
//             // uglify(), //执行压缩-暂时不压缩
//             gulp.dest(destJsPath) //将压缩的文件发布到新路径  
//         ],
//         cb
//     );
// });

//图片压缩
gulp.task('images', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

// 编写default任务和监听任务
gulp.task('watchjs', function() {
    gulp.watch('src/js/*.js', function(event) {
        var paths = watchPath(event, 'src/js/', 'dist/js/');
        //打印修改类型和路径  
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist: ' + paths.distPath);
        //获取错误信息，继续执行代码  
        var combined = combiner.obj([
            gulp.src(paths.srcPath)
            .pipe(babel({
              presets: ['es2015']
            })),
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

// 代理、静态服务器 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
    });
});

// 监控
gulp.task('watch', function() {
    //监控 html  
    //gulp.watch(Asset.origin.html, ['ejs']).on('change', reload); 
    
    gulp.watch(Asset.origin.html, ['insert']).on('change', reload); 

    //监控js  
    gulp.watch(Asset.origin.js, ['lint', 'watchjs']).on('change', reload);

    //监控less  
    gulp.watch(Asset.origin.less, ['less']).on('change', reload);

    //监控img  
    gulp.watch(Asset.origin.images, ['images']).on('change', reload);
}); 

// 编写default任务和监听任务
gulp.task('default', ['watch', 'browser-sync'], function() {
    return gulp.src('dist/html/*.html')
        .pipe(htmlRename());
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