/*!
 * 控制器出口
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';


module.exports = function (app) {
    return {
        error: require('./error.js')(app),
        test: require('./test.js')(app),
        user: require('./user.js')(app)
    };
};