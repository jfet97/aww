export class AsyncQueue {
  constructor(...values) {

    this.promise = new Promise(resolve  => {
      this.resolve = resolve;
    });

    values.forEach(v => this.put(v));
  }

  put(value) {
    // advance the tail

    let resolveNext = null;
    const nextPromise = new Promise(resolve => {
      resolveNext = resolve;
    });

    this.resolve({
      value,
      nextPromise,
    });

    this.resolve = resolveNext;
  }

  async get() {
    // advance the head

    const resultingPromise = this.promise.then(({ value }) => value);
    this.promise = this.promise.then(({ nextPromise }) => nextPromise);

    return resultingPromise;
  }
}
