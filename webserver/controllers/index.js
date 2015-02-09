/*!
 * 控制器出口
 * @author ydr.me
 * @create 2014-11-22 15:37
 */

'use strict';


module.exports = function (app) {
    return {
        api: require('./api/')(app),
        admin: require('./admin/')(app),
        sadmin: require('./sadmin/')(app),
        front: require('./front/')(app),
        error: require('./error.js')(app),
        middleware: require('./middleware.js')(app),
        test: require('./test.js')(app)
    };
};