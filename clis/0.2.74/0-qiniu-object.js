/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-22 20:45
 */


'use strict';


var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/').object;
var howdo = require('howdo');

mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err.stack);
        return process.exit();
    }

    object.find({}, function (err, docs) {
        if (err) {
            console.log('find developers error');
            console.error(err.stack);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            var content = doc.content;
            var hidden = doc.hidden;

            object.findOneAndUpdate({
                _id: doc.id
            }, {
                content: '',
                contentHTML: '',
                hidden: '',
                hiddenHTML: ''
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

