/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:31
 */

'use strict';

var emailjs = require('emailjs');
var email = require('./services/email.js');

module.exports = function (next, app) {
    var options = app.locals.options.smtp;
    var smtp = emailjs.server.connect(options);

    email.init(smtp);
    next(null, app);
};
