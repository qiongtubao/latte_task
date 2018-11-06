import Task from "../../lib/task"
let task = Task.create({
    master: {
        path: "./master.js"
    },
    slave: {
        path: "./slave.js"
    }
});
task.run();
