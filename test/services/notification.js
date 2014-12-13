/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-13 18:16
 */

'use strict';

var test = require('../test.js');
var setting = require('../../webserver/services/').setting;
var email = require('../../webserver/services/').email;
var notification = require('../../webserver/services/').notification;
var emailjs = require('emailjs');


var activeUser = {
    id: '548c136f274b6f0000dcf8d9',
    nickname: '呵呵1'
};

var activedUser = {
    id: '548c136f274b6f0000dcf8d9',
    nickname: '呵呵2',
    email: 'cloudcome@163.com'
};

var object = {
    id: '548c136f274b6f0000dcf8d9'
};

test
    .push('get config', function (next) {
        setting.get('smtp', function (err, options) {
            if (err) {
                console.error(err);
                return process.exit();
            }

            var smtp = emailjs.server.connect(options);

            email.init(smtp);
            next();
        });
    })
    .push('notification.createOne', function (next) {
        notification.createOne('comment', activeUser, activedUser, object);
        next();
    })
    .start();
