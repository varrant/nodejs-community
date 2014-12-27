/*!
 * API 控制器出口
 * @author ydr.me
 * @create 2014-11-23 11:55
 */

'use strict';


module.exports = function (app) {
    return {
        category: require('./category.js')(app),
        column: require('./column.js')(app),
        engineer: require('./engineer.js')(app),
        middleware: require('./middleware.js')(app),
        nav: require('./nav.js')(app),
        notification: require('./notification.js')(app),
        object: require('./object.js')(app),
        oss: require('./oss.js')(app),
        response: require('./response.js')(app),
        section: require('./section.js')(app),
        setting: require('./setting.js')(app),
        translate: require('./translate.js')(app)
    };
};