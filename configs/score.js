/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-28 02:50
 */

'use strict';


module.exports = function (app) {
    return {
        // 主动评论
        comment: 2,
        // 被动评论
        commentBy: 1,
        // 主动回复
        reply: 1,
        // 被动回复
        replyBy: 1,
        // 被采纳
        acceptBy: 10,
        // 被赞同
        agreeBy: 5
    };
};
