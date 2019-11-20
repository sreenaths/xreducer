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

test('Positive tests: Debounce func with payload', (done) => {
  let reducer = createReducer({
    inc: (state, payload) => state + payload,
    act: reduxThunk((actions, getState, payload) => actions.inc(payload), {debounceWait: 100})
  }, 1);

  let middleManCalls = 0;
  function middleMan({ getState }) {
    return next => action => {
      middleManCalls++;
      return next(action)
    }
  }

  let store = createStore(reducer, applyMiddleware(ReduxThunkMiddleware, middleMan));
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.act(1);
  actions.act(2);
  actions.act(3);
  actions.act(4); // << Only this must get called

  setTimeout(() => {
    expect(middleManCalls).toBe(1);
    expect(subscriptionCalls).toBe(1);

    expect(store.getState()).toBe(1 + 4);

    done();
  }, 200);
});