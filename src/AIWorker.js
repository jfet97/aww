import { AsyncQueue } from "./AsyncQueue";


export class AIWorker {
  constructor(worker) {
    this.worker = worker;
    this.messages = new AsyncQueue();

    this.worker.onmessage = (message) => this.messages.put(message);

  }


  async postMessage(message, transfer) {
    this.worker.postMessage(message, transfer);
    return this.messages.get();
  }

  reply(message, transfer) {
    this.worker.postMessage(message, transfer);
  }

  async *[Symbol.asyncIterator]() {
    while(true) {
      yield this.messages.get();
    }
  }

  terminate() {
    this.worker.terminate();
  }

}
