import * as Task from "../../lib/index"
let task = Task.create({
    master: {
        path: "./master.js"
    },
    slave: {
        path: "./slave.js"
    },
    cpus: 1
});
task.run();
