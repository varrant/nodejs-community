/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-22 20:45
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var column = require('../../webserver/models/').column;
var howdo = require('howdo');
var xss = require('ydr-utils').xss;
// http://s.ydr.me/f/i/20141223232616632423139866
// https://dn-fed.qbox.me/@/i/20141223232616632423139866
var REG_S_YDR_ME = /http:\/\/s\.ydr\.me\/f\//g;


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    column.find({}, function (err, docs) {
        if (err) {
            console.log('find column error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            column.findOneAndUpdate({
                _id: doc.id
            }, {
                uri: doc.uri.replace(REG_S_YDR_ME, 'https://dn-fed.qbox.me/@/')
            }, done);
        }).follow(function (err) {
            if (err) {
                console.log('modify column error');
                console.error(err.stack);
                return process.exit();
            }

            console.log('modify all column success');
            process.exit();
        });
    });
});

