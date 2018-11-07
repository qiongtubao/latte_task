/// <reference types="node" />
import * as Cluster from "cluster";
import { BaseRpc } from "../lib/rpc";
export declare class Rpc extends BaseRpc {
    worker: Cluster.Worker;
    root: any;
    constructor(config: any, root: any);
    init(): void;
    setWorker(worker: any): void;
    send(method: any, params: any, socket?: any, cb?: any): void;
}
