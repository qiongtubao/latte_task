/// <reference types="node" />
import { BaseTask } from "../lib/task";
import { Master } from "./master";
import { Rpc as MasterRpc } from "./rpc";
import * as Cluster from "cluster";
export declare class Task extends BaseTask {
    master: Master;
    rpc: MasterRpc;
    constructor(config: any);
    init(): void;
    assignments(): void;
    run(): void;
    createWorker(): Cluster.Worker;
}
