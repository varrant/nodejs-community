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
    group: require('./group.js')(app),
    notification: require('./notification.js')(app),
    permission: require('./permission.js')(app),
    score: require('./score.js')(app),
    secret: require('./secret.js')(app),
    smtp: require('./smtp.js')(app)
};
