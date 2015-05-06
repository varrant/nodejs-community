/*!
 * oss
 * @author ydr.me
 * @create 2014-11-30 14:15
 */

'use strict';

var AliOSS = require('ydr-utils').AliOSS;
var random = require('ydr-utils').random;
var cache = require('ydr-utils').cache;
var REG_IMAGE = /^image\/.*$/;
var configs = require('../../../configs/');


module.exports = function (app) {
    var exports = {};
    var settings = cache.get('app.settings').alioss;

    settings.onbeforeput = function (fileStream, next) {
        if (!REG_IMAGE.test(fileStream.contentType)) {
            return next(new Error('只能上传图片文件'));
        }

        next();
    };

    var oss = new AliOSS(settings);

    /**
     * 上传图片到阿里云 OSS
     * @param req
     * @param res
     * @param next
     */
    exports.put = function (req, res, next) {
        oss.setOptions(cache.get('app.settings').alioss);
        oss.put(req, {
            object: configs.dir.upload + random.guid()
        }, function (err, ret) {
            if (err) {
                req.socket.destroy();
                console.log('upload error', err);
                console.log('upload developer', req.session.$developer.id);
                return next(err);
            }

            res.json({
                code: 200,
                message: '上传成功',
                data: ret
            });
        });
    };

    return exports;
};
