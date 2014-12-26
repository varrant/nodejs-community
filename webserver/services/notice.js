/*!
 * 通知
 * 包括 notification.createOne
 * 包括 email.send
 * @author ydr.me
 * @create 2014-12-26 10:15
 */

'use strict';

var configs = require('../../configs/');
var notification = require('./notification.js');



exports.responsePrimary = function (sourceEngineer, targetEngineer, object) {
    var notiComment = configs.notification.comment;

    // 1. 创建通知
    notification.createOne({
        source: sourceEngineer.id,
        target: targetEngineer.id,
        object: 
    });

};



exports.responseSecondary = function () {
    var notiReply = configs.notification.reply;
};

