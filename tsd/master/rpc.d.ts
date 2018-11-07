/// <reference types="node" />
import * as node_cluster from "cluster";
import { BaseRpc } from "../lib/rpc";
export declare class Rpc extends BaseRpc {
    workers: node_cluster.Worker[];
    idleWorkers: node_cluster.Worker[];
    constructor(config: any);
    init(): void;
    addWorker(worker: node_cluster.Worker): void;
    removeWorker(worker: any): void;
    sendTask(task: any, callback: any): boolean;
    send(worker: node_cluster.Worker, method: any, params: any, socket: any, cb: any): void;
}
