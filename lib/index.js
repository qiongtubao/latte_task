"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_cluster = require("cluster");
var Task = node_cluster.isMaster ? require("./master/index").Task : require("./slave/index").Task;
function create(config) {
    return new Task(config);
}
exports.create = create;
