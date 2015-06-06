/*!
 * 通知配置
 * @author ydr.me
 * @create 2014-12-13 17:07
 */

'use strict';

var Template = require('ydr-utils').Template;
var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    return {
        commentObject: {
            subject: '新评论提醒',
            template: _template('commentObject.html')
        },
        replyObject: {
            subject: '新回复提醒',
            template: _template('replyObject.html')
        },
        reply: {
            subject: '新回复提醒',
            template: _template('reply.html')
        },
        role: {
            subject: '权限变动提醒',
            template: _template('role.html')
        },
        accept: {
            subject: '被采纳提醒',
            template: _template('accept.html')
        },
        agreeComment: {
            subject: '被赞同提醒',
            template: _template('agreeComment.html')
        },
        agreeReply: {
            subject: '被赞同提醒',
            template: _template('agreeReply.html')
        },
        favorite: {
            subject: '收藏提醒',
            template: _template('favorite.html')
        },
        apply: {
            subject: '申请提醒',
            template: _template('apply.html')
        },
        follow: {
            subject: '关注了你',
            template: _template('follow.html')
        },
        followingObject: {
            subject: '关注者动态',
            template: _template('follow-object.html')
        },
        commentAt: {
            subject: '提到了你',
            template: _template('commentAt.html')
        },
        replyAt: {
            subject: '提到了你',
            template: _template('replyAt.html')
        },
        score: {
            subject: '加分提醒',
            template: _template('score.html')
        },
        color: {
            subject: '加色提醒',
            template: _template('color.html')
        },
        essence: {
            subject: '设置精华',
            template: _template('essence.html')
        },
        recommend: {
            subject: '设置推荐',
            template: _template('recommend.html')
        },
        update: {
            subject: '更新提醒',
            template: _template('update.html')
        },
        certificated: {
            subject: '认证提醒',
            template: _template('certificated.html')
        },
        weibo: {
            subject: '认证提醒',
            template: _template('weibo.html')
        }
    };
};

/**
 * 读取模板
 * @param file
 * @private
 */
function _template(file) {
    file = path.join(__dirname, './templates/', file);

    var template = fs.readFileSync(file, 'utf8');

    return new Template(template);
}
