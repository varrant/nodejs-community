/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-26 20:38
 */

'use strict';

var routers = require('./routers/');
var config = require('../webconfig/');

module.exports = function (nextHowdo, app) {
    routers(app);
    app.listen(config.app.port, function (err) {
        nextHowdo(err, app);
    });
}
