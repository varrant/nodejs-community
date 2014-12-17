/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-17 11:02
 */

'use strict';

var translate = require('ydr-translate');

module.exports = function (app) {
    var exports = {};


    /**
     * 翻译
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    exports.get = function (req, res, next) {
        var word = req.query.word || '';

        if (!word) {
            return res.json({
                code: 200,
                data: ''
            });
        }

        translate(word, function (err, word2) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                data: word2
            });
        });
    }

    return exports;
}
