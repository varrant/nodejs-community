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

test
    .push('createOne', function (next) {
        comment.createOne(author, {
            object: '548aaf893b003d0824c43ce5',
            content: '呵呵呵呵呵呵呵呵'
        }, {}, function () {
            console.log(arguments);
            next();
        });
    })
    .start();
