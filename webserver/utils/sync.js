/*!
 * 同步本地变量
 * @author ydr.me
 * @create 2015-03-29 11:26
 */

'use strict';

var cache = require('ydr-utils').cache;


/**
 * 同步本地版块变量
 * @param app
 * @param docs
 */
exports.section = function (app, docs) {
    var sectionList = docs || [];
    var sectionIDMap = {};
    var sectionURIMap = {};

    sectionList.forEach(function (item) {
        sectionIDMap[item.id] = item;
        sectionURIMap[item.uri] = item;
    });

    cache.set('app.sectionList', sectionList);
};


/**
 * 同步本地分类变量
 * @param app
 * @param docs
 */
exports.category = function (app, docs) {
    app.locals.$categoryList = docs || [];
    app.locals.$categoryIdMap = {};
    app.locals.$categoryUriMap = {};
    app.locals.$categoryList.forEach(function (item) {
        app.locals.$categoryIdMap[item.id] = item;
        app.locals.$categoryUriMap[item.uri] = item;
    });
};