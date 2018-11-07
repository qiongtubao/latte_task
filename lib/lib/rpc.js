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
var BaseRpc = (function (_super) {
    __extends(BaseRpc, _super);
    function BaseRpc(config) {
        var _this = _super.call(this) || this;
        _this.methods = {};
        _this.id = 0;
        _this.config = config;
        return _this;
    }
    BaseRpc.prototype.setMethod = function (method, func) {
        this.methods[method] = func;
    };
    BaseRpc.prototype.backData = function (err, result, id) {
        return {
            error: err,
            result: result,
            id: id
        };
    };
    BaseRpc.prototype.sendWorker = function (worker, method, params, socket, cb) {
        var id = ++this.id;
        if (latte_lib.utils.isFunction(socket)) {
            cb = socket;
            socket = null;
        }
        worker.send({
            method: method,
            params: params,
            id: id
        }, socket);
        cb && this.once(id.toString(), function (err, data) {
            cb(err, data);
        });
    };
    BaseRpc.prototype.initWorker = function (worker) {
        var _this = this;
        worker['rpc'] = this;
        return worker.process.on("message", function (data, socket) {
            if (socket) {
                socket.readable = socket.writeable = true;
                socket.resume();
            }
            if (data.method) {
                var method = _this.methods[data.method];
                if (method) {
                    if (!latte_lib.utils.isArray(data.params)) {
                        data.params = [].concat(data.params);
                    }
                    socket && data.params.push(socket);
                    data.params.push(function (err, result, s) {
                        worker.send(_this.backData(err, result, data.id), s);
                    });
                    try {
                        method.apply(worker, data.params);
                    }
                    catch (e) {
                        _this.emit("error", e);
                    }
                }
                else if (data.id) {
                    _this.emit(data.id, data.error, data.result, socket);
                }
            }
            else if (data.id) {
                _this.emit(data.id, data.error, data.result, socket);
            }
        });
    };
    return BaseRpc;
}(latte_lib.events));
exports.BaseRpc = BaseRpc;
