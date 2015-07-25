/*!
 * api link controller
 * @author ydr.me
 * @create 2015-07-24 23:00:27
 */

'use strict';

var link = require('../../services/').link;
var permission = require('../../services/').permission;
var sync = require('../../utils/').sync;
var dato = require('ydr-utils').dato;
var cache = require('ydr-utils').cache;
var number = require('ydr-utils').number;

module.exports = function (app) {
    var exports = {};

    // 所有链接
    exports.get = function (req, res, next) {
        var type = number.parseInt(req.query.type || 1, 1);
        var can = permission.can(req.session.$developer, 'link');
        var conditions = {
            type: type
        };

        if (req.query.verified && can) {
            conditions.verified = req.query.verified === '1';
        }

        if (req.query.category) {
            conditions.category = req.query.category;
        }

        link.find(conditions, {
            order: {
                index: -1
            }
        }, function (err, docs) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: docs
            });
        });
    };


    // 新建、保存链接
    exports.put = function (req, res, next) {
        var id = req.body.id;

        req.body.author = req.session.$developer.id;
        req.body.verified = permission.can(req.session.$developer, 'link');

        if (id) {
            return link.findOneAndUpdate({
                _id: id
            }, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                dato.each(cache.get('app.categoryList'), function (index, category) {
                    if (category.id.toString() === doc.id.toString()) {
                        cache.get('app.categoryList')[index] = doc;
                        sync.category(cache.get('app.categoryList'));
                        return false;
                    }
                });

                res.json({
                    code: 200,
                    data: doc
                });
            });
        }

        link.createOne(req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: doc
            });
        });
    };


    // 删除
    exports.delete = function (req, res, next) {
        if (!permission.can(res.locals.$developer, 'link')) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        link.findOneAndRemove({_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200
            });
        });
    };

    return exports;
};
