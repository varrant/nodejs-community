/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-10 14:31
 */


'use strict';



var REG_PRE1 = /^`{3,}.*$\n((^.*$\n)*?)^`{3,}.*$/mg;
var REG_PRE2 = /(^ {4}.*$)+\n/mg;



/**
 * 获取对象的关键字
 * @param obj
 * @returns {*|string}
 */
exports.keywords = function (obj) {
    return obj.labels.length && obj.labels.join(',');
};



//exports.description = function (obj) {
//    return obj.content.replace();
//};


