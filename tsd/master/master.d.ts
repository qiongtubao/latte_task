import * as latte_lib from "latte_lib";
export declare enum Status {
    READY = 0,
    LOCK = 1,
    CLOSE = 2,
}
export interface Runer {
    getTasks: (size: number, callback: Function) => {};
    deleteTasks: (data: any[], callback: Function) => {};
    count: (task: any, result: any) => {};
}
export declare class Master extends latte_lib.events {
    config: any;
    data: Runer;
    idleTasks: any[];
    runingTasks: any[];
    loadStatus: Status;
    saveStatus: Status;
    constructor(config: any, data: Runer);
    load(): void;
    addTask(): void;
    getTask(): any;
    rollbackTask(): void;
    save(callback?: any): void;
    finishTask(task: any, result: any): void;
    static create(config: any): Master;
}
