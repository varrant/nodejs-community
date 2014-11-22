/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 13:06
 */

'use strict';

var config = require('../../webconfig/');

module.exports = function (app) {
    /**
     * server error
     */
    app.use(function (err, req, res, next) {
        if ('pro' === config.app.env) {
            res.status(500).send('server error');
        } else {
            console.log(err);
            res.status(500).send(err.message);
        }
    });


    /**
     * client error
     */
    app.use(function (req, res, next) {
        res.status(404).send('client error');
    });
};
