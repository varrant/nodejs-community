/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:55
 */

'use strict';


module.exports = function (app) {
    return {
        object: require('./object.js')(app),
        oss: require('./oss.js')(app),
        type: require('./type.js')(app),
        user: require('./user.js')(app)
    };
};