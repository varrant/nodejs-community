/*!
 * admin controller 出口
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';


module.exports = function (app) {
    return {
        engineer: require('./engineer.js')(app),
        main: require('./main.js')(app),
        middleware: require('./middleware.js')(app),
        object: require('./object.js')(app),
        scope: require('./scope.js')(app),
        setting: require('./setting.js')(app)
    };
};
