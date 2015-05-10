/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-10 14:51
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/').object;
var response = require('../../webserver/models/').response;
var howdo = require('howdo');
var random = require('ydr-utils').random;
var dato = require('ydr-utils').dato;
var xss = require('ydr-utils').xss;

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    // 查找所有文章
    object.find({}, function (err, docs) {
        if (err) {
            console.log('find object error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            object.findOneAndUpdate({
                _id: doc.id
            }, {
                introduction: xss.mdIntroduction(doc.content)
            }, done);
        }).together(function (err) {
            if (err) {
                console.log('modify object error');
                console.error(err.stack);
                return process.exit();
            }

            console.log('modify all object success');
            process.exit();
        });
    });
});

