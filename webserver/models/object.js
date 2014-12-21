/*!
 * object 数据库模型
 * @author ydr.me
 * @create 2014-12-01 21:41
 */

'use strict';


var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 作者
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: false,
        ref: 'user'
    },
    // 标题
    title: {
        type: String,
        required: true,
        unique: true
    },
    // uri
    uri: {
        type: String,
        required: true,
        unique: true
    },
    // 文章类型
    type: {
        type: String,
        required: true
    },
    // 范围
    scope: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'scope'
    },
    // 标签
    labels: {
        type: [String],
        required: false
    },
    // 简介
    introduction: {
        type: String,
        required: false
    },
    // 内容
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
    // 是否被置顶
    isSticky: {
        type: Boolean,
        default: false
    },
    // 是否被推荐
    isRecommend: {
        type: Boolean,
        default: false
    },
    // 是否被精华
    isEssence: {
        type: Boolean,
        default: false
    },
    // 加色
    color: {
        type: String,
        default: ''
    },
    // 被加分
    score: {
        type: Number,
        default: 1
    },
    // 被加分历史
    // [{
    //    user: userId,
    //    date: date,
    //    score: score
    // }]
    scoreList: {
        type: Array,
        default: []
    },
    // 被阅读数
    viewCount: {
        type: Number,
        default: 1
    },
    // 评论次数
    commentCount: {
        type: Number,
        default: 0
    },
    // 被收藏次数
    favoriteCount: {
        type: Number,
        default: 0
    },
    // 被申请次数
    applyCount: {
        type: Number,
        default: 0
    },
    // 是否被接受了
    // 通常指问题类的 object
    hasAccepted: {
        type: Boolean,
        default: false
    },
    // 是否通过了组织、团体认证
    isCertificated: {
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

schema.set('toJSON', { getters: true, virtuals: true });
schema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('object', schema);