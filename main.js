import update from './modules/dom.js'
import makeObservable from './modules/poxy.js';

const counter = {
  up (name) { 
    this[name] ? this[name]++ : this[name] = 1
   }
}

function readableNumbers (number, decimator = ',') {
  const splitArr = number.toString().split('').reverse();
  let strArr = [];

  for (let [index, value] of Object.entries(splitArr)) {
    strArr.push(value)
    const control = (index + 1) % 3

    if (!control && (parseInt(index) + 1) < splitArr.length) {
      strArr.push(decimator)
    }
  }

  return strArr.reverse().join('')
}

const html = `
  <h1>Observable JS-Proxies</h1>
  <p>Creating 1,000,000 observable objects with an observable object as a property! After this execute multiple observe actions.</p>
  <pre>
for (let i = 0; i < 1e6; i++) {
  const obj = {a: {b: i}}
  const observable = makeObservable(obj)
  observable.a.observe('b', () => counter.up('b'))
  observable.observe('a', () => counter.up('a'))
  observable.a.b = i + 1;
  observable.a = i + 1;
}  
  </pre>

  <h2>Execution results</h2>
  <dl>
    <dt>Created observables <span class="bold" data-name="a"></span>!</dt>
    <dt>Triggerd observer on <span class="bold">'a'</span> for <span class="bold"><span data-name="a"></span> times</span>!</dt>
    <dt>Triggerd observer on <span class="bold">'a.b'</span> for <span class="bold"><span data-name="b"></span> times</span>!</dt>
    <dt>Complete execution time <span class="bold"><span data-name="time"></span> ms</span>!</dt>
  </dl>
`;

update('app', html)

const instances = 1e3
const startTime = Date.now()

for (let i = 0; i < instances; i++) {
  const obj = {a: {b: i}}
  const observable = makeObservable(obj)
  observable.a.observe('b', () => counter.up('b'))
  observable.observe('a', () => counter.up('a'))
  observable.a.b = i + 1;
  observable.a = i + 1;
}

const endTime = Date.now()
const timeSpent = endTime - startTime

update('instances', readableNumbers(parseInt(instances)))
update('a', readableNumbers(counter.a))
update('b', readableNumbers(counter.b))
update('time', readableNumbers(timeSpent))