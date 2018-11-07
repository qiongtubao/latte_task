/// <reference types="node" />
import * as node_cluster from "cluster";
import * as latte_lib from "latte_lib";
export declare class BaseRpc extends latte_lib.events {
    methods: any;
    id: number;
    config: any;
    constructor(config: any);
    setMethod(method: any, func: any): void;
    backData(err: any, result: any, id: any): {
        error: any;
        result: any;
        id: any;
    };
    sendWorker(worker: any, method: any, params: any, socket: any, cb: any): void;
    initWorker(worker: node_cluster.Worker): any;
}
