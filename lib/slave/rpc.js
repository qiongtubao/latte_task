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
var Cluster = require("cluster");
var rpc_1 = require("../lib/rpc");
var Rpc = (function (_super) {
    __extends(Rpc, _super);
    function Rpc(config, root) {
        var _this = _super.call(this, config) || this;
        _this.setWorker(Cluster.worker);
        _this.root = root;
        _this.init();
        return _this;
    }
    Rpc.prototype.init = function () {
    };
    Rpc.prototype.setWorker = function (worker) {
        this.initWorker(worker);
        this.worker = worker;
    };
    Rpc.prototype.send = function (method, params, socket, cb) {
        this.sendWorker(this.worker.process, method, params, socket, cb);
    };
    return Rpc;
}(rpc_1.BaseRpc));
exports.Rpc = Rpc;
