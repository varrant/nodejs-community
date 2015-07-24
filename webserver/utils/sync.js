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
exports.section = function (docs) {
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
    docs = docs || [];

    var categoryList = [];
    var categoryIDMap = {};
    var categoryURIMap = {};
    var category1List = [];
    var category1IDMap = {};
    var category1URIMap = {};
    var category2List = [];
    var category2IDMap = {};
    var category2URIMap = {};

    docs = docs.sort(function (a, b) {
        return b.index - a.index;
    });

    docs.forEach(function (item) {
        categoryList.push(item);
        categoryIDMap[item.id] = item;
        categoryURIMap[item.uri] = item;

        switch (item.type) {
            case 1:
                category1List.push(item);
                category1IDMap[item.id] = item;
                category1URIMap[item.uri] = item;
                break;

            case 2:
                category2List.push(item);
                category2IDMap[item.id] = item;
                category2URIMap[item.uri] = item;
                break;
        }
    });

    cache.set('app.categoryList', categoryList);
    cache.set('app.categoryIDMap', categoryIDMap);
    cache.set('app.categoryURIMap', categoryURIMap);

    cache.set('app.category2List', category2List);
    cache.set('app.category2IDMap', category2IDMap);
    cache.set('app.category2URIMap', category2URIMap);
};