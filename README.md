#aww

_Async Iterables Interfaces for Web Workers_

This is a proof of concept library that enables async iteration with web workers. Errors handling is not yet supported.

```sh
npm i -S aww
```

## How to iterate over the invoker's incoming data (from the worker perspective)

### worker.js
```js
import { AISource } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    // will handle onmessage events and other stuff
    // it's an async iterable
    const source = new AISource();

    for await(const msg of source) {
      console.log(`${msg.data} received inside worker`);
      await delay(2000, msg); // fake long task

      // next messages from the main will be handled by the async iteration
      // no sense making this awaitable
      source.reply("It's all good from worker!");
    }

})();
```

### main.js
```js
import { AIWorker } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    const myWorker = new AIWorker(new Worker('./worker.js'));

    let i = 0;
    while(true) {
        await delay(1000);

        // you can await the response from the worker, but it is not mandatory
        await myWorker.postMessage(i++).then(({data}) => console.log(data));

        /*
          alternative syntax
          const { data } = await myWorker.postMessage(i++);
          console.log(data);
        */
       }

})();
```

<img src="https://s3.gifyu.com/images/ezgif-5-479e2f28a99e.gif" width="700"/>
&nbsp;

## How to iterate over the worker's incoming data (from the invoker perspective)

### main.js
```js
import { AIWorker } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    const myWorker = new AIWorker(new Worker('./worker.js'));

    // will handle onmessage events and other stuff
    // it's an async iterable
    for await(const msg of myWorker) {
      console.log(`${msg.data} received inside main`);
      await delay(2000, msg); // fake long task

      // next messages from the main will be handled by the async iteration
      // no sense making this awaitable
      myWorker.reply("It's all good from main!");
    }

})();
```

### worker.js
```js
import { AISource } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    const source = new AISource();

    let i = 0;
    while(true) {
        await delay(1000);

        // you can await the response from the main, but it is not mandatory
        await source.postMessage(i++).then(({data}) => console.log(data));

        /*
          alternative syntax
          const { data } = await source.postMessage(i++);
          console.log(data);
        */
    }

})();
```

<img src="https://s3.gifyu.com/images/ezgif-5-1427410b906b.gif" width="700"/>
&nbsp;

## How to iterate over both at the same time

### main.js
```js
import { AIWorker } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    const myWorker = new AIWorker(new Worker('./worker.js'));

    // start the iteration posting a message
    // because both the main and the worker are waiting to start the iteration
    // not awaitable because the subsequent async iteration will handle worker's messages
    myWorker.reply("Please start!");

    for await(const msg of myWorker) {
      console.log(`${msg.data} received inside main`);
      await delay(1000, msg); // fake long task

      // next messages from the main will be handled by the async iteration
      // no sense making this awaitable
      myWorker.reply("It's all good from main!");
    }

})();
```

### worker.js
```js
import { AISource } from 'aww';

const delay = (ms, v) => new Promise(res => setTimeout(res, ms, v));

;(async () => {

    const source = new AISource();

    for await(const msg of source) {
      console.log(`${msg.data} received inside worker`);
      await delay(2000, msg); // fake long task

      // next messages from the main will be handled by the async iteration
      // no sense making this awaitable
      source.reply("It's all good from worker!");
    }

})();
```

<img src="https://s3.gifyu.com/images/ezgif-5-0379c381b6ed.gif" width="700"/>
