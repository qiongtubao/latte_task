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
var rpc_1 = require("./rpc");
var slave_1 = require("./slave");
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(config) {
        var _this = _super.call(this, config) || this;
        _this.rpc = new rpc_1.Rpc(config, _this);
        _this.slave = slave_1.Slave.create(config.slave, _this.rpc);
        return _this;
    }
    Task.prototype.run = function () {
        this.slave.init();
    };
    return Task;
}(task_1.BaseTask));
exports.Task = Task;
