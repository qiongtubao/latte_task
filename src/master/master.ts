import { timingSafeEqual } from "crypto";
import * as latte_lib from "latte_lib"
import * as Fs from "fs"
import * as Path from "path"
enum Status {
    READY,
    LOCK,
    CLOSE
}
interface Runer {
    getTask: (size: number, callback: Function) => {},
    removeTask: (data: any[], callback: Function) => {},
    finishTask: (task: any, result: any) => {}
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
        this.config = (<any>Object).assign(latte_lib.utils.clone({
            saveFile: process.cwd() + "/save.latte",
            min: 10
        }), config);
        this.data = data;
        this.load();
    }
    load() {
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
        this.data.getTask(this.config.min - this.idleTasks.length, (err, data) => {
            if (err) {
                this.loadStatus = Status.READY;
                return;
            }
            for (let i = 0, len = data.length; i < len; i++) {
                this.idleTasks.push(data[i]);
            }
            this.save();
            if (data.length != 0) {
                this.emit('addTask', data.length);
            }
            this.data.removeTask(data, (err) => {
                if (err) {
                    throw err;
                }
                this.loadStatus = Status.READY;
            });
        });
    }
    getTask() {
        let task = this.idleTasks.shift();
        this.save();
        this.addTask();
        return task;
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
            if (this.runingTasks[i].id == task.id) {
                break;
            }
        }
        if (index == -1) {
            return;
        }
        this.runingTasks.splice(index, 1);
        this.data.finishTask(task, result);
    }
    static create(config) {
        if (config.master) {
            let data;
            try {
                data = require(config.master.path);
            } catch (err) {
                return;
            }
            let master = new Master(config, data);
            master.addTask();
            return master;
        }
        return null;
    }
}