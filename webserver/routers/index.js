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
    require('./frontend.js')(app, exports.frontend);
    require('./backend.js')(app, exports.backend);
    require('./api.js')(app, exports.api);
    require('./error.js')(app, exports.error);
};
