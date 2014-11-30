/*!
 * 错误控制器
 * @author ydr.me
 * @create 2014-11-22 15:40
 */

'use strict';

var ydrUtil = require('ydr-util');


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

        if (req.headers.accept === 'application/json') {
            if (err.message) {
                resError = err.message;
            } else {
                resError = {};
                ydrUtil.dato.each(err, function (key, err) {
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
                ydrUtil.dato.each(err, function (key, err) {
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
        res.status(404).send('client error');
    };

    return exports;
};
