/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-26 14:24
 */

'use strict';

var response = require('../../services/').response;
var filter = require('../../utils/').filter;

module.exports = function (app) {
    var exports = {};

    /**
     * get 评论列表
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.get = function (req, res, next) {
        var options = filter.skipLimit(req.query);
        var objectId = req.query.object;

        if (!objectId) {
            return next();
        }

        response.find({object: objectId}, options, function (err, docs) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: docs
            });
        });
    };

    return exports;
};
