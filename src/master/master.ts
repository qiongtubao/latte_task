import { timingSafeEqual } from "crypto";
import * as latte_lib from "latte_lib"
import * as Fs from "fs"
import * as Path from "path"
export enum Status {
    READY,
    LOCK,
    CLOSE
}
export interface Runer {
    getTasks: (size: number, callback: Function) => {},
    deleteTasks: (data: any[], callback: Function) => {},
    count: (task: any, result: any) => {}
}
function randomId() {
    return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
}
export class Master extends latte_lib.events {
    config: any;
    data: Runer;
    idleTasks: any[] = [];
    runingTasks: any[] = [];
    loadStatus: Status = Status.READY;
    saveStatus: Status = Status.READY;
    constructor(config, data: Runer) {
        super();
        this.config = (<any>Object).assign(latte_lib.utils.copy({
            saveFile: process.cwd() + "/save.latte",
            min: 10
        }), config);
        this.data = data;
        this.load();
    }
    load() {
        if (!Fs.existsSync(this.config.saveFile)) {
            return;
        }
        let data = Fs.readFileSync(this.config.saveFile).toString();
        try {
            let tasks = JSON.parse(data);
            this.idleTasks = tasks.runingTasks.concat(tasks.idleTasks);
        } catch (err) {
            Fs.copyFileSync(this.config.saveFile, Path.dirname(this.config.saveFile) + "/" + Date.now() + ".err.saveFile");
            console.log("加载任务失败");
        }
    }
    addTask() {
        if (this.loadStatus == Status.LOCK) {
            return;
        }
        this.loadStatus = Status.LOCK;
        this.data.getTasks(this.config.min - this.idleTasks.length, (err, data) => {
            if (err) {
                this.loadStatus = Status.READY;
                return;
            }
            for (let i = 0, len = data.length; i < len; i++) {
                data[i]._latteid = randomId();
                this.idleTasks.push(data[i]);
            }
            this.save();
            if (data.length != 0) {
                this.emit('addTask', data.length);
            }
            this.data.deleteTasks(data, (err) => {
                if (err) {
                    throw err;
                }
                this.loadStatus = Status.READY;
            });
        });
    }
    getTask() {
        if (this.idleTasks.length == 0) {
            this.addTask();
            return null;
        }
        let task = this.idleTasks.shift();
        this.runingTasks.push(task);
        this.save();
        this.addTask();
        return task;
    }
    rollbackTask() {
        let task = this.runingTasks.pop();
        this.idleTasks.unshift(task);
        this.save();
    }

    save(callback?) {
        Fs.writeFileSync(this.config.saveFile, latte_lib.format.jsonFormat({
            idleTasks: this.idleTasks,
            runingTasks: this.runingTasks
        }));
    }
    finishTask(task, result) {
        let index = -1;
        for (let i = 0, len = this.runingTasks.length; i < len; i++) {
            if (this.runingTasks[i]._latteid == task._latteid) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            return;
        }
        this.runingTasks.splice(index, 1);
        this.save();
        this.data.count(task, result);
    }
    static create(config) {
        if (config.path) {
            let data;
            try {
                data = require(Path.resolve(process.cwd(), config.path));
            } catch (err) {
                console.log(err);
                return;
            }
            let master = new Master(config, data);
            master.addTask();
            return master;
        }
        return null;
    }
}