/*!
 * post 数据库模型
 * @author ydr.me
 * @create 2014-12-01 21:41
 */

'use strict';


var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'user'
    },
    // 文章标题
    title: {
        type: String,
        required: true,
        unique: true,
        default: ''
    },
    // 文章的uri
    uri: {
        type: String,
        required: true,
        unique: true,
        default: ''
    },
    // 文章类型
    type: {
        type: Number,
        default: 1
    },
    // 范围
    scope: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'scope'
    },
    // 标签
    labels: {
        type: [String],
        required: true
    },
    // 文章内容
    content: {
        type: String,
        required: true
    },
    // 发布时间
    publishAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    // 最近更新时间
    updateAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    // 更新记录
    // [{
    //    user: userId,
    //    date: date
    // }]
    updateList: {
        type: Array,
        required: false,
        default: []
    },
    // 是否显示
    // true: 发布，前台可见状态
    // false: 草稿，前台隐藏状态
    isDisplay: {
        type: Boolean,
        default: true
    },
    // 是否推荐，置顶
    isRecommend: {
        type: Boolean,
        default: false
    },
    // 是否精华
    isEssence: {
        type: Boolean,
        default: false
    },
    // 加色
    color: {
        type: String,
        default: 'normal'
    },
    // 被加分
    score: {
        type: Number,
        default: 1
    },
    // 被加分历史
    // 默认有一次系统加分
    scoreList: {
        type: Array,
        default: [{
            user: 0,
            score: 1,
            date: new Date()
        }]
    },
    // 阅读数
    viewCount: {
        type: Number,
        default: 1
    },
    // 评论
    // {
    //    user: id,
    //    date: date
    // }
    comments: {
        type: Array,
        default: []
    },
    // 点赞
    // {
    //    user: id,
    //    date: date
    // }
    praises: {
        type: Array,
        default: []
    },
    // 收藏
    // {
    //    user: id,
    //    date: date
    // }
    favorites: {
        type: Array,
        default: []
    },
    // 是否被接受了
    // 通常指问题类的 post
    hasAccepted: {
        type: Boolean,
        default: false
    },
    // 是否关闭了评论
    isCloseComment: {
        type: Boolean,
        default: false
    },
    // 元信息（方便扩展）
    // 因为是复合数据，因此不会做数据验证
    // 因此必须再写入的时候自行验证
    // 一般这些数据都是由程序主动写入的
    // 与访问者无关
    meta: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model('setting', schema);