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
var task_1 = require("../lib/task");
var master_1 = require("./master");
var rpc_1 = require("./rpc");
var Cluster = require("cluster");
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        _this.rpc = new rpc_1.Rpc(config);
        _this.init();
        return _this;
    }
    Task.prototype.init = function () {
        var _this = this;
        if (this.config.master) {
            this.master = master_1.Master.create(this.config.master);
        }
        this.rpc.on("idle", function () {
            console.log("idle");
            _this.assignments();
        });
    };
    Task.prototype.assignments = function () {
        var _this = this;
        var task = this.master.getTask();
        if (!task) {
            return;
        }
        var result = this.rpc.sendTask(task, function (err, result) {
            _this.master.finishTask(task, {
                err: err,
                result: result
            });
            _this.assignments();
        });
        if (!result) {
            this.master.rollbackTask();
        }
    };
    Task.prototype.run = function () {
        var _this = this;
        for (var i = 0, len = this.config.cpus; i < len; i++) {
            this.createWorker();
        }
        Cluster.on("exit", function (worker) {
            _this.rpc.removeWorker(worker);
            if (_this.config.restart) {
                var now = _this.createWorker();
                _this.emit("restart", worker, now);
            }
        });
    };
    Task.prototype.createWorker = function () {
        Cluster.schedulingPolicy = Cluster.SCHED_NONE;
        var worker = Cluster.fork();
        this.emit("start", worker);
        this.rpc.addWorker(worker);
        return worker;
    };
    return Task;
}(task_1.BaseTask));
exports.Task = Task;
