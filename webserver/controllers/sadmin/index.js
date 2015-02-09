/*!
 * admin controller 出口
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';


module.exports = function (app) {
    return {
        category: require('./category.js')(app),
        column: require('./column.js')(app),
        developer: require('./developer.js')(app),
        main: require('./main.js')(app),
        middleware: require('./middleware.js')(app),
        notification: require('./notification.js')(app),
        object: require('./object.js')(app),
        section: require('./section.js')(app),
        setting: require('./setting.js')(app)
    };
};
