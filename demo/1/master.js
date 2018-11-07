"use strict";
exports.__esModule = true;
var number = 0;
function getTasks(size, callback) {
    // console.log('size:', size);
    var tasks = [];
    for (var i = 0; i < size; i++) {
        tasks.push({
            time: Date.now()
        });
    }
    callback(null, tasks);
}
exports.getTasks = getTasks;
function deleteTasks(tasks, callback) {
    callback();
}
exports.deleteTasks = deleteTasks;
function count(task, result) {
    console.log(task, result);
    number++;
}
exports.count = count;
