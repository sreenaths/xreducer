# xReducer [![npm version](https://badge.fury.io/js/xreducer.svg)](https://badge.fury.io/js/xreducer)

Create Redux reducers without switch statements or action objects. Less boilerplate, more fun!

xReducer is just a syntactic sugar, and have literally zero hard dependencies, not even Redux! So you can right away use it in your Redux project alongside existing reducers.

## How To Install
```js
npm install --save xreducer
```
or
```js
yarn add xreducer
```
## Why Do I Need This?
Redux is an awesome library for managing application state. But the most common complaint about Redux is how it makes you write a lot of boilerplate - Action objects, action creators, switch statements... other repeating code while connecting the store to your UI components.

What if we could avoid some of these and create reducers from a set of functions!?

## Usage
```js
import { createReducer } from 'xreducer';
import { createStore } from 'redux';

let counterReducer = createReducer({
  inc: state => state + 1
}, 0);
let store = createStore(counterReducer);
let actions = reducer.getActions(store.dispatch);

store.getState(); // 0
actions.inc();
store.getState(); // 1
```
This is how you implement an incremental counter using xReducer. Notice that createStore is the same function from Redux.

### Usage with React
```js
// reducers/counterReducer.js
import { createReducer } from 'xreducer';

export default createReducer({
  inc: state => state + 1
}, 0);
```

```js
// components/counter.js
class Counter extends React.Component {
  render() {
    // ...
  }
}

export default connect(
  state => {
    return {count: state};
  },
  reducer.getActions
)(Counter);
```
### More Information On Usage
I am trying my best to improve the documentation. But until then, the UTs must give you a sound idea about xReducer APIs and supported features.

**We have UTs for reducer composition, Immer support, persisting data using localStorage, debouncing actions, thunk support etc.**

## License

This project is licensed under the MIT license. See the LICENSE file for more info.


<!--
- Installation
- Basic
  - Explain - Handler, Action, Thunk
- Consume state & getActions
- combined reducer
- Using Immutable Helpers
  - Using Immer
  - Using Immutability Helper
- Custom type
- thunks
- Handlers object is frozen
- Perf analysis

- Will will do the dispatching for you
-->
