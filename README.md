# xReducer [![npm version](https://badge.fury.io/js/xreducer.svg)](https://badge.fury.io/js/xreducer)

**Create Redux Reducers** without switch statements or action objects. In short less boilerplate, more fun!

## How To Install
```js
yarn add xreducer
```
xReducer is just a set of javascript functions, and have literally zero hard dependencies! So you can right away use it in any Redux project along with existing reducers.

## Why Do I Need This?
Redux is an awesome library, but it makes us write a lot of boilerplate - Action objects, action creators, switch statements..., and other repeating code while connecting the UI components to a Store.

What if we could avoid some of them, and create reducers from a set of simple functions / handlers / actions!?

## Using With ReactJs
**1. Reducer:** Calling createReducer with a map of action handlers, and the initial state; would return a reducer function. You can then use this function with Redux like a conventional reducer.
```js
// Reducer
import { createReducer } from 'xreducer';

const initialState = {
  count: 1
};

const reducer = createReducer({
  inc: state => ({ count: state.count + 1 }),
  dec: state => ({ count: state.count - 1 })
}, initialState);

export default reducer;
```
**2. Connect Component:** Use **reducer.getActions** in place of mapDispatchToProps while connecting, and all the actions will be available under props!
```js
// React Component
import React from 'react';
import { connect } from 'react-redux';
import reducer from './reducer';

class Counter extends React.Component {
  render() {
    return <p>
      {this.props.count}
      <button onClick={this.props.inc}>Inc</button>
    </p>
  }
}

export default connect(state => state, reducer.getActions)(Counter);
```
Thats it. Isn't that simple!? :sunglasses:

## Action Types
xReducer supports 3 types of action handlers. Default is action().

1. [action((state, payload) => {}, options)](https://github.com/sreenaths/xreducer/blob/master/tests/unit/action.test.js) - Executes inside the reducer and manages state.
2. [func((actions, getReducerState, payload, helpers) => {}, options)](https://github.com/sreenaths/xreducer/blob/master/tests/unit/func.test.js) - Executes outside, for side effects logic without dispatch.
3. [reduxThunk((actions, getState, payload, helpers) => {}, options)](https://github.com/sreenaths/xreducer/blob/master/tests/unit/reduxThunk.test.js) - For side effects logic with dispatch **(redux-thunk)**.

## Feature Support
I am trying my best to improve the documentation. But until then, the UTs must give you a sound idea about xReducer APIs and supported features.

Unit Tests for some interesting features:
1. [Reducer composition](https://github.com/sreenaths/xreducer/blob/master/tests/unit/createReducer/reducerComposition.test.js)
2. [Immer support](https://github.com/sreenaths/xreducer/blob/master/tests/unit/createReducer/onStateChange.test.js#L12)
3. [Persisting data using localStorage](https://github.com/sreenaths/xreducer/blob/master/tests/unit/createReducer/onStateChange.test.js#L106)
4. [Debouncing actions](https://github.com/sreenaths/xreducer/blob/master/tests/unit/action.test.js#L50)
5. [Thunk support](https://github.com/sreenaths/xreducer/blob/master/tests/unit/reduxThunk.test.js)

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
