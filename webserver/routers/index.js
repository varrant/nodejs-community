/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');

module.exports = function (app) {
    var exports = controllers(app);

    require('./test.js')(app, exports.test);
    require('./user.js')(app, exports.user);
    require('./error.js')(app, exports.error);
};
