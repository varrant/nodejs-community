/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var dato = require('ydr-util').dato;

module.exports = function (app) {
    var exports = {};

    exports.get = function (type) {
        return function (req, res, next) {

        };
    };


    /**
     * 列出符合条件的 object
     * @param req
     * @param res
     * @param next
     */
    exports.list = function (req, res, next) {
        var page = dato.parseInt(req.query.page, 1);
        var limit = dato.parseInt(req.query.limit, 10);
        var conditions = {};

        if(page < 1){
            page = 1;
        }

        object.find(conditions, {
            skip: (page - 1) * limit
        }, function(err, docs){
            if (err) {
                return next(err);
            }

            docs = docs || [];

            res.json({
                code: 200,
                data: docs
            });
        });
    }

    return exports;
};
