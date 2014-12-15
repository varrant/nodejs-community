/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 22:54
 */

'use strict';

var scope = require('../../services/').scope;

module.exports = function (app) {
    var exports = {};


    /**
     * 列出所有 scope
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        scope.find({}, function (err, docs) {
            if (err) {
                return next(err);
            }

            docs = docs || [];
            res.json({
                code: 200,
                data: docs
            });
        });
    };


    exports.post = function (req, res, next) {
        scope.createOne(req.body, function (err, doc) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: true
            });
        });
    };

    return exports;
}
