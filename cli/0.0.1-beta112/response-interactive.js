/*!
 * object.acceptByAuthor + object.acceptByResponse => interactive source + target
 * @author ydr.me
 * @create 2015-02-04 21:20
 */

'use strict';

var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/index').object;
var developer = require('../../webserver/models/index').developer;
var response = require('../../webserver/models/index').response;
var interactive = require('../../webserver/models/index').interactive;
var howdo = require('howdo');

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    response.find({}, function (err, docs) {
        if (err) {
            console.log('query object error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                howdo
                    // 查找被评文章作者
                    .task(function (next) {
                        object.findOne({
                            _id: doc.object
                        }, {
                            populate: ['author']
                        }, function (err, object) {
                            if (err) {
                                return next(err);
                            }

                            if (!object) {
                                console.log('object ' + object.id + ' is Not Found.')
                                return next();
                            }

                            next(err, object);
                        });
                    })
                    // 更新交互
                    .task(function (next, object) {
                        if(!object){
                            return next();
                        }

                        interactive.existOne({
                            source: doc.author.toString(),
                            target: object.author.id.toString(),
                            model: 'developer',
                            path: 'commentCount',
                            response: doc.id.toString(),
                            object: object.id.toString()
                        }, {
                            hasApproved: true
                        }, next);
                    })
                    .follow(next);
            })
            .follow(function (err) {
                if (err) {
                    console.log('update interactive error');
                    console.error(err);
                } else {
                    console.log('update interactive success');
                }

                process.exit();
            });
    });
});