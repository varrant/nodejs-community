/*!
 * object
 * @author ydr.me
 * @create 2014-12-15 21:04
 */

'use strict';

var filter = require('../../utils/').filter;
var object = require('../../services/').object;
var dato = require('ydr-utils').dato;

module.exports = function (app) {
    var exports = {};


    /**
     * 列出各个 type 下的 object
     * @param section {String} object type
     * @returns {Function}
     */
    exports.list = function (section) {
        return function (req, res, next) {
            section = app.locals.$sectionIdMap[section.id];

            var data = {
                title: section.name + '管理',
                section: section.id,
                introduction: section.introduction
            };

            res.render('admin/list-' + section.uri + '.html', data);
        };
    };


    /**
     * 展示某个 id 的 object
     * @param section
     * @returns {Function}
     */
    exports.get = function (section) {
        return function (req, res, next) {
            section = app.locals.$sectionIdMap[section.id];

            var data = {
                title: section.name + (req.query.id ? '更新' : '创建'),
                id: req.query.id || '',
                section: section.id,
                introduction: section.introduction
            };

            res.render('admin/item-' + section.uri + '.html', data);
        };
    };

    return exports;
}
