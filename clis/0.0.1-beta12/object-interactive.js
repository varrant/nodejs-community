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

    object.find({}, function (err, docs) {
        if (err) {
            console.log('query object error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                // 如果没有被采纳，则跳过
                if (!doc.acceptByAuthor) {
                    return next();
                }

                console.log('update ' + doc.id.toString() + ' now');
                interactive.existOne({
                    source: doc.author.toString(),
                    target: doc.acceptByAuthor.toString(),
                    model: 'response',
                    path: 'acceptByObject',
                    response: doc.acceptByResponse.toString(),
                    object: doc.id
                }, {
                    hasApproved: true
                }, function (err, doc) {
                    if (err) {
                        console.log('create error');
                        return next(err);
                    }

                    if (!doc) {
                        err = new Error('create empty');
                        return next(err);
                    }

                    next(err);
                });
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