/*!
 * test comment service
 * @author ydr.me
 * @create 2014-12-12 17:22
 */


'use strict';
var test = require('../test.js');
var comment = require('../../webserver/services/').comment;
var author = {
    _id: '548c136f274b6f0000dcf8d9',
    role: 2097151
};
var emailjs = require('emailjs');
var setting = require('../../webserver/services/').setting;
var email = require('../../webserver/services/').email;

test
    .push('init smtp', function (next) {
        setting.get('smtp', function (err, options) {
            if (err) {
                console.error(err);
                return process.exit();
            }

            var smtp = emailjs.server.connect(options);

            email.init(smtp);
            next();
        });
    }) .push('createOne', function (next) {
        comment.createOne(author, {
            object: '548c1c360f744000007507fa',
            parent: '548c26abc1a242000001cbd4',
            content: '呵呵呵呵呵呵呵呵'
        }, {}, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
