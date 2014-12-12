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
        var resError;

        if (REG_ACCEPT_JSON.test(req.headers.accept)) {
            if (err.message) {
                resError = err.message;
            } else {
                resError = {};
                dato.each(err, function (key, err) {
                    resError[key] = err.message;
                });
            }

            res.json({
                code: 500,
                message: resError
            });
        } else {
            resError = [];

            if (err.message) {
                resError.push(err.message);
            } else {
                dato.each(err, function (key, err) {
                    resError.push(err.message);
                });
            }

            res.status(500).render('server-error.html', {
                redirect: err.redirect,
                errors: resError
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
        }else{
            res.status(404).render('client-error.html');
        }
    };

    return exports;
};
