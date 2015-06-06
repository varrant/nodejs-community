/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-06-06 11:18
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/services/').developer;
var interactive = require('../../webserver/models/').interactive;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    //// 54a4cb2777421233efe45af8 => 54a4cf6d616fa96cef261079
    //developer.pushFollowing({
    //    _id: '54a4cb2777421233efe45af8'
    //}, '54a4cf6d616fa96cef261079', function () {
    //    console.log(arguments);
    //    process.exit();
    //});

    interactive.find({
        type: 'follow'
    }, function (err, list) {
        if (err) {
            console.log('find interactive error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(list, function (index, ia, done) {
            var source = ia.source.toString();
            var target = ia.target.toString();

            console.log('do', source, '=>', target);

            howdo
                // 我关注的人
                .task(function (done) {
                    developer.pushFollowing({
                        _id: source
                    }, target, done);
                })
                // 关注我的人
                .task(function (done) {
                    developer.pushFollower({
                        _id: target
                    }, source, done);
                })
                .together(done);
        }).together(function () {
            console.log('do success');
            return process.exit();
        });
    });
});