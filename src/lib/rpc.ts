import * as node_cluster from "cluster"
import * as latte_lib from "latte_lib"
export class BaseRpc extends latte_lib.events {
  methods: any = {};
  id: number = 0;
  config: any;
  constructor(config) {
    super();
    this.config = config;
  }
  setMethod(method, func) {
    this.methods[method] = func;
  }
  backData(err, result, id) {
    return {
      error: err,
      result: result,
      id: id
    };
  }
  sendWorker(worker: any, method, params, socket, cb) {
    let id = ++this.id;
    if (latte_lib.utils.isFunction(socket)) {
      cb = socket;
      socket = null;
    }
    worker.send({
      method: method,
      params: params,
      id: id
    }, socket);
    cb && this.once(id.toString(), function (err, data) {
      cb(err, data);
    });
  }
  initWorker(worker: node_cluster.Worker): any {
    worker['rpc'] = this;
    return worker.process.on("message", (data, socket: any) => {

      if (socket) {
        socket.readable = socket.writeable = true;
        socket.resume();
      }
      if (data.method) {
        var method = this.methods[data.method];
        if (method) {
          if (!latte_lib.utils.isArray(data.params)) {
            data.params = [].concat(data.params);
          }
          socket && data.params.push(socket);
          data.params.push((err, result, s) => {
            worker.send(this.backData(err, result, data.id), s);
          });
          try {
            method.apply(worker, data.params);
          } catch (e) {
            this.emit("error", e);
          }

        } else if (data.id) {
          this.emit(data.id, data.error, data.result, socket);
        }
      } else if (data.id) {

        this.emit(data.id, data.error, data.result, socket);
      }
    })
  }

}