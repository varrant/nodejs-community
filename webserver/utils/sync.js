/*!
 * 同步本地变量
 * @author ydr.me
 * @create 2015-03-29 11:26
 */

'use strict';


/**
 * 同步本地版块变量
 * @param app
 * @param docs
 */
exports.section = function (app, docs) {
    app.locals.$sectionList = docs || [];
    app.locals.$sectionIdMap = {};
    app.locals.$sectionUriMap = {};
    app.locals.$sectionList.forEach(function (item) {
        app.locals.$sectionIdMap[item.id] = item;
        app.locals.$sectionUriMap[item.uri] = item;
    });

    console.log(app.locals.$sectionUriMap);
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