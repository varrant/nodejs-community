/*!
 * 控制器出口
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';


module.exports = function (app) {
    return {
        api: require('./api/')(app),
        frontend: require('./frontend/')(app),
        backend: require('./backend/')(app),
        error: require('./error.js')(app),
        preRouter: require('./pre-router.js')(app),
        test: require('./test.js')(app)
    };
};