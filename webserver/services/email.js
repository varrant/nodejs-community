/*!
 * 邮件系统
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
 * @param [founder] {Object} 管理员
 */
exports.init = function (_smtp, founder) {
    smtp = _smtp;

    var time = date.format('YYYY年MM月DD日 HH:mm:ss.SSS 星期e a');

    //if (configs.app.env === 'pro' && founder) {
        exports.send(founder, '服务器启动', time);
    //}
};


/**
 * 发送邮件
 * @param receiver {Object} 接收人
 * @param receiver.nickname {String} 接收人昵称
 * @param receiver.email {String} 接收人邮件地址
 * @param subject {String} 主题
 * @param content {String} 内容
 */
exports.send = function (receiver, subject, content) {
    var data = {
        from: configs.smtp.from,
        to: receiver.nickname + ' <' + receiver.email + '>',
        subject: subject,
        html: content
    };

    if (smtp && typeis(smtp.sendMail) === 'function') {
        smtp.sendMail(data, log.holdError);
    }
};