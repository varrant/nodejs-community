/*!
 * response model parent => parentDeveloper parentResponse
 * @author ydr.me
 * @create 2015-02-04 21:20
 */

'use strict';

var mongoose = require('../webserver/mongoose.js');
var developer = require('../webserver/models/').developer;
var response = require('../webserver/models/').response;
var interactive = require('../webserver/models/').interactive;
var howdo = require('howdo');


mongoose(function (err) {
    if (err) {
        console.log('connect mongodb error');
        console.error(err);
        return process.exit();
    }

    response.find({}, {
        nor: {
            parent: null
        }
    }, function (err, docs) {
        if (err) {
            console.log('query interactive error');
            console.error(err);
            return process.exit();
        }

        howdo
            .each(docs, function (index, doc, next) {
                console.log('update ' + doc.id.toString() + ' now');

                response.findOneAndUpdate({
                    _id: doc.id
                }, {
                    parentResponse: parentResponse.id.toString(),
                    parentAuthor: parentResponse.author.toString()
                }, next);

            })
            .follow(function (err) {
                if (err) {
                    console.log('update response error');
                    console.error(err);
                } else {
                    console.log('update response success');
                }

                process.exit();
            });
    });
});