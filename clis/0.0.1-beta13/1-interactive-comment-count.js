/*!
 * interactive remove commentCount
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
        path: 'commentCount'
    }, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('remove ' + doc.id + ' now');
                interactive.findOneAndRemove({
                    _id: doc.id
                }, next);
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