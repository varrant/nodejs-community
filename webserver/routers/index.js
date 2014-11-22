/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');

module.exports = function (app) {
    require('./test.js')(app, controllers.test);
    require('./error.js')(app, controllers.error);
};
