import { BaseTask } from "../lib/task";
import { Master } from "./master";
import { Rpc as MasterRpc } from "./rpc";
import * as Cluster from "cluster"

export class Task extends BaseTask {
    master: Master;
    rpc: MasterRpc;
    constructor(config) {
        super(config);
        this.config = config;
        this.rpc = new MasterRpc(config);
        this.init();
    }
    init() {
        if (this.config.master) {
            this.master = Master.create(this.config.master);
        }
        this.rpc.on("idle", () => {
            console.log("idle");
            this.assignments();
        });
    }
    assignments() {
        let task = this.master.getTask();
        if (!task) {
            return;
        }
        let result = this.rpc.sendTask(task, (err, result) => {
            this.master.finishTask(task, {
                err: err,
                result: result
            });
            this.assignments();
        });
        if (!result) {
            this.master.rollbackTask();
        }
    }
    run() {
        for (let i = 0, len = this.config.cpus; i < len; i++) {
            this.createWorker();
        }
        Cluster.on("exit", (worker) => {
            this.rpc.removeWorker(worker);
            if (this.config.restart) {
                var now = this.createWorker();
                this.emit("restart", worker, now);
            }
        });
    }
    createWorker() {
        (<any>Cluster).schedulingPolicy = (<any>Cluster).SCHED_NONE;
        var worker = Cluster.fork();
        this.emit("start", worker);
        this.rpc.addWorker(worker);
        return worker;
    }
}