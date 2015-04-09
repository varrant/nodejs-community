/*!
 * developer controller
 * @author ydr.me
 * @create 2014-12-21 14:56
 */

'use strict';

var developer = require('../../models/').developer;
var typeis = require('ydr-utils').typeis;
var role20 = 1 << 20;

module.exports = function (app) {
    var exports = {};

    /**
     * 我
     * @param req
     * @param res
     * @param next
     */
    exports.me = function (req, res, next) {
        var data = {
            title: '我',
            me: res.locals.$developer
        };

        developer.findOne({
            _id: res.locals.$developer.id
        }, function (err, doc) {
            if(err){
                return next(err);
            }

            if(!doc){
                return next();
            }

            req.session.$developer = res.locals.$developer = doc;
            res.render('admin/developer-me.html', data);
        });
    };

    return exports;
};
