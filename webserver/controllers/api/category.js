/*!
 * api category controller
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var category = require('../../services/').category;
var permission = require('../../services/').permission;
var sync = require('../../utils/').sync;
var dato = require('ydr-util').dato;

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
            data: app.locals.$categoryList
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

                dato.each(app.locals.$categoryList, function (index, category) {
                    if (category.id.toString() === doc.id.toString()) {
                        app.locals.$categoryList[index] = doc;
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

            app.locals.$categoryList.push(doc);
            sync.category(app, app.locals.$categoryList);
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

            dato.each(app.locals.$categoryList, function (index, section) {
                if (section.id.toString() === doc.id.toString()) {
                    app.locals.$categoryList.splice(index, 1);
                    sync.category(app, app.locals.$categoryList);
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
