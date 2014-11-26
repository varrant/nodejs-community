/*!
 * 路由出口
 * @author ydr.me
 * @create 2014-11-22 12:38
 */

'use strict';

var controllers = require('../controllers/');
var config = require('../../webconfig/');
var log = require('ydr-util').log;

log.setOptions('env', config.app.env);
log.setOptions('path', config.dir.weblog);

module.exports = function (app) {
    var exports = controllers(app);

    require('./middleware.js')(app, exports.middleware)
    require('./test.js')(app, exports.test);
    require('./frontend.js')(app, exports.frontend);
    require('./backend.js')(app, exports.backend);
    require('./api.js')(app, exports.api);
    app.use(log());
    require('./error.js')(app, exports.error);
};
