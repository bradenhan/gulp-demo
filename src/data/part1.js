var JSDOM = require("jsdom");

global.document = new JSDOM(html).window.document;

//用jquery获取模板
var tpl = document.getElementById("#tpl").innerHTML;
//原生方法
var source = document.getElementById('#tpl').innerHTML;
//预编译模板
var template = Handlebars.compile(source);
//模拟json数据
var context = {
 'name': "zhaoshuai",
 'content': "learn Handlebars"
};
//匹配json内容
var html = template(context);
//输入模板
//$('#part1').html(html);
document.getElementById("#part1").innerHTML = html;
 