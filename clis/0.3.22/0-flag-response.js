/*!
 * 回复 => 评论
 * @author ydr.me
 * @create 2015-06-23 19:50
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/services/').developer;
var response = require('../../webserver/services/').response;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }


    response.find({}, {
        nor: {
            parentResponse: null
        }
    }, function (err, list) {
        if (err) {
            console.log('find response error');
            console.error(err.stack);
            return process.exit();
        }

        console.log(list.length);
        howdo.each(list, function (index, resp, next1) {
            console.log('do', resp.id);

            howdo
                // 查找父级
                .task(function (next2) {
                    response.findOne({
                        _id: resp.parentResponse
                    }, next2);
                })
                // 查找父级
                .task(function (next2, parent) {
                    developer.findOne({
                        _id: parent.author
                    }, next2);
                })
                // 修改评论内容
                .task(function (next2, author) {
                    resp.atList = resp.atList || [];
                    resp.atList.push(author.id.toString());
                    response.findOneAndUpdate({
                        _id: resp.id.toString()
                    }, {
                        content: '@' + author.githubLogin + '\n\n' + resp.content,
                        contentHTML: '<p><a href="/developer/' + author.githubLogin + '" class="at">@' + author.githubLogin + '</a></p>' + resp.contentHTML,
                        parentAuthor: null,
                        parentResponse: null,
                        atList: resp.atList
                    }, next2);
                })
                .follow(next1);
        }).follow(function (err) {
            if (err) {
                console.log(err.stack);
                return process.exit();
            }

            console.log('do success');
            return process.exit();
        });
    });
});