/*!
 * object 的评论数量+=回复数量
 * @author ydr.me
 * @create 2015-06-23 19:50
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/services/').developer;
var response = require('../../webserver/services/').response;
var object = require('../../webserver/services/').object;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }


    object.find({}, function (err, docs) {
        if (err) {
            console.log('find object error');
            console.error(err.stack);
            return process.exit();
        }

        howdo
            .each(docs, function (index, item, done) {
                object.find({
                    _id: item.id
                }, {

                })
            })
            .together(function () {

            });
    });
});