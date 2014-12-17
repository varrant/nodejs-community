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
    var typesMap = app.locals.$settings._typesMap;

    /**
     * 列出各个 type 下的 object
     * @param type {String} object type
     * @returns {Function}
     */
    exports.list = function (type) {
        return function (req, res, next) {
            var data = {
                title: typesMap[type].title + '管理'
            };

            res.render('admin/object-list-' + type + '.html', data);
        };
    };


    /**
     * 展示某个 id 的 object
     * @param type
     * @returns {Function}
     */
    exports.get = function (type) {
        return function (req, res, next) {
            var data = {
                title: typesMap[type].title + (req.query.id ? '更新' : '创建'),
                id: req.query.id || ''
            };

            res.render('admin/object-item-' + type + '.html', data);
        }
    }

    return exports;
}
