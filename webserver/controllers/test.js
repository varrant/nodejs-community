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
    //    email: 'cloudcom2e@163.com'
    //}, function (err, doc) {
    //    if (err) {
    //        console.log(err);
    //        return res.send(err.message);
    //    }
    //
    //    res.set('Content-Type', 'text/plain');
    //    res.send(JSON.stringify(doc, null, 4));
    //});

    //userService.setMeta({
    //    email: 'cloudcome@163.com'
    //}, {
    //    location: '杭州',
    //    organization: '网易',
    //    position: '前端开发工程师'
    //},function (err, meta) {
    //    if (err) {
    //        console.log(err);
    //        return res.send(err.message);
    //    }
    //
    //    res.set('Content-Type', 'text/plain');
    //    res.send(JSON.stringify(meta, null, 4));
    //});

    //userService.getMeta({
    //    email: 'cloudcome@163.com'
    //}, function (err, meta) {
    //    if (err) {
    //        console.log(err);
    //        return res.send(err.message);
    //    }
    //
    //    res.set('Content-Type', 'text/plain');
    //    res.send(JSON.stringify(meta, null, 4));
    //});

    userService.increaseComment({
        email: 'cloudcome@163.com'
    }, function (err, meta) {
        if (err) {
            console.log(err);
            return res.send(err.message);
        }

        res.set('Content-Type', 'text/plain');
        res.send(JSON.stringify(meta, null, 4));
    });
};
