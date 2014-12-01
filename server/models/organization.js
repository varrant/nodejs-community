/*!
 * 组织、团队、团体
 * @author ydr.me
 * @create 2014-12-01 23:15
 */

'use strict';
var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 创建者
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    // 组织名称
    name: {
        type: String,
        required: true,
        unique: true
    },
    // 所属企业，可以为空
    company: {
        type: String
    },
    // 创建时间
    createAt: {
        type: Date,
        required: false,
        default: new Date()
    },
    // 更新时间
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
    // 是否公开
    // true: 公开，所有注册用户都可以申请加入
    // false: 半公开，只有创建者才可以添加成员
    isPublic: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('organization', schema);