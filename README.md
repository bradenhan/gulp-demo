# gulp-frontend-program

## 项目缘起
懒 <br />
懒得复制CSS、html<br />
懒得写一堆CSS前缀<br />
。。。。<br />
总之一堆懒<br />

所以，就有了这个很简单的项目（高手请直接略过！！！！）<br />

这是一个基于gulp的前端项目，
包含
* 新建代码着色与错误日志显示
* html检查、模块化、压缩
* Less转换 、压缩
* JS检查、压缩 
* 图片压缩
* CSS sprite （待完善）
* 本地浏览器自动刷新
<br />
等功能  

## HTML模块化
html的模块代码放置在如下目录中
```
 src  
 ...
 |__ html 
    |__include(请不要随意修改此文件名，否则会报错) 
 ...
```
在页面中可以做如下直接引用
```
<!-- {{header.html}} -->
```

## LESS/CSS自动补全
样式表自动补全采用 [mixinsless](http://mixinsless.com/ "mixinsless") ，感恩！  
## 目录结构
```
 src 
 |__ fonts
 |__ html 
    |__include // 公共部分，可以页面中引用
 |__ less
 |__ js 
 gulpfile.js // Gulp主文件
 package.json // 配置文件
 README.md // 项目说明文件

```

## 安装

``` bash
# install
npm i gulp-frontend-program

# install dependencies
npm install (尽量不要使用cnpm安装)

# start program
gulp

# serve start dev localhost:8000
gulp connectDev

# serve start dist localhost:8001
gulp connectDist 

```

