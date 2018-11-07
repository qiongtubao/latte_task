import { BaseTask } from "../lib/task";
import { Rpc } from "./rpc";

import { Slave } from "./slave"
export class Task extends BaseTask {
  rpc: Rpc;
  slave: Slave;
  constructor(config) {
    super(config);
    this.rpc = new Rpc(config, this);
    this.slave = Slave.create(config.slave, this.rpc);
  }
  run() {
    this.slave.init();
  }
}