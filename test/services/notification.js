/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-13 18:16
 */

'use strict';

var test = require('../test.js');
var notification = require('../../webserver/services/').notification;


var activeUser = {
    _id: '548c136f274b6f0000dcf8d9',
    nickname: '呵呵1'
};

var activedUser = {
    _id: '548c136f274b6f0000dcf8d9',
    nickname: '呵呵2',
    email: 'cloudcome@163.com'
};

var object = {
    _id: '548c136f274b6f0000dcf8d9'
};

test
    .push('notification.createOne', function (next) {
        notification.createOne('comment', activeUser, activedUser, object);
        next();
    })
    .start();
