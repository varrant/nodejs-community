'use strict';

var mongoose = require('../../webserver/mongoose.js');
var object = require('../../webserver/models/index').object;
var howdo = require('howdo');
var random = require('ydr-utils').random;


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    object.find({}, function (err, docs) {
        if (err) {
            console.log('read object error');
            console.error(err);
            return process.exit();
        }

        howdo.each(docs, function (index, doc, done) {
            object.findOneAndUpdate({
                _id: doc.id
            }, {
                linkByCount: doc.viewByCount + random.number(1, 100)
            }, done);
        }).together(function (err) {
            if (err) {
                console.log('update object error');
                console.error(err);
                return process.exit();
            }

            console.log('OK');
            process.exit();
        });
    });
});
