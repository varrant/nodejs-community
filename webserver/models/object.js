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
        ref: 'developer'
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
    // 版块
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'section'
    },
    // 分类
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'category'
    },
    // 专辑
    column: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'column'
    },
    // 标签
    labels: {
        type: [String],
        required: false
    },
    // markdown 简介
    introduction: {
        type: String,
        required: false
    },
    // html 简介
    introductionHTML: {
        type: String,
        required: false
    },
    // markdown 内容
    content: {
        type: String,
        required: true
    },
    // markdown table of content 目录
    contentTOC: {
        type: String,
        required: false
    },
    // html 内容
    contentHTML: {
        type: String,
        required: false
    },
    hidden: {
        type: String,
        required: false
    },
    hiddenHTML: {
        type: String,
        required: false
    },
    // 链接地址
    link: {
        type: String,
        required: false
    },
    // 链接查看次数
    linkByCount: {
        type: Number,
        default: 1
    },
    // 发布时间
    publishAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    // 最近更新时间
    updateAt: {
        type: Date,
        required: false,
        default: Date.now
    },
    // 更新记录
    // [{
    //    user: userId,
    //    date: date
    // }]
    updateList: [{
        developerr: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'developer'
        },
        date: {
            type: Date
        }
    }],
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
        type: String
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
    scoreList: [{
        developereer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'developer'
        },
        date: {
            type: Date
        },
        score: {
            type: Number
        }
    }],
    // 被阅读数
    viewByCount: {
        type: Number,
        default: 1
    },
    // 评论次数
    commentByCount: {
        type: Number,
        default: 0
    },
    // 评回复数
    replyByCount: {
        type: Number,
        default: 0
    },
    // 被收藏次数
    favoriteByCount: {
        type: Number,
        default: 0
    },
    // 被申请次数
    applyByCount: {
        type: Number,
        default: 0
    },
    // 被采纳的 response author
    acceptByAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer',
        default: null
    },
    // 被采纳的 response
    acceptByResponse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'response',
        default: null
    },
    // 是否通过了组织、团体认证
    hasCertificated: {
        type: Boolean,
        default: false
    },
    // 贡献者，最多五个
    // [{
    //     id: 'xxx'
    // }]
    contributors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    }],
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

schema.set('toJSON', {getters: true, virtuals: true});
schema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('object', schema);