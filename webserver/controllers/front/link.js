/*!
 * Link
 * @author ydr.me
 * @create 2015-07-24 20:00
 */


'use strict';

var cache = require('ydr-utils').cache;
var log = require('ydr-utils').log;
var link = require('../../services/').link;


module.exports = function (app) {
    var exports = {};

    // 链接跳转
    exports.getRedirect = function (req, res, next) {
        var linkId = req.params.linkId;
        var linkMap = cache.get('app.link1Map');
        var findLink = linkMap[linkId];

        if (!findLink) {
            return res.redirect('/');
        }

        res.redirect(findLink.url);
        link.increaseVisitByCount({
            _id: linkId
        }, 1, function (err, doc) {
            if (err) {
                return log.holdError(err);
            }

            if (doc) {
                findLink.visitByCount++;
            }
        });
    };

    return exports;
};

