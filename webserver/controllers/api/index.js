/*!
 * API 控制器出口
 * @author ydr.me
 * @create 2014-11-23 11:55
 */

'use strict';


module.exports = function (app) {
    return {
        engineer: require('./engineer.js')(app),
        nav: require('./nav.js')(app),
        notification: require('./notification.js')(app),
        object: require('./object.js')(app),
        oss: require('./oss.js')(app),
        scope: require('./scope.js')(app),
        setting: require('./setting.js')(app),
        translate: require('./translate.js')(app)
    };
};