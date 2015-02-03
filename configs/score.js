/*!
 * 积分
 * @author ydr.me
 * @create 2014-12-28 02:50
 */

'use strict';


module.exports = function (app) {
    // 以下都是固定值
    // 被动威望的增长为：dato.parseInt(固定值 + Math.round(Math.log10(主动人的当前威望值 + 被动人的当前威望值)), 1);
    // 即：如果A（100威望）给B（200威望）的 object 评论。
    // 主动人增加的威望 = 2
    // 被动人增加的威望 = 1 + Math.log10(100 + 200)
    return {
        // 发布帮助
        help: 1,
        // 发布链接
        link: 1,
        // 发布问题
        question: 1,
        // 发布文章
        article: 3,
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
