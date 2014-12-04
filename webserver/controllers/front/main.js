/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.home = function(req, res, next){
        res.render('frontend/home.html');
    };

    return exports;
};
