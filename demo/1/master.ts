
import * as latte_db from "latte_db"
let number = 0;
function getTasks(size, callback) {
    let tasks = [];
    for (let i = 0; i < size; i++) {
        tasks.push({
            time: Date.now()
        });
    }
    callback(null, tasks);
}
function deleteTasks(tasks) {

}
function count(task, result) {
    number++
}
export {
    getTasks,
    deleteTasks,
    count
}