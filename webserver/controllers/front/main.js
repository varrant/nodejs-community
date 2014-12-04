/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.home = function(req, res, next){
        res.render('front/home.html');
    };

    return exports;
};
