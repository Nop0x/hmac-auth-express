import hmac from './../src/index.js';
import { PerformanceObserver, PerformanceEntry, PerformanceObserverEntryList, performance } from 'perf_hooks';

type TransformedEntry = {
    operations: number,
    duration: number,
    throughput: string
}

const COUNT: number = 1000000;
const REQUEST: object = {
    headers: {
        authentication: 'HMAC 1573504737300:76251c6323fbf6355f23816a4c2e12edfd10672517104763ab1b10f078277f86'
    },
    method: 'POST',
    originalUrl: '/api/order',
    body: {
        foo: 'bar'
    },
}

function transformObserverEntry(entry: PerformanceEntry): TransformedEntry {
    return {
        operations: COUNT,
        duration: entry.duration,
        throughput: `~${(COUNT / (entry.duration / 1000)).toFixed(0)} ops/second`
    };
}

(function run(): void {
    const observer: PerformanceObserver = new PerformanceObserver((items: PerformanceObserverEntryList): void => console.log(items.getEntries().map((entry) => transformObserverEntry(entry))));
    const middleware = hmac('secret');
    observer.observe({ type: 'measure' });

    performance.mark(`iterations`);
    for (let i = 0; i < COUNT; i++) {
        middleware(REQUEST, undefined, () => {});
    }
    performance.mark(`endIterations`);
    performance.measure('Total', 'iterations', 'endIterations');
})();