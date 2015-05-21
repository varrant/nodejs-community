/*!
 * API 路由
 * @author ydr.me
 * @create 2014-11-23 11:59
 */

'use strict';

var settings = ['oauth', 'qiniu', 'smtp', 'website', 'default'];
var configs = require('../../configs/');

module.exports = function (app, ctrl) {
    var timeout = 'dev' === configs.app.env ? 1000 : 0;
    app.all(/^\/api\/.*$/, ctrl.middleware.delay(timeout));
    app.all(/^\/admin\/api\/.*$/, ctrl.middleware.delay(timeout));


    // notification
    app.get('/admin/api/notification/count/', ctrl.notification.count);
    app.get('/admin/api/notification/', ctrl.notification.get);
    app.delete('/admin/api/notification/', ctrl.notification.delete);
    app.put('/admin/api/notification/', ctrl.notification.put);


    // nav
    app.get('/admin/api/nav/', ctrl.nav.list);


    // object
    app.get('/admin/api/object/list/', ctrl.object.list);
    app.get('/admin/api/object/', ctrl.object.get);
    app.post('/admin/api/object/', ctrl.object.post);
    app.put('/admin/api/object/', ctrl.object.put);
    app.post('/admin/api/object/accept/', ctrl.object.accept);
    app.delete('/admin/api/object/', ctrl.object.remove);


    // response
    app.get('/api/response/', ctrl.response.get);
    app.get('/api/response/list/', ctrl.response.list);
    app.get('/api/response/count/', ctrl.response.count);
    app.post('/admin/api/response/', ctrl.response.post);
    app.post('/admin/api/response/agree/', ctrl.response.agree);


    // oss
    //app.put('/admin/api/oss/', ctrl.oss.put);
    app.get('/admin/api/qiniu/', ctrl.oss.getQiniuKey);


    // setting
    app.get('/admin/api/setting/', ctrl.setting.get);
    settings.forEach(function (key) {
        app.put('/admin/api/setting/' + key + '/', ctrl.setting.put(key));
    });


    // section
    app.get('/admin/api/section/', ctrl.section.get);
    app.put('/admin/api/section/', ctrl.section.put);
    app.delete('/admin/api/section/', ctrl.section.delete);


    // category
    app.get('/admin/api/category/', ctrl.category.get);
    app.put('/admin/api/category/', ctrl.category.put);
    app.delete('/admin/api/category/', ctrl.category.delete);


    // column
    app.get('/admin/api/column/', ctrl.column.get);
    app.put('/admin/api/column/', ctrl.column.put);
    app.delete('/admin/api/column/', ctrl.column.delete);


    // developer
    app.post('/api/developer/login/', ctrl.developer.login);
    app.post('/api/developer/logout/', ctrl.developer.logout);
    app.get('/api/developer/', ctrl.developer.get);
    app.get('/admin/api/developer/', ctrl.developer.detail);
    app.post('/admin/api/developer/', ctrl.developer.role);
    app.get('/admin/api/developer/follow/', ctrl.developer.getFollow);
    app.put('/admin/api/developer/follow/', ctrl.developer.putFollow);
    app.delete('/admin/api/developer/follow/', ctrl.developer.deleteFollow);


    // translate
    app.get('/api/translate/', ctrl.translate.get);
};
