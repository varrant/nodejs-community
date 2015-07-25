/*!
 * front exports
 * @author ydr.me
 * @create 2014-11-23 11:56
 */

'use strict';

module.exports = function (app) {
    return {
        developer: require('./developer.js')(app),
        discover: require('./discover.js')(app),
        link: require('./link.js')(app),
        main: require('./main.js')(app),
        object: require('./object.js')(app),
        column: require('./column.js')(app)
    };
};
