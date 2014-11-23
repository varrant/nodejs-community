/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-23 12:00
 */

'use strict';


module.exports = function(app, controller){
    app.post('/user/oauth/authorize', controller.test1);
    app.post('/user/oauth/callback', controller.test1);
};