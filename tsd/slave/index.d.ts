import { BaseTask } from "../lib/task";
import { Rpc } from "./rpc";
import { Slave } from "./slave";
export declare class Task extends BaseTask {
    rpc: Rpc;
    slave: Slave;
    constructor(config: any);
    run(): void;
}
