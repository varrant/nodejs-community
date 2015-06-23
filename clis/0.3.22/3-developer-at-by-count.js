/*!
 * response 的评论数量
 * @author ydr.me
 * @create 2015-06-23 19:50
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/services/').developer;
var response = require('../../webserver/services/').response;
var object = require('../../webserver/models/').object;
var howdo = require('howdo');

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    howdo
        // 查找所有at
        .task(function (next) {
            response.find({}, function (err, list) {
                if (err) {
                    return next(err);
                }


                var map = {};

                list.forEach(function (item) {
                    var author = item.author;

                    map[author] = map[author] || {};
                    map[author].atCount = map[author].atCount || 0;
                    map[author].atByCount = map[author].atByCount || 0;

                    (item.atList || []).forEach(function (atId) {
                        map[atId] = map[atId] || {};
                        map[atId].atCount = map[atId].atCount || 0;
                        map[atId].atByCount = map[atId].atByCount || 0;
                        map[author].atCount++;
                        map[atId].atByCount++;
                    });
                });

                next(null, map);
            });
        })
        // 统计写入
        .task(function (next, map) {
            howdo.each(map, function (id, data, done) {
                console.log('do', id, data);

                developer.findOneAndUpdate({
                    _id: id
                }, data, done);
            }).together(next);
        })
        .follow(function (err) {
            if (err) {
                console.log(err.stack);
                return process.exit();
            }

            console.log('do success');
            return process.exit();
        });
});