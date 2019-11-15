import { createReducer, reduxThunk } from '../index';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunkMiddleware from 'redux-thunk';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Basic redux-thunk test', (done) => {
  let reducer = createReducer({
    thunkFun: reduxThunk((actions, getState) => {
      expect(getState()).toBe(12);
      done();
    })
  }, 12);
  let store = createStore(reducer, applyMiddleware(ReduxThunkMiddleware));
  let actions = reducer.getActions(store.dispatch);

  expect.assertions(1);
  actions.thunkFun();
});