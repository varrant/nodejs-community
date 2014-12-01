/*!
 * 配置模型
 * @author ydr.me
 * @create 2014-11-22 20:06
 */

'use strict';

var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 键
    key: {
        type: String,
        required: true,
        unique: true
    },
    // 值
    val: {},
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