/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    exports.home = function(req, res, next){
        res.render('front/home.html', {
            list: [0,1,2,3,4,5,6,7,8,9]
        });
    };

    return exports;
};
