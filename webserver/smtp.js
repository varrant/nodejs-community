/*!
 * smtp 初始化
 * @author ydr.me
 * @create 2014-12-12 18:31
 */

'use strict';

var emailjs = require('emailjs');
var email = require('./services/email.js');
var log = require('ydr-log');
var configs = require('../configs/');

module.exports = function (next, app) {
    var options = app.locals.$setting.smtp;
    var smtp = emailjs.server.connect(options);

    email.init(smtp, app.locals.$founder);

    if('pro' === configs.app.env){
        log.initEmail({
            from: configs.smtp.from,
            email: app.locals.$founder.email
        });
        log.initSmtp(options);
    }

    next(null, app);
};
