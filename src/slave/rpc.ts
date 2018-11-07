import * as Cluster from "cluster"
import { BaseRpc } from "../lib/rpc";
export class Rpc extends BaseRpc {
  worker: Cluster.Worker;
  root: any
  constructor(config, root) {
    super(config);
    this.setWorker(Cluster.worker);
    this.root = root;
    this.init();
  }
  init() {

  }
  setWorker(worker) {
    this.initWorker(worker);
    this.worker = worker;
  }
  send(method, params, socket?, cb?) {
    this.sendWorker(this.worker.process, method, params, socket, cb);
  }

}