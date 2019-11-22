import React from 'react';

import { Provider } from 'react-redux'
import store from '../store'

import Counter from './counter';

function App() {
  return (
    <Provider store={store}>
      <header>xReducer <small>Dummy App</small></header>
      <article>
        <Counter />
      </article>
    </Provider>
  );
}

export default App;
