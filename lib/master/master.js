"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var Fs = require("fs");
var Path = require("path");
var Status;
(function (Status) {
    Status[Status["READY"] = 0] = "READY";
    Status[Status["LOCK"] = 1] = "LOCK";
    Status[Status["CLOSE"] = 2] = "CLOSE";
})(Status = exports.Status || (exports.Status = {}));
function randomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
}
var Master = (function (_super) {
    __extends(Master, _super);
    function Master(config, data) {
        var _this = _super.call(this) || this;
        _this.idleTasks = [];
        _this.runingTasks = [];
        _this.loadStatus = Status.READY;
        _this.saveStatus = Status.READY;
        _this.config = Object.assign(latte_lib.utils.copy({
            saveFile: process.cwd() + "/save.latte",
            min: 10
        }), config);
        _this.data = data;
        _this.load();
        return _this;
    }
    Master.prototype.load = function () {
        if (!Fs.existsSync(this.config.saveFile)) {
            return;
        }
        var data = Fs.readFileSync(this.config.saveFile).toString();
        try {
            var tasks = JSON.parse(data);
            this.idleTasks = tasks.runingTasks.concat(tasks.idleTasks);
        }
        catch (err) {
            Fs.copyFileSync(this.config.saveFile, Path.dirname(this.config.saveFile) + "/" + Date.now() + ".err.saveFile");
            console.log("加载任务失败");
        }
    };
    Master.prototype.addTask = function () {
        var _this = this;
        if (this.loadStatus == Status.LOCK) {
            return;
        }
        this.loadStatus = Status.LOCK;
        this.data.getTasks(this.config.min - this.idleTasks.length, function (err, data) {
            if (err) {
                _this.loadStatus = Status.READY;
                return;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                data[i]._latteid = randomId();
                _this.idleTasks.push(data[i]);
            }
            _this.save();
            if (data.length != 0) {
                _this.emit('addTask', data.length);
            }
            _this.data.deleteTasks(data, function (err) {
                if (err) {
                    throw err;
                }
                _this.loadStatus = Status.READY;
            });
        });
    };
    Master.prototype.getTask = function () {
        if (this.idleTasks.length == 0) {
            this.addTask();
            return null;
        }
        var task = this.idleTasks.shift();
        this.runingTasks.push(task);
        this.save();
        this.addTask();
        return task;
    };
    Master.prototype.rollbackTask = function () {
        var task = this.runingTasks.pop();
        this.idleTasks.unshift(task);
        this.save();
    };
    Master.prototype.save = function (callback) {
        Fs.writeFileSync(this.config.saveFile, latte_lib.format.jsonFormat({
            idleTasks: this.idleTasks,
            runingTasks: this.runingTasks
        }));
    };
    Master.prototype.finishTask = function (task, result) {
        var index = -1;
        for (var i = 0, len = this.runingTasks.length; i < len; i++) {
            if (this.runingTasks[i]._latteid == task._latteid) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        }
        this.runingTasks.splice(index, 1);
        this.save();
        this.data.count(task, result);
    };
    Master.create = function (config) {
        if (config.path) {
            var data = void 0;
            try {
                data = require(Path.resolve(process.cwd(), config.path));
            }
            catch (err) {
                console.log(err);
                return;
            }
            var master = new Master(config, data);
            master.addTask();
            return master;
        }
        return null;
    };
    return Master;
}(latte_lib.events));
exports.Master = Master;
