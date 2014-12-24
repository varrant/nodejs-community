/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-22 21:59
 */

'use strict';

var category = require('../../services/').category;
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

    return exports;
}
