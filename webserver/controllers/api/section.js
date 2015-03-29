/*!
 * section api controller
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var section = require('../../services/').section;
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
        if (!permission.can(res.locals.$developer, 'section')) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        section.find({}, function (err, docs) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: docs
            });
            sync.section(app, docs);
        });
    };


    /**
     * 新建/保存版块
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        if (!permission.can(res.locals.$developer, 'section')) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        if (id) {
            return section.findOneAndUpdate({
                _id: id
            }, req.body, function (err, doc) {
                if (err) {
                    return next(err);
                }

                dato.each(app.locals.$sectionList, function (index, sec) {
                    if (sec.id.toString() === doc.id.toString()) {
                        app.locals.$sectionList[index] = doc;
                        return false;
                    }
                });

                sync.section(app, app.locals.$sectionList);

                res.json({
                    code: 200,
                    data: doc
                });
            });
        }

        section.createOne(req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            app.locals.$sectionList.push(doc);
            sync.section(app, app.locals.$sectionList);
            res.json({
                code: 200,
                data: doc
            });
        });
    };


    /**
     * 删除版块
     * @param req
     * @param res
     * @param next
     */
    exports.delete = function (req, res, next) {
        if (!permission.can(res.locals.$developer, 'section')) {
            var err = new Error('权限不足');
            err.code = 403;
            return next(err);
        }

        var id = req.body.id;

        section.findOneAndRemove({_id: id}, function (err, doc) {
            if (err) {
                return next(err);
            }

            dato.each(app.locals.$section, function (index, section) {
                if (section.id.toString() === doc.id.toString()) {
                    app.locals.$section.splice(index, 1);
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
