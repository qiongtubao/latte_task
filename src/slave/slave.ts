import { Rpc } from "./rpc"
import * as Path from "path"
export class Slave {
  config: any;
  data: any;
  rpc: Rpc;
  constructor(config, data, rpc) {
    this.config = config;
    this.data = data;
    this.rpc = rpc;
  }
  init() {

    this.rpc.setMethod("execTask", (task, callback) => {
      this.data.execTask(task, callback);
    });
    this.rpc.send("startRunTask", []);
  }
  static create(config, rpc) {
    if (config.path) {
      let data;
      try {
        data = require(Path.resolve(process.cwd(), config.path))
      } catch (err) {
        return;
      }
      let master = new Slave(config, data, rpc);
      return master;
    }
    return null;
  }
}