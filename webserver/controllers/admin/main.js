/*!
 * main controller
 * @author ydr.me
 * @create 2014-12-13 23:10
 */

'use strict';

var developer = require('../../services/').developer;

module.exports = function (app) {
    var exports = {};

    /**
     * 管理首页
     * @param req
     * @param res
     * @param next
     */
    exports.home = function (req, res, next) {
        var data = {
            title: '管理首页'
        };

        developer.findOne({
            _id: res.locals.$engineer.id
        }, function (err, doc) {
            if(err){
                return next(err);
            }

            req.session.$engineer = res.locals.$engineer = doc;
            res.render('admin/home.html', data);
        });
    };

    return exports;
};
