/*!
 * model test
 * @author ydr.me
 * @create 2014-11-24 20:41
 */


var mongoose = require('../webserver/mongoose.js');
var user = require('../webserver/models/').user;
var object = require('../webserver/models/').object;
var scope = require('../webserver/models/').scope;
var random = require('ydr-util').random;
var test = require('./test.js');

test
    .push('createOne', function (next) {
        user.createOne({
            email: random.string(10) + '@domain.com',
            github: random.string(10),
            nickname: random.string(10)
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('existOne', function (next) {
        user.existOne({
            github: 'abcdefg'
        }, {
            email: 'abcdefg@domain.com',
            nickname: '呵呵'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('findOneAndUpdate', function (next) {
        user.findOneAndUpdate({
            github: 'abcdefg'
        }, {
            email: 'abcdefghhhhhhhhhhhhhhhh@domain.com',
            nickname: '呵呵dddddddd'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('getMeta', function (next) {
        user.getMeta({
            github: 'cloudcome'
        }, 'bio', function () {
            console.log(arguments);
            next();
        });
    })
    .push('setMeta', function (next) {
        user.setMeta({
            github: 'cloudcome'
        }, 'bio', '呵呵', function () {
            console.log(arguments);
            next();
        });
    })
    .push('setMeta', function (next) {
        user.setMeta({
            github: 'cloudcome'
        }, {
            bio: '呵呵呵呵'
        }, function () {
            console.log(arguments);
            next();
        });
    })
    .push('increase', function (next) {
        user.increase({
            github: 'cloudcome'
        }, 'followCount', 1, function () {
            console.log(arguments);
            next();
        });
    })
    .push('push', function (next) {
        var id = random.string(24, 'a0');
        user.push({
            github: 'cloudcome'
        }, 'organizations', id, function () {
            console.log(arguments);
            next();
        });
    })
    .push('pull', function (next) {
        var id = '001300000004ad0009000000';
        user.pull({
            github: 'cloudcome'
        }, 'organizations', id, function () {
            console.log(arguments);
            next();
        });
    })
    .push('toggle', function (next) {
        user.toggle({
            github: 'cloudcome'
        }, 'isBlock', true, function () {
            console.log(arguments);
            next();
        });
    })
    .push('find', function (next) {
        user.find({}, {limit: 2}, function () {
            console.log(arguments);
            next();
        });
    })
    .push('findOne', function (next) {
        user.findOne({}, function () {
            console.log(arguments);
            next();
        });
    })
    .push('count', function (next) {
        user.count({}, function () {
            console.log(arguments);
            next();
        });
    })
    .start();

