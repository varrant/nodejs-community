/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-12 21:11
 */

'use strict';

var column = require('../../services/').column;
var filter = require('../../utils/').filter;
var howdo = require('howdo');


module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var uri = req.params.uri;
        var listOptions = filter.skipLimit(req.params);
        var sectionIdMap = app.locals.$sectionIdMap;


        // 1. 查找专辑
        // 2. 查找 object 列表


        column.findOne({
            uri: uri
        }, {
            populate: ['author']
        }, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (!doc) {
                return next();
            }

            res.render('front/column.html', {
                title: doc.name + ':' + doc.author.nickname + '的专辑',
                column: doc,
                pager: {
                    page: listOptions.page,
                    limit: listOptions.limit,
                    count: doc.count
                }
            });
        });
    };

    return exports;
};
