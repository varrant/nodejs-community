/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-31 09:20
 */

'use strict';

var request = require('ydr-util').request;
var crypto = require('ydr-util').crypto;
var fs = require('fs-extra');
var path = require('path');
var glob = require('glob');
var dir = path.join('/Users/zhangyunlai/Downloads/imgs');
var howdo = require('howdo');
//var url = 'http://cn.bing.com/HPImageArchive.aspx?idx=1&n=1';
var arr = new Array(19);
var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
var count = 0;


//glob(dir + '*.jpg', function (err, files) {
//    howdo.each(files, function (index, file, next) {
//        fs.move(file, file.replace(/\/[^/]*$/, '/' + index + '.jpg'), function () {
//            next();
//        });
//    }).follow(function () {
//        console.log('重命名完成');
//    });
//});

console.time('耗费时间');
howdo.each(arr, function (index, val, next) {
    request.get({
        url: 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=' + index + '&n=1&mkt=en-US',
        headers: {
            host: 'www.bing.com',
            'user-agent': ua
        }
    }, function (err, body) {
        if (err) {
            console.log(err);
            return next();
        }

        var json = null;
        try {
            json = JSON.parse(body);
        } catch (err) {
            return next();
        }

        howdo.each(json.images, function (index, img, done) {
            console.log('正在下载', img.url);
            request.down({
                url: img.url,
                headers: {
                    host: 's.cn.bing.net',
                    'user-agent': ua
                }
            }, function (err, binary) {
                if (err) {
                    console.log(err);
                    return done();
                }

                var name = crypto.md5(binary) + '.jpg';
                fs.writeFile(path.join(dir, name), binary, {
                    encoding: 'binary'
                }, function (err) {
                    if (err) {
                        console.log('writeFile');
                        console.log(err);
                        return done();
                    }

                    count++;
                    done();
                });
            });
        }).together(next);
    });
}).follow(function () {
    console.log('共下载了 %d 张', count);
    console.timeEnd('耗费时间');
});



