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

    response.find({}, function (err, docs) {
        if (err) {
            console.log('find response error');
            console.error(err.stack);
            return process.exit();
        }

        var map = {};

        // 查找评论的文章的作者
        howdo
            .each(docs, function (index, doc, done) {
                object.findOne({
                    _id: doc.object
                }, function (err, objs) {
                    if (err) {
                        return done(err);
                    }

                    var author = objs.author.toString();

                    map[author] = map[author] || 0;
                    map[author]++;
                    done();
                });
            })
            // 作者的评论次数+1
            .follow(function () {
                howdo.each(map, function (authorId, commentByCount, done) {
                    console.log('do', authorId);
                    developer.findOneAndUpdate({
                        _id: authorId
                    }, {
                        commentByCount: commentByCount
                    }, done);
                }).together(function (err) {
                    if (err) {
                        console.log(err.stack);
                        return process.exit();
                    }

                    console.log('do success');
                    return process.exit();
                });
            });

    });
});