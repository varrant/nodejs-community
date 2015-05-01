/*!
 * 同步本地变量
 * @author ydr.me
 * @create 2015-03-29 11:26
 */

'use strict';

var cache = require('ydr-utils').cache;


/**
 * 同步本地版块变量
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
    cache.set('app.sectionIDMap', sectionIDMap);
    cache.set('app.sectionURIMap', sectionURIMap);
};


/**
 * 同步本地分类变量
 * @param docs
 */
exports.category = function (docs) {
    var categoryList = docs || [];
    var categoryIDMap = {};
    var categoryURIMap = {};

    categoryList.forEach(function (item) {
        categoryIDMap[item.id] = item;
        categoryURIMap[item.uri] = item;
    });

    cache.set('app.sectionList', categoryList);
    cache.set('app.sectionIDMap', categoryIDMap);
    cache.set('app.sectionURIMap', categoryURIMap);
};