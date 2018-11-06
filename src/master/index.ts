import { BaseTask } from "../lib/task";
import { Master } from "./master";


export class Task extends BaseTask {
    master: Master;
    constructor(config) {
        super(config);
        this.init();
    }
    init() {
        if (this.config.master) {
            this.master = Master.create(this.config.master);
        }
    }
    run() {

    }
}