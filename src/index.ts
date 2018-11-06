import * as node_cluster from "cluster"
import * as latte_lib from "latte_lib"
import { BaseTask } from "./lib/task";
let Task = node_cluster.isMaster ? require("./master/index") : require("./slave/index");
export function create(config: any): BaseTask {
    return new Task(config);
}