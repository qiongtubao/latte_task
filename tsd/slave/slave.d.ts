import { Rpc } from "./rpc";
export declare class Slave {
    config: any;
    data: any;
    rpc: Rpc;
    constructor(config: any, data: any, rpc: any);
    init(): void;
    static create(config: any, rpc: any): Slave;
}
