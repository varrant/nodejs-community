/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-06-06 11:18
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/models/').developer;
var interactive = require('../../webserver/models/').interactive;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    interactive.find({
        type: 'follow'
    }, function (err, list) {
        if (err) {
            console.log('find interactive error');
            console.error(err.stack);
            return process.exit();
        }

        console.log(list);
    });
});