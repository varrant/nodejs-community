/*!
 * api category controller
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var category = require('../../services/').category;
var permission = require('../../services/').permission;
var sync = require('../../utils/').sync;
var dato = require('ydr-utils').dato;
var cache = require('ydr-utils').cache;

module.exports = function (app) {
    var exports = {};

    /**
     * 获取所有版块
     * @param req
     * @param res
     * @param next
     */
    exports.get = function (req, res, next) {
        if(!permission.can(res.locals.$developer, 'category')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        res.json({
            code: 200,
            data: cache.get('app.categoryList')
        });
    };


    /**
     * 新建/保存版块
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        var id = req.body.id;

        if(!permission.can(res.locals.$developer, 'category')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        if (id) {
            return category.findOneAndUpdate({
                _id: id
            }, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                dato.each(cache.get('app.categoryList'), function (index, category) {
                    if (category.id.toString() === doc.id.toString()) {
                        cache.get('app.categoryList')[index] = doc;
                        return false;
                    }
                });

                res.json({
                    code: 200,
                    data: doc
                });
            });
        }

        category.createOne(req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            cache.get('app.categoryList').push(doc);
            sync.category(cache.get('app.categoryList'));
            res.json({
                code: 200,
                data: doc
            });
        });
    };


    exports.delete = function (req, res, next) {
        if(!permission.can(res.locals.$developer, 'category')){
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        category.findOneAndRemove({_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            dato.each(cache.get('app.categoryList'), function (index, section) {
                if (section.id.toString() === doc.id.toString()) {
                    cache.get('app.categoryList').splice(index, 1);
                    sync.category(cache.get('app.categoryList'));
                    return false;
                }
            });

            res.json({
                code: 200
            });
        });
    };

    return exports;
}
