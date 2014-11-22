/*!
 * 错误控制器
 * @author ydr.me
 * @create 2014-11-22 15:40
 */

'use strict';

var config = require('../../webconfig/');


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
        if ('pro' === config.app.env) {
            res.status(500).send('server error');
        } else {
            console.log(err);
            res.status(500).send(err.message);
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
