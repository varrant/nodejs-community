/*!
 * object.acceptByAuthor + object.acceptByResponse => interactive source + target
 * @author ydr.me
 * @create 2015-02-04 21:20
 */

'use strict';

var mongoose = require('../webserver/mongoose.js');
var object = require('../webserver/models/').object;
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

    object.find({}, function (err, docs) {
        if (err) {
            console.log('query object error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                // 如果没有被采纳，则跳过
                if(!doc.acceptByAuthor){
                    return next();
                }

                interactive.existOne({
                    source: doc.author,
                    target: doc.acceptByAuthor,
                    model: 'response',
                    path: 'acceptByObject',
                    response: doc.acceptByResponse,
                    object: doc.id
                }, {

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