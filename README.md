# gulp-demo

> 一个基于gulp的前端框架，包含html模块化压缩、Less支持、JS压缩、清除缓存等功能。

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

## HTML模块化
html的模块代码放置在如下目录中
```
 src  
 ...
 |__ html 
    |__include 
 ...
```
在页面中可以做如下直接引用
```
<!--{{header.html}}-->
```


## Build Setup

``` bash
# install
npm install gulp-frontend-demo 

# install dependencies
npm install

# start program
gulp

# serve start dev localhost:8000
gulp connectDev

# serve start dist localhost:8001
gulp connectDist 

```

