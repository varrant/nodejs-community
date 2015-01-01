/*!
 * 积分
 * @author ydr.me
 * @create 2014-12-28 02:50
 */

'use strict';


module.exports = function (app) {
    return {
        // 发布帮助
        help: 1,
        // 发布问题
        question: 1,
        // 主动评论
        comment: 2,
        // 被动评论
        commentBy: 1,
        // 主动回复
        reply: 1,
        // 被动回复
        replyBy: 1,
        // 被动采纳
        acceptBy: 5,
        // 主动赞同
        agree: 1,
        // 被动赞同
        agreeBy: 3
    };
};
