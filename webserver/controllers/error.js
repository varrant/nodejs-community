/*!
 * 错误控制器
 * @author ydr.me
 * @create 2014-11-22 15:40
 */

'use strict';

var dato = require('ydr-util').dato;
var httpStatus = require('ydr-util').httpStatus;
var REG_ACCEPT_JSON = /^application\/json;\s*charset=utf-8$/i;


module.exports = function (app) {
    var exports = {};

    /**
     * server error
     * @param err
     * @param req
     * @param res
     * @param next
     */
    exports.serverError = function (err, req, res, next) {
        if (REG_ACCEPT_JSON.test(req.headers.accept)) {
            res.json({
                code: err.status || 500,
                message: err.message,
                data: err.data || null
            });
        } else {
            res.status(500).render('server-error.html', {
                title: '500',
                redirect: err.redirect,
                error: err.message
            });
        }
    }


    /**
     * client error
     * @param req
     * @param res
     * @param next
     */
    exports.clientError = function (req, res, next) {
        if (REG_ACCEPT_JSON.test(req.headers.accept)) {
            res.status(200).json({
                code: 404,
                message: httpStatus.get(404)
            });
        } else {
            res.status(404).render('client-error.html', {
                title: '404'
            });
        }
    };

    return exports;
};
