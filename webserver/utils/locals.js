/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-15 21:11
 */

'use strict';


/**
 * 包装 app.locals.$settings
 * @param app
 */
exports.$settings = function (app) {
    var types = app.locals.$settings.types;
    var roles = app.locals.$settings.roles;
    var map1 = {};
    var list1 = [];
    var map2 = {};

    types.forEach(function (type) {
        if(type.isDisplay === true){
            list1.push(type.uri);
        }

        map1[type.uri] = type;
    });
    app.locals.$settings._typesMap = map1;
    app.locals.$settings._displayTypeUris = list1;

    roles.forEach(function (role) {
        map2[role.name] = role;
    });
    app.locals.$settings._rolesMap = map2;
};
