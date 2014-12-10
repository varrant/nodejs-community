/*!
 * model test
 * @author ydr.me
 * @create 2014-11-24 20:41
 */


var howdo = require('howdo');
var mongoose = require('../webserver/mongoose.js');
var user = require('../webserver/models/').user;
var object = require('../webserver/models/').object;
var scope = require('../webserver/models/').scope;
var random = require('ydr-util').random;

mongoose(function (err) {
    if (err) {
        console.log('mongoose error');
        console.error(err);
        return process.exit(-1);
    }

    console.log('=========== test start ===========');
    var t1 = Date.now();

    howdo
        .task(function (next) {
            console.log('\n=========== test createOne ===========');

            user.createOne({
                email: random.string(10) + '@domain.com',
                github: random.string(10),
                nickname: random.string(10)
            }, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test existOne ===========');

            user.existOne({
                github: 'abcdefg'
            },{
                email: 'abcdefg@domain.com',
                nickname: '呵呵'
            }, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test findOneAndUpdate ===========');

            user.findOneAndUpdate({
                github: 'abcdefg'
            },{
                email: 'abcdefghhhhhhhhhhhhhhhh@domain.com',
                nickname: '呵呵dddddddd'
            }, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test getMeta ===========');

            user.getMeta({
                github: 'cloudcome'
            }, 'bio', function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test setMeta ===========');

            user.setMeta({
                github: 'cloudcome'
            }, 'bio', '呵呵', function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test setMeta ===========');

            user.setMeta({
                github: 'cloudcome'
            }, {
                bio: '呵呵呵呵'
            }, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test increase ===========');

            user.increase({
                github: 'cloudcome'
            }, 'followCount', 1, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test push ===========');

            var id = random.string(24, 'a0');
            console.log(id);
            user.push({
                github: 'cloudcome'
            }, 'organizations', id, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test push ===========');

            var id = '001300000004ad0009000000';
            console.log(id);
            user.pull({
                github: 'cloudcome'
            }, 'organizations', id, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test toggle ===========');

            user.toggle({
                github: 'cloudcome'
            }, 'isBlock', true, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test find ===========');

            user.find({}, {limit: 2}, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test findOne ===========');

            user.findOne({}, function () {
                console.log(arguments);
                next();
            });
        })
        .task(function (next) {
            console.log('\n=========== test count ===========');

            user.count({}, function () {
                console.log(arguments);
                next();
            });
        })
        .follow(function () {
            var t = Date.now() - t1;
            console.log('\n=========== test end (' + t + 'ms) ===========');
            process.exit();
        });
});