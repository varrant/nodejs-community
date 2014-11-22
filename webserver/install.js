/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-11-22 20:00
 */

'use strict';


var file = process.argv[2];
var json = fs.readJSONFileSync(file);
var mongoose = require('./mongoose.js');

mongoose(function (err) {
    if(err){
        console.error(err);
        return process.exit(-1);
    }


});