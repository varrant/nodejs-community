/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:31
 */

'use strict';

var emailjs = require('emailjs');
var email = require('./services/email.js');
var log = require('ydr-log');
var configs = require('../configs/');

module.exports = function (next, app) {
    var options = app.locals.$settings.smtp;
    var smtp = emailjs.server.connect(options);

    email.init(smtp, app.locals.$owner);

    if('pro' === configs.app.env){

    }

    log.initSmtp(options);
    log.initEmail({
        email: app.locals.$owner.email
    });
    app.locals.$smtp = smtp;
    next(null, app);
};
