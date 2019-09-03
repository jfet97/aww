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
      value: Promise.resolve(value), // normalize the value
      nextPromise,
    });

    this.resolve = resolveNext;
  }

  get() {
    // advance the head

    const resultingPromise = this.promise.then(({ value }) => value);
    const actualPromise = this.promise;

    // defer next node resolution until the current is solved
    this.promise = resultingPromise.then(() => actualPromise).then(({ nextPromise }) => nextPromise);

    return resultingPromise;
  }

}
