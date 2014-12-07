/*!
 * 主
 * @author ydr.me
 * @create 2014-12-03 21:19
 */

'use strict';

module.exports = function (app) {
    var exports = {};

    /**
     * home 页
     * @param req
     * @param res
     * @param next
     */
    exports.getHome = function (req, res, next) {
        res.render('front/home.html', {
            list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
    };


    /**
     * post 页
     * @param req
     * @param res
     * @param next
     */
    exports.getPost = function (req, res, next) {
        var type = req.params[0];
        var uri = req.params[1];

        res.render('front/post-' + type + '.html', {
            list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        });
    };

    return exports;
};
