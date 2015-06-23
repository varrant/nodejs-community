/*!
 * response 的被评论数量
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

    developer.find({}, function (err, docs) {
        if (err) {
            console.log('find developer error');
            console.error(err.stack);
            return process.exit();
        }

        howdo
            .each(docs, function (index, item, next) {
                console.log('do', item.id);

                howdo
                    .task(function (next) {
                        response.count({
                            author: item.id
                        }, next);
                    })
                    .task(function (next, count) {
                        developer.findOneAndUpdate({
                            _id: item.id
                        }, {
                            commentCount: count
                        }, next);
                    })
                    .follow(next);
            })
            .follow(function () {
                if (err) {
                    console.log(err.stack);
                    return process.exit();
                }

                console.log('do success');
                return process.exit();
            });
    });
});