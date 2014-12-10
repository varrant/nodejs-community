/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-24 20:41
 */


var howdo = require('howdo');
var mongoose = require('../webserver/mongoose.js');
var user = require('../webserver/models/').user;
var object = require('../webserver/models/').object;
var scope = require('../webserver/models/').scope;

mongoose(function (err) {
    if (err) {
        console.log('mongoose error');
        console.error(err);
        return process.exit(-1);
    }

    console.log('=========== test start ===========');

    howdo
        //.task(function (next) {
        //    console.log('\n=========== test increase ===========');
        //
        //    user.increase({
        //        _id: '54869e75cf25bf7823b80ed5'
        //    }, 'followCount', 1, function () {
        //        console.log(arguments);
        //        next();
        //    });
        //})
        .task(function (next) {
            console.log('\n=========== test createOne ===========');

            scope.createOne({
                name: '测试域',
                uri: 'test-scope',
                cover: '1.png'
            }, function () {
                console.log(arguments);
                next();
            });
        })
        .follow(function () {
            console.log('=========== test end ===========');
            process.exit();
        });
});