/*!
 * ajax
 * @author ydr.me
 * @create 2014-12-13 22:25
 */


define(function (require, exports, module) {
    'use strict';

    var xhr = require('../../alien/core/communication/xhr.js');
    var json = 'application/json; charset=utf-8';
    var login = require('./login.js');
    var alert = require('../../alien/widgets/alert.js');
    var loading = require('./loading.js');
    var Emitter = require('../../alien/libs/Emitter.js');
    var klass = require('../../alien/utils/class.js');
    var Ajax = klass.create(function (options) {
        var the = this;
        var isFormData = options.body && options.body.constructor === FormData;

        options.headers = options.headers || {};

        if (!isFormData) {
            options.headers['content-type'] = options.headers['content-type'] || json;
        }

        options.headers.accept = json;
        options.headers['x-request-csrf'] = window['-csrf-'];

        if (!isFormData) {
            options.body = JSON.stringify(options.body);
        }

        if (options.loading !== false) {
            the.loading = loading(options.loading);
        }

        the.xhr = xhr.ajax(options)
            .on('success', function (json) {
                switch (json.code) {
                    // 认证不合法
                    case 400:
                        break;

                    // 未登陆
                    case 401:
                        return alert(json).on('close', login);

                    // 不被接受，返回首页
                    case 406:
                        return alert(json).on('close', function () {
                            location.replace('/');
                        });
                }

                if (json.code === 200) {
                    return the.emit('success', json.data);
                }


                var err = new Error(json.message);

                err.code = json.code;
                the.emit('error', err);
            })
            .on('error', function (err) {
                the.emit('error', err);
            })
            .on('progress', function (eve) {
                the.emit('progress', eve);
            })
            .on('complete finish', function (err, json) {
                if (!err && json.code !== 200) {
                    err = new Error(json.message);
                    err.code = json.code;
                }

                the.emit(this.alienEvent.type, err, json && json.data);
            })
            .on('complete', function () {
                if (the.loading) {
                    the.loading.destroy();
                }
            });
    }, Emitter);

    module.exports = function (options) {
        return new Ajax(options);
    };
});