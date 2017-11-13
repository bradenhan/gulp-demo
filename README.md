# gulp-demo

> 一个基于gulp的前端框架，包含html模块化、Less支持、JS压缩等功能。

## Directory Structure
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


## Build Setup

``` bash
# install dependencies
npm install

# start program
gulp

# serve start dev localhost:8000
gulp connectDev

# serve start dist localhost:8001
gulp connectDist 

```