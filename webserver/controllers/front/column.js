/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-02-12 21:11
 */

'use strict';

var column = require('../../services/').column;


module.exports = function (app) {
    var exports = {};

    exports.get = function (req, res, next) {
        var uri  = req.params.uri;

        column.findOne({
            uri: uri
        }, {
            populate: ['author']
        },function (err, doc) {
            if(err){
                return next(err);
            }

            if(!doc){
                return next();
            }

            res.json(doc);
        });
    };

    return exports;
};
