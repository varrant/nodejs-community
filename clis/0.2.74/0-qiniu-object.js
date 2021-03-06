/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-22 20:45
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/').object;
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

    object.find({}, function (err, docs) {
        if (err) {
            console.log('find object error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            var content = doc.content.replace(REG_S_YDR_ME, 'https://dn-fed.qbox.me/@/');
            var hidden = doc.hidden;
            var hiddenHTML;


            if (hidden) {
                hidden = hidden.replace(REG_S_YDR_ME, 'https://dn-fed.qbox.me/@/');
                hidden = xss.mdSafe(hidden);
                hiddenHTML = xss.mdRender(hidden);
            }

            content = xss.mdSafe(content);

            var introduction = xss.mdIntroduction(content);

            var toc = xss.mdTOC(content);

            var contentHTML = '';

            if (toc.trim()) {
                contentHTML += '<div class="toc"><h3 class="toc-title">TOC</h3>' + xss.mdRender(toc, true) + '</div>';
            }

            contentHTML += xss.mdRender(content);

            if (!contentHTML) {
                content = '无内容';
                contentHTML = '<p>无内容</p>';
            }

            console.log(doc.id);

            object.findOneAndUpdate({
                _id: doc.id
            }, {
                introduction: introduction,
                content: content,
                contentHTML: contentHTML,
                hidden: hidden,
                hiddenHTML: hiddenHTML
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

