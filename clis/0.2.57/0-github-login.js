/*!
 * developer
 * @author ydr.me
 * @create 2015-05-10 14:51
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var developer = require('../../webserver/models/').developer;
var howdo = require('howdo');

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    developer.find({}, function (err, docs) {
        if (err) {
            console.log('find developers error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            developer.findOneAndUpdate({
                _id: doc.id
            }, {
                githubLogin: doc.githubLogin.toLowerCase()
            }, done);
        }).together(function (err) {
            if (err) {
                console.log('modify developer error');
                console.error(err.stack);
                return process.exit();
            }

            console.log('modify all developer success');
            process.exit();
        });
    });
});

