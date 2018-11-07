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
var rpc_1 = require("../lib/rpc");
var latte_lib = require("latte_lib");
var Rpc = (function (_super) {
    __extends(Rpc, _super);
    function Rpc(config) {
        var _this = _super.call(this, config) || this;
        _this.workers = [];
        _this.idleWorkers = [];
        _this.init();
        return _this;
    }
    Rpc.prototype.init = function () {
        var self = this;
        this.setMethod("startRunTask", function (calback) {
            self.idleWorkers.push(this);
            self.emit('idle');
        });
    };
    Rpc.prototype.addWorker = function (worker) {
        _super.prototype.initWorker.call(this, worker);
        this.workers[worker.id] = worker;
        worker['rpc'] = this;
    };
    Rpc.prototype.removeWorker = function (worker) {
        if (worker.id != null) {
            this.workers[worker.id] = null;
        }
    };
    Rpc.prototype.sendTask = function (task, callback) {
        if (this.idleWorkers.length == 0) {
            return false;
        }
        var worker = this.idleWorkers.shift();
        this.send(worker, "execTask", [task], null, function (err, result) {
            this.idleWorkers.push(worker);
            callback(err, result);
        });
        return true;
    };
    Rpc.prototype.send = function (worker, method, params, socket, cb) {
        var self = this;
        if (latte_lib.utils.isFunction(socket)) {
            cb = socket;
            socket = null;
        }
        worker.send({
            method: method,
            params: params,
            id: ++this.id
        }, socket);
        if (cb) {
            this.once(this.id.toString(), cb);
        }
    };
    return Rpc;
}(rpc_1.BaseRpc));
exports.Rpc = Rpc;
