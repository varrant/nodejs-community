/*!
 * test comment service
 * @author ydr.me
 * @create 2014-12-12 17:22
 */


'use strict';
var test = require('../test.js');
var comment = require('../../webserver/services/').comment;
var author = {
    id: '548a9fca75cb8cf00877b994',
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
            //parent: '548ab47229202f8c25beeef3',
            content: '呵呵呵呵呵呵呵呵'
        }, {}, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
