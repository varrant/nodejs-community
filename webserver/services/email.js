/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-12 18:15
 */

'use strict';

var configs = require('../../configs/');
var setting = require('./setting.js');
var list = [];
var smtp = null;
var admin = {};


/**
 * 初始化一个 smtp
 */
exports.init = function (_smtp) {
    smtp = _smtp;

    if(configs.app.env === 'pro'){
        exports.send('云淡然', 'cloudcome@qq.com', '呵呵', '呵呵呵呵');
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
    // 执行推送时，写入列表
    list.push({
        from: configs.smtp.from,
        to: username + ' <' + useremail + '>',
        subject: subject,
        attachment: [{
            data: content,
            alternative: true
        }]
    });

    // 队列中只有一封待发邮件时启动
    if (list.length === 1) {
        _send();
    }
};


/**
 * 邮件发送中心
 * @private
 */
function _send() {
    var data = list.shift();

    if (!data) {
        return;
    }

    smtp.send(data, function () {
        console.log(arguments);
        _send();
    });
}