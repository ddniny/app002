
/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), http = require('http'), path = require('path');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', routes.index);

// 把包含在包中的对象重命名
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

app.get('/show', function(req,res) {
    // 声明数据库连接
    var db = new Db('test', new Server('localhost', 27017, { auto_reconnect: true }, {}));
    // 打开连接
    db.open(function() {
        // 选择操作集合
        db.collection('house', function(err, collection) {
            if (err) {
                callback(err);
            }
            // 得到相应的集合（test数据库中的house集合，数据库中的命令为use test; db.house.find();）
            collection.find({}).toArray(function(err, docs) {
                if (err) {
                    callback(err);
                }
                // docs 为查询结果的集合
                // 简单的准备输出内容
                var l = [];
                for (var i in docs) {
                    l.push('<h1>' + docs[i]['name'] + '</h1>');
                }
                res.send(l.join(''));
                res.end();
            });
        });
    });
})

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});