import React from 'react'

import { Provider } from 'react-redux'
import { createStore } from 'redux';
import reducer from './reducer';

import Counter from './counter';

const store = createStore(reducer);

function app() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

export default app;