/*!
 * 用户模型
 * @author ydr.me
 * @create 2014-11-22 14:36
 */

'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 邮箱，由 github 过来
    email: {
        type: String,
        required: true,
        unique: true
    },
    // github用户名，由 github 过来
    // 用户的识别符号
    github: {
        type: String,
        required: true,
        unique: true
    },
    // 昵称
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    // 角色标识，详细配置参考配置文件
    role: {
        type: Number,
        required: true,
        unique: false,
        min: 1,
        max: 1048576,
        default: 1
    },
    // 注册时间
    signUpAt: {
        type: Date,
        default: new Date
    },
    // 登录时间
    signInAt: {
        type: Date
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

module.exports = mongoose.model('User', schema);