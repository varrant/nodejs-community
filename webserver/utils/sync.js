/*!
 * 同步本地变量
 * @author ydr.me
 * @create 2015-03-29 11:26
 */

'use strict';

var cache = require('ydr-utils').cache;
var log = require('ydr-utils').log;
var allocation = require('ydr-utils').allocation;
var howdo = require('howdo');


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

    // 总分类
    cache.set('app.categoryList', categoryList);
    cache.set('app.categoryIDMap', categoryIDMap);
    cache.set('app.categoryURIMap', categoryURIMap);

    // 类型1：文章分类
    cache.set('app.category1List', category1List);
    cache.set('app.category1IDMap', category1IDMap);
    cache.set('app.category1URIMap', category1URIMap);

    // 类型2：导航分类
    cache.set('app.category2List', category2List);
    cache.set('app.category2IDMap', category2IDMap);
    cache.set('app.category2URIMap', category2URIMap);
};


/**
 * 同步链接
 * @param link
 * @param [category2List]
 * @param [callback]
 */
exports.link = function (link, category2List, callback) {
    var args = allocation.args(arguments);

    if (args.length === 2) {
        callback = args[1];
        category2List = null;
    } else if (args.length === 1) {
        callback = log.holdError;
        category2List = null;
    }

    // 按导航分类查找链接
    category2List = category2List || cache.get('app.category2List');

    var linkList = [];
    var linkMap = {};
    var categoryMap = {};

    howdo.each(category2List, function (index, category, done) {
        categoryMap[category.id] = [];
        linkList.push({
            type: category.name,
            list: categoryMap[category.id]
        });
        link.find({
            category: category.id,
            verified: true
        }, {
            order: {
                index: -1
            }
        }, function (err, docs) {
            if (err) {
                return done(err);
            }

            docs.forEach(function (doc) {
                categoryMap[category.id].push(doc);
                linkMap[doc.id] = doc;
            });
            done(null);
        });
    }).together(callback).try(function () {
        cache.set('app.link1List', linkList);
        cache.set('app.link1Map', linkMap);
    });
};
