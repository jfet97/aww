import { AsyncQueue } from "./AsyncQueue";

export class AISource {
  constructor() {

    this.messages = new AsyncQueue();

    self.onmessage = (message) => this.messages.put(message);

  }

  async postMessage(message, transfer) {
    self.postMessage(message, transfer)
    return this.messages.get();
  }

  reply(message, transfer) {
    self.postMessage(message, transfer);
  }

  async *[Symbol.asyncIterator]() {
    while(true) {
      yield this.messages.get();
    }
  }

}
