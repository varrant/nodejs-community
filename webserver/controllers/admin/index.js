/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';


module.exports = function (app) {
    return {
        main: require('./main.js')(app),
        middleware: require('./middleware.js')(app),
        object: require('./object.js')(app),
        role: require('./role.js')(app),
        type: require('./type.js')(app)
    };
};
