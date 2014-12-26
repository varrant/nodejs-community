/*!
 * 搜索 service
 * @author ydr.me
 * @create 2014-12-16 10:28
 */

'use strict';


var search = require('../models/').search;
var howdo = require('howdo');


/**
 * 增加搜索次数
 * @param word {String} 搜索词
 * @param callback {Function} 回调
 */
exports.increaseTimes = function (word, callback) {
    word = String(word).trim();
    search.mustIncrease({word: word}, 'times', 1, callback);
};

