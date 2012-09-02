var $ = require('jquery');
var http = require('http');
var Iconv = require('iconv').Iconv;

// 地址为：http://soufun.com/house/%B1%B1%BE%A9_________________2_.htm
var options = {
    host: 'soufun.com',
    port: 80,
    path: '/house/%B1%B1%BE%A9_________________2_.htm'
};

var html = '';

var buffer = [], size = 0;

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

http.get(options, function (res) {
    res.on('data',function (data) {
        buffer.push(data);
        size += data.length;
    }).on('end', function () {
        // 转码，UTF-8 到 GBK
        var buf = new Buffer(size), pos = 0;
        for(var i = 0; i < buffer.length; i++) {
            buffer[i].copy(buf, pos);
            pos += buffer[i].length;
        }
        
        var g2u = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
        var ubuf = g2u.convert(buf);
        var html = ubuf.toString();
        console.log(html);
        
        // 开始分析 DOM 结构
        var dom = $(html); // 将整个文档封装成 jQuery 对象
        var list = [];
        // 在文档中查找类名为 searchListNoraml 的 div 节点，即<div ... class="searchListNoraml" ...>
        dom.find('div.searchListNoraml').each(function(i, e) {
            // 数据准备
            var itm = {};
            // 将当前找到的节点内容封装位 jQuery 对象
            var ele = $(e);
            // 在对象中查找类名为 name 的节点
            ele.find('.name').each(function(si,se) {
                itm.name = $.trim($(se).text());
            });
            // 在对象中查找类名为 dot6 的节点
            ele.find('.dot6').each(function(si,se) {
                itm.type = $.trim($(se).text());
            });
            // 在对象中查找类名为 price_type 的节点
            ele.find('.price_type').each(function(si,se) {
                itm.price = $.trim($(se).text());
            });
            // 在对象中查找类名为 s2 的节点中 a 标签的节点
            ele.find('.s2 a').each(function(si,se) {
                itm.dev = $.trim($(se).text());
            });
            list.push(itm);
        });
        console.log(list);
        
        // 声明数据库对象
        var db = new Db('test', new Server('localhost', 27017, {auto_reconnect: true}, {}));
        db.open(function() {
            // 打开数据库连接
            console.log('db opened');
            db.collection('house', function(err, collection) {
                // 插入数据
                if (err) {
                    callback(err);
                }
                for (var i in list) {
                    collection.insert(list[i],{safe:true},function(err, docs) {
                        console.log(docs[0]._id);
                    });
                    console.log(i);
                }
                console.log('insert over');
            });
        });
    });
});