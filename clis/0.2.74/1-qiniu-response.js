/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-22 20:45
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var response = require('../../webserver/models/').response;
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

    response.find({}, function (err, docs) {
        if (err) {
            console.log('find response error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            var content = doc.content.replace(REG_S_YDR_ME, 'https://dn-fed.qbox.me/@/');

            content = xss.mdSafe(content);

            if(!content.trim()){
                content = '无内容';
            }

            var contentHTML = xss.mdRender(content);

            if (!contentHTML) {
                content = '无内容';
                contentHTML = '<p>无内容</p>';
            }

            console.log(doc.id);

            response.findOneAndUpdate({
                _id: doc.id
            }, {
                content: content,
                contentHTML: contentHTML
            }, done);
        }).together(function (err) {
            if (err) {
                console.log('modify response error');
                console.error(err.stack);
                return process.exit();
            }

            console.log('modify all response success');
            process.exit();
        });
    });
});

