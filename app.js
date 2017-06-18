// console.log('javascript才是世界上最好的语言，前后端通吃');
// 引入http 模块 ,发出http请求, 系统级别模块
var http = require('http');
//加密的http请求
var https = require('https');

// 文件系统模块，用于打开读取，硬盘上的文件。
// 前端无法实现的，node.js 具有操作系统的能力

fs = require('fs');

// 路径模块， 读取文件，需要给出路径

path = require('path');

// 第三方模块，在服务器端模拟出前端DOM库

cheerio = require('cheerio');

// 要抓取页面的对象字面量

var opt = {
  hostname: 'movie.douban.com',
  path: '/top250',
  poth:80
}

function spiderMovie (index) {
  // 使用https库向网址发送请求
  https.get('https://' + opt.hostname + opt.path + '?start=' + index,function(res) {
    // 设置编码
    // 返回的是流
    var html = '';
    res.setEncoding('utf-8');
    // 文件可能比较大，一次发放一个数据包
    // 每次有数据到达，触发data事件
    res.on('data', function(chunk) {
      html += chunk;
    });
    // 传输完成
    res.on('end', function() {
      // console.log(html);

      // 使用第三方cheerio库，加载我们得到的html字符串，
      // 在内存里创建并模拟一个DOM.

      var $ = cheerio.load(html);
      // 选中所有类名为item的元素，电影内容组合
      // 查找元素 document.querySelecterAll('.item');
      // console.log($('.item'));
      var i = 0;
      $('.item').each(function(){
        var picUrl = $('.pic img', this).attr('src');
        // console.log(picUrl);
        if(i < 2) {
          downloadImg('./img/',picUrl);
          i++;
        }
      })
    })
  })
  // console.log(index);
}

// 下载图片,图片放哪儿，图片远程网址。
function downloadImg(imgDir, url) {
  // https请求图片
  https.get(url, function(res){
    var data = '';
    // 二进制组成
    res.setEncoding('binary');
    res.on('data', function(chunk){
      data += chunk;
    })
    res.on('end', function(){
      // 图片下载完成，保存。
      fs.writeFile(imgDir + path.basename(url),data,'binary',function(err) {
        if(err){
          console.log('保存图片失败');
        } else {
          console.log('图片已保存到服务器');
        }
      });
    })
  });
}

spiderMovie(0);

// function *doSpider(x){
//   var start = 0;
//   while(start < x ){
//     yield start;
//     spiderMovie(start);
//     start += 25;
//   }
// }

// for (var x of doSpider(250)) {
//   console.log(x);
// }
