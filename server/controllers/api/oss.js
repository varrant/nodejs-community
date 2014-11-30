/*!
 * oss
 * @author ydr.me
 * @create 2014-11-30 14:15
 */

'use strict';

var Oss = require('ydr-ali-oss');
var random = require('ydr-util').random;

module.exports = function (app) {
    var exports = {};
    var oss = new Oss(app.locals.settings2.alioss);

    exports.upload = function (req, res, next) {
        oss.upload(req, {
            object: '/f2ec.com/img/' + random.guid()
        }, function (err, ret) {
            if (err) {
                return next(err);
            }

            res.json({
                code: 200,
                message: '上传成功',
                result: ret
            });
        });
    };

    return exports;
};
