import { createReducer } from '../../../index';
import { createStore } from 'redux';

describe('Unit Test : action', () => {

  test('By calling actions in different ways', () => {
    let reducer = createReducer({
      add: (state, payload) => state + payload,
      inc: function(state) { return this.add(state, 1) }
    }, 0);
    let store = createStore(reducer);
    let actions = reducer.getActions(store.dispatch);
  
    // add
    actions.add(2);
    expect(store.getState()).toBe(2);

    const add = actions.add;
    add(2);
    expect(store.getState()).toBe(4);

    add.call(this, -1);
    expect(store.getState()).toBe(3);

    actions.add.apply(window, [-1]);
    expect(store.getState()).toBe(2);

    actions["add"](-2);
    expect(store.getState()).toBe(0);

    // inc
    actions.inc();
    expect(store.getState()).toBe(1);

    const inc = actions.inc;
    inc();
    expect(store.getState()).toBe(2);

    inc.call(this);
    expect(store.getState()).toBe(3);

    actions.inc.apply(window, []);
    expect(store.getState()).toBe(4);

    actions["inc"]();
    expect(store.getState()).toBe(5);

  });

  test('By calling non-existing action', () => {
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

  test('By calling an action with handler that calls itself!', () => {
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

  test('By calling actions that would throw Exception', () => {
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

  test('By trying to mimic an action dispatch', () => {
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

});
