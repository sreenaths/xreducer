import { createReducer } from '../index';
import { createStore } from 'redux';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Increment & decrement operations tests : Without payload', () => {
  let reducer = createReducer({
    inc: state => state + 1,
    dec: state => state - 1,
  }, 5);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.inc();
  expect(store.getState()).toBe(6);
  actions.inc();
  expect(store.getState()).toBe(7);
  actions.inc();
  expect(store.getState()).toBe(8);
  actions.dec();
  expect(store.getState()).toBe(7);
  actions.inc();
  actions.inc();
  expect(store.getState()).toBe(9);
  actions.dec();
  actions.dec();
  actions.dec();
  expect(store.getState()).toBe(6);

  expect(subscriptionCalls).toBe(9);
});

test('Positive tests: Increment, decrement, & set tests : With payload', () => {
  let reducer = createReducer({
    inc: (state, payload) => state + payload,
    dec: (state, payload) => state - payload,
    set: (state, payload) => payload,
  });
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.set(5);
  actions.inc(2);
  expect(store.getState()).toBe(7);
  actions.inc(1);
  expect(store.getState()).toBe(8);
  actions.dec(2);
  expect(store.getState()).toBe(6);
  actions.dec(2);
  actions.dec(1);
  expect(store.getState()).toBe(3);
  actions.dec(-2);
  expect(store.getState()).toBe(5);
  actions.inc(-2);
  expect(store.getState()).toBe(3);

  actions.set(0);
  expect(store.getState()).toBe(0);
  actions.set(undefined);
  actions.set(undefined);
  expect(store.getState()).toBe(undefined);
  actions.set(null);
  expect(store.getState()).toBe(null);

  expect(subscriptionCalls).toBe(12);
});

test('Positive tests: Calling handler inside another!', () => {
  let reducer = createReducer({
    setA: function (state, payload) {return this.setB(state, payload + "A");},
    setB: function (state, payload) {return this.setC(state, payload + "B");},
    setC: function (state, payload) {return state + payload + "C";},
  }, "state");
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.setA("-");
  expect(store.getState()).toBe("state-ABC");

  actions.setB("_");
  expect(store.getState()).toBe("state-ABC_BC");

  actions.setC(".");
  expect(store.getState()).toBe("state-ABC_BC.C");

  expect(subscriptionCalls).toBe(3);
});

//-- Negative tests ---------------------------------------------------------------------

test('Negative tests: createReducer call > No handlers', () => {
  const ERROR_REGEX = /No functions found/;
  expect(() => {
    createReducer();
  }).toThrow(ERROR_REGEX);
  expect(() => {
    createReducer({});
  }).toThrow(ERROR_REGEX);
});

test('Negative tests: createReducer call > Invalid handlers', () => {
  expect(() => {
    createReducer({
      propNum: 1
    });
  }).toThrow(/propNum is not a function/);

  expect(() => {
    createReducer({
      fun: () => {},
      propStr: "abc",
    });
  }).toThrow(/propStr is not a function/);

  expect(() => {
    createReducer({
      fun: () => {},
      propObj: {},
    });
  }).toThrow(/propObj is not a function/);
});

test('Negative tests: getActions call > Invalid dispatch function reference', () => {
  const ERROR_REGEX = /Invalid dispatch function reference/;
  const DUMMY_DISPATCH = () => {};

  let reducer = createReducer({
    fun: () => {}
  });

  reducer.getActions(DUMMY_DISPATCH);

  expect(() => {
    reducer.getActions();
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getActions(1);
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getActions("No dispatch");
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getActions({});
  }).toThrow(ERROR_REGEX);

  reducer.getActions(DUMMY_DISPATCH);
});

test('Negative tests: Calling non-existing action/handler', () => {
  let reducer = createReducer({
    fun: () => {}
  });
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  actions.fun();

  expect(() => {
    actions.noFun(); // Must throw - TypeError: actions.noFun is not a function
  }).toThrow(TypeError);
});

test('Negative tests: User trying to mimic an action dispatch', () => {
  const INITIAL_STATE = {};
  let funCalls = 0;

  let reducer = createReducer({
    fun: (state) => {funCalls++; return state;}
  }, INITIAL_STATE);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++); // The listener gets called after each dispatch!

  actions.fun();

  store.dispatch({
    type: "handlerName"
  });

  store.dispatch({
    type: "handlerName",
    payload: 1,
    tag: {},
    handler: () => subscriptionCalls++
  });

  expect(store.getState()).toBe(INITIAL_STATE); // Nothing changed
  expect(funCalls).toBe(1);
  expect(subscriptionCalls).toBe(3);
});

test('Negative tests: Exception in handler', () => {
  let actions;
  let reducer = createReducer({
    expFun: state => state.noProp.noProp,
    expNoFun: state => state.noFun(),
    expJSONFun: state => JSON.parse("{ bad json o_O }"),
  }, {});
  let store = createStore(reducer);
  actions = reducer.getActions(store.dispatch);

  expect(() => {
    actions.expFun();
  }).toThrow("Cannot read property 'noProp' of undefined");

  expect(() => {
    actions.expNoFun();
  }).toThrow("state.noFun is not a function");

  expect(() => {
    actions.expJSONFun();
  }).toThrow("Unexpected token b in JSON at position 2");
});

test('Negative tests: Calling handler inside itself!', () => {
  let reducer = createReducer({
    setA: function (state, payload) {return this.setA(state, payload + "A");},
  }, "state");
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  expect(() => {
    actions.setA("-"); // Must throw - RangeError: Maximum call stack size exceeded
  }).toThrow(RangeError);

  expect(subscriptionCalls).toBe(0);
});
