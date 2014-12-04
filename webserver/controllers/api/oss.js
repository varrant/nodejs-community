/*!
 * oss
 * @author ydr.me
 * @create 2014-11-30 14:15
 */

'use strict';

var Oss = require('ydr-ali-oss');
var random = require('ydr-util').random;
var REG_IMAGE = /^image\/.*$/;

module.exports = function (app) {
    var exports = {};
    var settings = app.locals.settings2.alioss;
    settings.onbeforeput = function(fileStream, next){
        if(!REG_IMAGE.test(fileStream.contentType)){
            return next(new Error('只能上传图片文件'));
        }

        next();
    };
    var oss = new Oss(settings);


    /**
     * 上传
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        oss.put(req, {
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
