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
    var alert = require('./alert.js');
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

        options.headers['accept'] = json;
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
                    // 认证不正确
                    case 406:
                        window['-csrf-'] = json.data || '';
                        break;

                    // 未登陆
                    case 401:
                        alert(json.message).on('close', function () {
                            login();
                        });
                        return;
                }

                if (json.code === 200) {
                    return the.emit('success', json.data);
                }

                the.emit('error', new Error(json.message));
            })
            .on('error', function (err) {
                the.emit('error', err);
            })
            .on('complete', function (err, json) {
                the.emit('complete', err, json);

                if (the.loading) {
                    the.loading.destroy();
                }
            })
            .on('finish', function (err, json) {
                the.emit('finish', err, json);
            });
    }, Emitter);

    module.exports = function (options) {
        return new Ajax(options);
    };
});