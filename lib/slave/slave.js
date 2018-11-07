"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var Slave = (function () {
    function Slave(config, data, rpc) {
        this.config = config;
        this.data = data;
        this.rpc = rpc;
    }
    Slave.prototype.init = function () {
        var _this = this;
        this.rpc.setMethod("execTask", function (task, callback) {
            _this.data.execTask(task, callback);
        });
        this.rpc.send("startRunTask", []);
    };
    Slave.create = function (config, rpc) {
        if (config.path) {
            var data = void 0;
            try {
                data = require(Path.resolve(process.cwd(), config.path));
            }
            catch (err) {
                return;
            }
            var master = new Slave(config, data, rpc);
            return master;
        }
        return null;
    };
    return Slave;
}());
exports.Slave = Slave;
