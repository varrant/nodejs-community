/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-01-21 20:26
 */

'use strict';

var dato = require('ydr-utils').dato;
var configs = require('../../configs/');
var scoreMap = configs.score;


/**
 * 被动评论分
 * @param sourceDevloper
 * @param targetDevloper
 * @returns {*}
 */
exports.commentBy = function (sourceDevloper, targetDevloper) {
    return _increase(scoreMap.commentBy, sourceDevloper, targetDevloper);
};


/**
 * 被动评论分
 * @param sourceDevloper
 * @param targetDevloper
 * @returns {*}
 */
exports.replyBy = function (sourceDevloper, targetDevloper) {
    return _increase(scoreMap.replyBy, sourceDevloper, targetDevloper);
};


/**
 * 被动评论分
 * @param sourceDevloper
 * @param targetDevloper
 * @returns {*}
 */
exports.acceptBy = function (sourceDevloper, targetDevloper) {
    return _increase(scoreMap.acceptBy, sourceDevloper, targetDevloper);
};


/**
 * 被动评论分
 * @param sourceDevloper
 * @param targetDevloper
 * @returns {*}
 */
exports.agreeBy = function (sourceDevloper, targetDevloper) {
    return _increase(scoreMap.agreeBy, sourceDevloper, targetDevloper);
};


/**
 * 增加的分值
 * @param S
 * @param A
 * @param B
 * @returns {*}
 * @private
 */
function _increase(S, A, B) {
    return dato.parseInt(Math.round(S + log10(A.score + B.score)), S);
}


/**
 * Math.log10(x);
 * @param x
 * @returns {number}
 */
function log10(x) {
    return Math.log(x) / Math.LN10;
}