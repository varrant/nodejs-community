/*!
 * 正则
 * @author ydr.me
 * @create 2014-12-24 21:41
 */

'use strict';

var dato = require('ydr-utils').dato;


/**
 * 标题正则
 * 中文、字母、数字、空格、下划线、短横线、中英逗号、顿号、冒号、反斜杠、斜杆
 * @param minLength {Number} 最小长度
 * @param maxLength {Number} 最大长度
 * @returns {RegExp}
 */
exports.title = function (minLength, maxLength) {
    var title = '[\\u4e00-\\u9fa5\\w\\d \\-，,.?？!！、\\\\:：/（）()—－–+\\[\\]<>' +
        '“”‘’\'"《》〈〉]';

    return new RegExp('^' + title + '{' + minLength + ',' + maxLength + '}$');
};


/**
 * uri 正则
 * 字母、数字、下划线、短横线
 * @param minLength {Number} 最小长度
 * @param maxLength {Number} 最大长度
 * @returns {RegExp}
 */
exports.uri = function (minLength, maxLength) {
    var uri = '[\\w-]';

    return new RegExp('^' + uri + '{' + minLength + ',' + maxLength + '}$');
};


/**
 * 内容正则
 * 中文、字母、常用符号、换行
 * @param minLength {Number} 最小长度
 * @param maxLength {Number} 最大长度
 * @returns {RegExp}
 */
exports.content = function (minLength, maxLength) {
    //var content = '[\\u4e00-\\u9fa5\\w\\s\\-' +
    //    '~`!@#$%^&*()+={\\[}\\]|\\\\' +
    //    ':;"\'<,>.。?\/·！￥（）—－–【】' +
    //    '「」『』|´（）〈〉〔〕〖〗' +
    //        // 特殊符
    //    '……～﹪①②③④⑤⑥⑦⑧⑨' +
    //    '：；“”‘’《，》。？、…\\n\\r\\t]';
    var content = '[\\s\\S]';

    return new RegExp('^' + content + '{' + minLength + ',' + maxLength + '}$');
};


/**
 * 标签正则
 * @returns {RegExp}
 */
exports.label = function () {
    return /^[\u4e00-\u9fa5a-z\d _\-]{2,20}$/i;
};