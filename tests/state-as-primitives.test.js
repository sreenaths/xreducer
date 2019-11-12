import { createReducer } from '../index';
import { createStore } from 'redux';

//-- Positive tests ---------------------------------------------------------------------
test('Positive tests: Increment & decrement operations tests : Without payload', () => {
  let reducer = createReducer({
    inc: state => state + 1,
    dec: state => state - 1,
  }, 5);
  let store = createStore(reducer);
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlers.inc();
  expect(store.getState()).toBe(6);
  handlers.inc();
  expect(store.getState()).toBe(7);
  handlers.inc();
  expect(store.getState()).toBe(8);
  handlers.dec();
  expect(store.getState()).toBe(7);
  handlers.inc();
  handlers.inc();
  expect(store.getState()).toBe(9);
  handlers.dec();
  handlers.dec();
  handlers.dec();
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
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlers.set(5);
  handlers.inc(2);
  expect(store.getState()).toBe(7);
  handlers.inc(1);
  expect(store.getState()).toBe(8);
  handlers.dec(2);
  expect(store.getState()).toBe(6);
  handlers.dec(2);
  handlers.dec(1);
  expect(store.getState()).toBe(3);
  handlers.dec(-2);
  expect(store.getState()).toBe(5);
  handlers.inc(-2);
  expect(store.getState()).toBe(3);

  handlers.set(0);
  expect(store.getState()).toBe(0);
  handlers.set(undefined);
  handlers.set(undefined);
  expect(store.getState()).toBe(undefined);
  handlers.set(null);
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
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlers.setA("-");
  expect(store.getState()).toBe("state-ABC");

  handlers.setB("_");
  expect(store.getState()).toBe("state-ABC_BC");

  handlers.setC(".");
  expect(store.getState()).toBe("state-ABC_BC.C");

  expect(subscriptionCalls).toBe(3);
});

//-- Negative tests ---------------------------------------------------------------------
test('Negative tests: createReducer call > No handlers', () => {
  const ERROR_REGEX = /No handlers found/;
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
  }).toThrow(/Handler 'propNum' is not a function/);

  expect(() => {
    createReducer({
      fun: () => {},
      propStr: "abc",
    });
  }).toThrow(/Handler 'propStr' is not a function/);

  expect(() => {
    createReducer({
      fun: () => {},
      propObj: {},
    });
  }).toThrow(/Handler 'propObj' is not a function/);
});

test('Negative tests: getHandlers call > Invalid dispatch', () => {
  const ERROR_REGEX = /Invalid dispatch/;
  const DUMMY_DISPATCH = () => {};

  let reducer = createReducer({
    fun: () => {}
  });

  reducer.getHandlers(DUMMY_DISPATCH);

  expect(() => {
    reducer.getHandlers();
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getHandlers(1);
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getHandlers("No dispatch");
  }).toThrow(ERROR_REGEX);

  expect(() => {
    reducer.getHandlers({});
  }).toThrow(ERROR_REGEX);

  reducer.getHandlers(DUMMY_DISPATCH);
});

test('Negative tests: Calling undefined handler', () => {
  let reducer = createReducer({
    fun: () => {}
  });
  let store = createStore(reducer);
  let handlers = reducer.getHandlers(store.dispatch);

  handlers.fun();

  expect(() => {
    handlers.noFun(); // Must throw - TypeError: handlers.noFun is not a function
  }).toThrow(TypeError);
});

test('Negative tests: User trying to mimic a handler', () => {
  const INITIAL_STATE = {};
  let funCalls = 0;

  let reducer = createReducer({
    fun: (state) => {funCalls++; return state;}
  }, INITIAL_STATE);
  let store = createStore(reducer);
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++); // The listener gets called after each dispatch!

  handlers.fun();

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

test('Negative tests: Dispatch from inside reducer', () => {
  let handlers;
  let reducer = createReducer({
    fun: () => {},
    dispFun: () => handlers.dispFun()
  });
  let store = createStore(reducer);
  handlers = reducer.getHandlers(store.dispatch);

  handlers.fun();

  expect(() => {
    handlers.dispFun();
  }).toThrow("Reducers may not dispatch actions.");
});

test('Negative tests: Exception in handler', () => {
  let handlers;
  let reducer = createReducer({
    expFun: state => state.noProp.noProp,
    expNoFun: state => state.noFun(),
    expJSONFun: state => JSON.parse("{ bad json o_O }"),
  }, {});
  let store = createStore(reducer);
  handlers = reducer.getHandlers(store.dispatch);

  expect(() => {
    handlers.expFun();
  }).toThrow("Cannot read property 'noProp' of undefined");

  expect(() => {
    handlers.expNoFun();
  }).toThrow("state.noFun is not a function");

  expect(() => {
    handlers.expJSONFun();
  }).toThrow("Unexpected token b in JSON at position 2");
});

test('Negative tests: Calling handler inside itself!', () => {
  let reducer = createReducer({
    setA: function (state, payload) {return this.setA(state, payload + "A");},
  }, "state");
  let store = createStore(reducer);
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  expect(() => {
    handlers.setA("-"); // Must throw - RangeError: Maximum call stack size exceeded
  }).toThrow(RangeError);

  expect(subscriptionCalls).toBe(0);
});
