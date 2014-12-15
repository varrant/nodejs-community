/*!
 * object 相关 API
 * @author ydr.me
 * @create 2014-12-07 16:51
 */

'use strict';

var object = require('../../services/').object;
var dato = require('ydr-util').dato;
var filter = require('../../utils/filter.js');

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
        var conditions = {};
        var options = filter.skipLimit(req);

        object.find(conditions, options, function(err, docs){
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
