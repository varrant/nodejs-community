/*!
 * front exports
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';

module.exports = function (app) {
    return {
        engineer: require('./engineer.js')(app),
        main: require('./main.js')(app)
    };
};
