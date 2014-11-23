/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';

module.exports = function (app) {
    return {
        user: require('./user.js')(app)
    };
};
