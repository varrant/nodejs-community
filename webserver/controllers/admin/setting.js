/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-19 18:38
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    /**
     * 列出权限
     * @param req
     * @param res
     * @param next
     */
    exports.listRole = function (req, res, next) {
        var data = {
            title: '权限管理'
        };

        res.render('admin/setting/role.html', data);
    };


    /**
     * 列出域
     * @param req
     * @param res
     * @param next
     */
    exports.listScope = function (req, res, next) {
        var data = {
            title: '域管理'
        };
        res.render('admin/setting/scope.html', data);
    };


    /**
     * 板块列表
     * @param req
     * @param res
     * @param next
     */
    exports.listType = function (req, res, next) {
        var data = {
            title: '板块管理'
        };

        res.render('admin/setting/type.html', data);
    };


    /**
     * 存储设置
     * @param req
     * @param res
     * @param next
     */
    exports.listOss = function (req, res, next) {
        var data = {
            title: '存储设置'
        };

        res.render('admin/setting/oss.html', data);
    };


    /**
     * 授权设置
     * @param req
     * @param res
     * @param next
     */
    exports.listOauth = function (req, res, next) {
        var data = {
            title: '授权设置'
        };

        res.render('admin/setting/oauth.html', data);
    };


    /**
     * 社区设置
     * @param req
     * @param res
     * @param next
     */
    exports.listWebsite = function (req, res, next) {
        var data = {
            title: '社区设置'
        };

        res.render('admin/setting/website.html', data);
    };

    return exports;
}
