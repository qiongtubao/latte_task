import * as node_cluster from "cluster"
import { BaseRpc } from "../lib/rpc";
import * as latte_lib from "latte_lib"
export class Rpc extends BaseRpc {
  workers: node_cluster.Worker[] = [];
  idleWorkers: node_cluster.Worker[] = [];
  constructor(config: any) {
    super(config);
    this.init();
  }
  init() {
    let self = this;
    this.setMethod("startRunTask", function (calback) {
      self.idleWorkers.push(this);
      self.emit('idle');
    });
  }
  addWorker(worker: node_cluster.Worker) {
    super.initWorker(worker);
    this.workers[worker.id] = worker;
    worker['rpc'] = this;
  }
  removeWorker(worker) {
    if (worker.id != null) {
      this.workers[worker.id] = null;
    }
  }
  sendTask(task, callback) {
    if (this.idleWorkers.length == 0) {
      return false;
    }
    let worker = this.idleWorkers.shift();
    this.send(worker, "execTask", [task], null, function (err, result) {
      this.idleWorkers.push(worker);
      callback(err, result);
    });
    return true;
  }
  send(worker: node_cluster.Worker, method, params, socket, cb) {
    var self = this;
    if (latte_lib.utils.isFunction(socket)) {
      cb = socket;
      socket = null;
    }
    worker.send({
      method: method,
      params: params,
      id: ++this.id
    }, socket);
    if (cb) {
      this.once(this.id.toString(), cb);
    }
  }
}