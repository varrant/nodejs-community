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
                    (item.atList || []).forEach(function (atId) {
                        if (map[atId]) {
                            map[atId]++;
                        } else {
                            map[atId] = 1;
                        }
                    });
                });

                next(null, map);
            });
        })
        // 统计写入
        .task(function (next, map) {
            howdo.each(map, function (id, count, done) {
                console.log('do', id, count);

                developer.findOneAndUpdate({
                    _id: id
                }, {
                    atByCount: count
                }, done);
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