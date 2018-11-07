"use strict";
exports.__esModule = true;
var Task = require("../../lib/index");
var task = Task.create({
    master: {
        path: "./demo/1/master.js"
    },
    slave: {
        path: "./demo/1/slave.js"
    },
    cpus: 1
});
task.run();
