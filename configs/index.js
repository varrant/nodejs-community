/*!
 * 配置出口
 * @author ydr.me
 * @create 2014-11-22 12:04
 */

'use strict';


var app = require('./app.js');

module.exports = {
    app: app,
    dir: require('./dir.js')(app),
    role: require('./role.js')(app),
    secret: require('./secret.js')(app)
};
