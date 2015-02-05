/*!
 * interactive add comment/reply type
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

    response.find({}, {
        populate: ['object']
    }, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                var type = doc.parentResponse ? 'reply' : 'comment';
                var target = doc.parentAuthor ? doc.parentAuthor.toString() : doc.object.author.toString();

                interactive.existOne({
                    type: type,
                    source: doc.author.toString(),
                    target: target,
                    object: doc.object.id.toString(),
                    response: doc.id.toString()
                }, {
                    interactiveAt: doc.publishAt
                }, function (err, doc) {
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