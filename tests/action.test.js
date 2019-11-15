import { createReducer, action } from '../index';
import { createStore, applyMiddleware } from 'redux';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Action with custom type name : With payload', () => {
  let customType;
  let reducer = createReducer({
    inc: action((state, payload) => state + payload, "CUSTOM_INC"),
    dec: action((state, payload) => state - payload, "CUSTOM_DEC"),
    set: action((state, payload) => payload, "CUSTOM_SET"),
  });

  let middleManCalls = 0;
  function middleMan({ getState }) {
    return next => action => {
      middleManCalls++;
      expect(action.type).toBe(customType);
      const returnValue = next(action)
      return returnValue
    }
  }

  let store = createStore(reducer, applyMiddleware(middleMan));
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  customType = "CUSTOM_SET";
  actions.set(5);

  customType = "CUSTOM_INC";
  actions.inc(2);
  expect(store.getState()).toBe(7);
  actions.inc(1);
  expect(store.getState()).toBe(8);

  customType = "CUSTOM_DEC";
  actions.dec(2);
  expect(store.getState()).toBe(6);
  actions.dec(2);
  actions.dec(1);
  expect(store.getState()).toBe(3);

  expect(middleManCalls).toBe(6);
  expect(subscriptionCalls).toBe(6);
});

//-- Negative tests ---------------------------------------------------------------------

test('Negative tests: Calling action from inside handler', () => {
  let actions;
  let reducer = createReducer({
    simpleHandler: (s, p) => p,
    handlerCallingHandler: function(s, p){ return this.simpleHandler(s, p); },

    actionHandler: action((s, p) => p),
    handlerCallingActionHandler: function(s, p){ return this.actionHandler(s, p); },

    handlerCallingGlobalAction: () => actions.simpleHandler(),
  }, 0);
  let store = createStore(reducer);
  actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.handlerCallingHandler(6);
  expect(store.getState()).toBe(6);

  actions.actionHandler(11);
  expect(store.getState()).toBe(11);

  actions.handlerCallingActionHandler(16);
  expect(store.getState()).toBe(16);

  expect(() => {
    actions.handlerCallingGlobalAction();
  }).toThrow("Reducers may not dispatch actions.");

  expect(subscriptionCalls).toBe(3);
});
