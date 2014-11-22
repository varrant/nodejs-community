/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 15:39
 */

'use strict';


module.exports = function(app, controller){
    app.get('/test1', controller.test1);
    app.get('/test2', controller.test2);
};
