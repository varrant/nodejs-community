/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';

var config = require('../../webconfig/');
var userService = require('../services/').user;

exports.test = function (req, res, next) {
    if (config.app.env === 'pro') {
        return next();
    }


    var data = {
        email: 'cloudcome@163.com',
        github: 'cloudcome',
        password: '123123',
        nickname: '云淡然'
    };


    //userService.signUp(data, function (err, doc) {
    //    if (err) {
    //        console.log(err);
    //        return res.send(err.message);
    //    }
    //
    //    res.set('Content-Type', 'text/plain');
    //    res.send(JSON.stringify(doc, null, 4));
    //});

    //userService.findOne({
    //    email: 'cloudcome@163.com'
    //}, function (err, doc) {
    //    if (err) {
    //        console.log(err);
    //        return res.send(err.message);
    //    }
    //
    //    res.set('Content-Type', 'text/plain');
    //    res.send(JSON.stringify(doc, null, 4));
    //});
};
