/*!
 * response model parent => parentDeveloper parentResponse
 * @author ydr.me
 * @create 2015-02-04 21:20
 */

'use strict';

var mongoose = require('../webserver/mongoose.js');
var developer = require('../webserver/models/').developer;
var response = require('../webserver/models/').response;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    response.find({}, {
        nor: {
            parent: null
        }
    }, function (err, docs) {
        if (err) {
            console.log('query response error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                var parentId = doc.parent.toString();
                console.log('update ' + doc.id.toString() + ' now');

                howdo
                    // 找到父级评论
                    .task(function (next) {
                        response.findOne({
                            _id: parentId
                        }, function (err, doc) {
                            if (err) {
                                console.log('find response error');
                                return next(err);
                            }

                            if (!doc) {
                                err = new Error('父级' + parentId + '评论不存在');
                                return next(err);
                            }

                            next(err, doc);
                        });
                    })
                    // 更新本级评论
                    .task(function (next, parentResponse) {
                        response.findOneAndUpdate({
                            _id: doc.id
                        }, {
                            parentResponse: parentResponse.id.toString(),
                            parentDeveloper: parentResponse.author.toString()
                        }, next);
                    })
                    .follow(next);
            })
            .follow(function (err) {
                if (err) {
                    console.log('update response error');
                    console.error(err);
                } else {
                    console.log('update response success');
                }

                process.exit();
            });
    });
});