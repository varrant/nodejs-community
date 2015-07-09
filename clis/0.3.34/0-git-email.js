/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-09 09:43
 */


'use strict';

var request = require('ydr-utils').request;
var dato = require('ydr-utils').dato;

request.get({
    url: 'https://api.github.com/user/emails',
    query: {
            access_token: '....'
    },
    headers: {
        Accept: 'application/json',
        'User-Agent': 'The Front-End Development Community'
    }
}, function (err, body) {
    console.log(body);

    var list = JSON.parse(body);
    var hasFind = false;
    var findEmail = '';

    /**
     * 判断是否为 github 提供的隐私邮箱
     * @param email
     * @returns {boolean}
     */
    var isNotNoReplyEmail = function (email) {
        return email.indexOf('users.noreply.github.com') > -1;
    };

    // [
    //    {"email":"cloudcome@163.com","primary":true,"verified":true},
    //    {"email":"ben.smith8@pcc.edu","primary":false,"verified":true}
    // ]
    // 通过验证的主邮箱
    dato.each(list, function (index, item) {
        if (item.verified && item.primary && !isNotNoReplyEmail(item.email)) {
            hasFind = true;
            findEmail = item.email;
            return false;
        }
    });

    // 主邮箱
    if (!hasFind) {
        dato.each(list, function (index, item) {
            if (item.primary && !isNotNoReplyEmail(item.email)) {
                hasFind = true;
                findEmail = item.email;
                console.log(item.email);
                return false;
            }
        });
    }

    // 通过验证的邮箱
    if (!hasFind) {
        dato.each(list, function (index, item) {
            if (item.verified && !isNotNoReplyEmail(item.email)) {
                hasFind = true;
                findEmail = item.email;
                return false;
            }
        });
    }

    // 否则取第一个邮箱
    if (!hasFind && list.length) {
        hasFind = true;
        findEmail = list[0].email;
    }

    console.log(findEmail);
});


