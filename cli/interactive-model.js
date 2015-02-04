/*!
 * interactive model operator => source target
 * @author ydr.me
 * @create 2015-02-04 21:20
 */

'use strict';

var mongoose = require('../webserver/mongoose.js');
var developer = require('../webserver/models/').developer;
var response = require('../webserver/models/').response;
var interactive = require('../webserver/models/').interactive;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    interactive.find({}, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                howdo
                    // 查找评论
                    .task(function (next) {
                        response.findOne({
                            _id: doc.response
                        }, function (err, res) {
                            if (err) {
                                console.log('find response error');
                                return next(err);
                            }

                            if (!res) {
                                err = new Error('response ' + doc.response + ' not found');
                                return next();
                            }

                            next(err, res);
                        });
                    })
                    // 修正
                    .task(function (next, res) {
                        if (!res) {
                            return next();
                        }

                        interactive.findOneAndUpdate({
                            _id: doc.id
                        }, {
                            source: doc.operator,
                            target: res.author
                        }, next);
                    })
                    // 异步串行
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