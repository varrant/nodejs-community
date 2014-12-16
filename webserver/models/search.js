/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-16 10:14
 */

'use strict';


var mongoose = require('mongoose');
var schema = mongoose.Schema({
    // 搜索词
    word: {
        type: String,
        required: true
    },
    // 搜索次数
    times: {
        type: Number,
        default: 1
    },
    // 最近搜索时间
    latestAt: {
        type: Date,
        default: new Date()
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

module.exports = mongoose.model('search', schema);