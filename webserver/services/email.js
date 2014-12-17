/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var configs = require('../../configs/');
var setting = require('./setting.js');
var date = require('ydr-util').date;
var log = require('ydr-log');
var typeis = require('ydr-util').typeis;
var list = [];
var smtp = null;


/**
 * 初始化一个 smtp
 * @param _smtp {Object} 邮件发送服务
 * @param [admin] {Object} 管理员
 */
exports.init = function (_smtp, admin) {
    smtp = _smtp;
    var time = date.format('YYYY年MM月DD日 HH:mm:ss.SSS 星期e a');

    if (configs.app.env === 'pro' && admin) {
        exports.send(admin.nickname, admin.email, '服务器启动', time);
    }
};


/**
 * 发送邮件
 * @param username {String} 收件人姓名
 * @param useremail {String} 收件人邮箱
 * @param subject {String} 主题
 * @param content {String} 内容
 */
exports.send = function (username, useremail, subject, content) {
    var data = {
        from: configs.smtp.from,
        to: username + ' <' + useremail + '>',
        subject: subject,
        attachment: [{
            data: content,
            alternative: true
        }]
    };

    if (smtp && typeis(smtp.send) === 'function') {
        smtp.send(data, log.holdError);
    }
};