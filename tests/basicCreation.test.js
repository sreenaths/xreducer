import { createReducer } from '../index';
import { createStore } from 'redux';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Basic creation', () => {
  let reducer = createReducer({
    handlerA: function (){return true},
    handlerB: function (){return this.handlerA()},
  }, null);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(actions).toBeTruthy();
  expect(actions.handlerA).toBeTruthy();
  expect(actions.handlerB).toBeTruthy();
  expect(store.getState()).toBe(null);

  actions.handlerB()
  expect(store.getState()).toBeTruthy();
});