/**
 * 运维更新启动
 * @author ydr.me
 * @create 2015-08-12 13:31:43
 */

'use strict';

var path = require('path');
var pm2 = require('pm2');
var howdo = require('howdo');
var childProcess = require('child_process');
var dato = require('ydr-utils').dato;
var date = require('ydr-utils').date;
var typeis = require('ydr-utils').typeis;
var pkg = require('./package.json');
var configs = require('./configs/index.js');
var cwd = path.join(__dirname, './');
var isRestart = false;
var appConfig = {
    name: pkg.name,
    script: path.join(cwd, './app.js'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: path.join(cwd, './logs/err.log'),
    out_file: path.join(cwd, './logs/out.log'),
    instances: 1,
    max_restarts: 2,
    env: {}
};

/**
 * 执行系统命令
 * @param cmds {Array|String} 命令数组
 * @param [callback] {Function} 执行完毕回调
 */
var exec = function (cmds, callback) {
    cmds = typeis.string(cmds) ? [cmds] : cmds;
    childProcess.exec(cmds.join('&'), function (err, stdout, stderr) {
        if (err) {
            console.log(err.message);
            return process.exit(1);
        }

        console.log(stdout);
        console.log(stderr);

        if (typeis.function(callback)) {
            callback();
        }
    });
};


/**
 * git 更新
 * @param callback
 */
var update = function (callback) {
    var cmds = [];

    cmds.push('cd ' + path.join(__dirname, '../'));
    cmds.push('pwd');
    cmds.push('git branch');
    cmds.push('git pull');
    cmds.push('npm install --registry=https://r.cnpmjs.org');

    exec(cmds, callback);
};


/**
 * 连接 pm2
 * @param callback
 */
var connect = function (callback) {
    howdo
        // 更新代码
        .task(update)
        // 连接 pm2
        .task(pm2.connect)
        // 实际操作
        .task(callback)
        // 断开 pm2
        .task(pm2.disconnect)
        // 异步串行
        .follow()
        .try(function () {
            console.log('\x1b[32m', '[' + configs.env + ']', date.format('YYYY-MM-DD HH:mm:ss'), pkg.name, isRestart ? 'reload' : 'start', 'success  \n', '\x1b[0m');
            setTimeout(function () {
                exec('pm2 desc ' + pkg.name);
            }, 1000);
        })
        .catch(function (err) {
            console.log('\x1b[31m', '[' + configs.env + ']', date.format('YYYY-MM-DD HH:mm:ss'), pkg.name, isRestart ? 'reload' : 'start', 'error  \n', '\x1b[0m');
            console.log(err.message);
            process.exit(1);
        });
};


connect(function (next) {
    pm2.list(function (err, list) {
        if (err) {
            return next(err);
        }

        var findId = -1;

        dato.each(list, function (index, item) {
            if (item.name === pkg.name) {
                findId = item.pm_id;
                return false;
            }
        });

        isRestart = findId > -1;

        if (findId > -1) {
            pm2.reload(pkg.name, next);
        } else {
            pm2.start(appConfig, next);
        }
    });
});
