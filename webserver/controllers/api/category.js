/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var category = require('../../services/').category;
var permission = require('../../services/').permission;
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
        if(!permission.can(res.locals.$engineer, 'category')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        res.json({
            code: 200,
            data: app.locals.$category
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

        if(!permission.can(res.locals.$engineer, 'category')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        if (id) {
            return category.findOneAndUpdate({
                _id: id
            }, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                dato.each(app.locals.$category, function (index, category) {
                    if (category.id.toString() === doc.id.toString()) {
                        app.locals.$category[index] = doc;
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

            app.locals.$category.push(doc);
            res.json({
                code: 200,
                data: doc
            });
        });
    };


    exports.delete = function (req, res, next) {
        if(!permission.can(res.locals.$engineer, 'category')){
            var err = new Error('权限不足');
            err.status = 403;
            return next(err);
        }

        var id = req.body.id;

        category.findOneAndRemove({_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            dato.each(app.locals.$category, function (index, section) {
                if (section.id.toString() === doc.id.toString()) {
                    app.locals.$category.splice(index, 1);
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
