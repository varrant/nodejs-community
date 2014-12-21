/*!
 * 标注模型
 * @author ydr.me
 * @create 2014-12-02 21:53
 */

'use strict';

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    // 标注名称
    name: {
        type: String,
        required: true,
        unique: true
    },
    // object 数量
    objectCount: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('label', schema);