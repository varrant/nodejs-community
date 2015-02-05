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

    interactive.find({
        path: 'commentCount'
    }, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }
    });
});