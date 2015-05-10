/*!
 * interactive agreeByCount + object path
 * @author ydr.me
 * @create 2015-02-05 21:43
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

    interactive.find({
        path: 'agreeByCount'
    }, {
        populate: ['response']
    }, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                if (!doc.response) {
                    return next();
                }

                howdo
                    .task(function (next) {
                        var objectId = doc.response.object.toString();

                        object.findOne({
                            _id: objectId
                        }, function (err, doc) {
                            if (err) {
                                console.log('find object error');
                                return next(err);
                            }

                            if (!doc) {
                                console.log('can not find ' + objectId);
                            }

                            return next(err, doc);
                        });
                    })
                    .task(function (next, obj) {
                        if (!obj) {
                            return next();
                        }

                        interactive.findOneAndUpdate({
                            _id: doc.id.toString()
                        }, {
                            object: obj.id.toString()
                        }, next);
                    }).follow(next);
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