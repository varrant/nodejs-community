/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:04
 */

'use strict';

var filter = require('../../utils/').filter;
var object = require('../../services/').object;

module.exports = function (app) {
    var exports = {};
    var locals = app.locals;

    /**
     * 列出各个 type 下的 object
     * @param type {String} object type
     * @returns {Function}
     */
    exports.list = function (type) {
        return function (req, res, next) {
            var conditions = {type: type};
            var options = filter.skipLimit(req);

            object.find(conditions, options, function (err, docs) {
                if(err){
                    return next(err);
                }

                docs = docs || [];
                var data = {
                    title: locals.$settings.types
                };
                res.render('admin/object-' + type + '.html', data);
            });
        };
    };

    return exports;
}
