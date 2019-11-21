import { createReducer } from '../../index';
import { createStore } from 'redux';

describe('Unit Test : handlers', () => {

  test('Composition of different handler objects', () => {
    let handlersBC = {
      inc: (state, payload) => {
        return {
          ...state,
          valB: state.valB + payload.valB,
          valC: state.valC + payload.valC,
        };
      },
    };
  
    let handlersA = {
      inc: (state, payload) => {
        return {
          ...state,
          valA: state.valA + payload.valA,
          valBC: handlersBC.inc(state.valBC, payload),
        };
      },
    };
  
    let reducer = createReducer(handlersA, {
      valA: 1,
      valBC: {
        valB: 100,
        valC: 1000
      }
    });
  
    let store = createStore(reducer);
    let actions = reducer.getActions(store.dispatch);
  
    let subscriptionCalls = 0;
    store.subscribe(() => subscriptionCalls++);
  
    expect(store.getState().valA).toBe(1);
    expect(store.getState().valBC.valB).toBe(100);
    expect(store.getState().valBC.valC).toBe(1000);
  
    actions.inc({
      valA: 1,
      valB: 100,
      valC: 1000
    });
    expect(store.getState().valA).toBe(2);
    expect(store.getState().valBC.valB).toBe(200);
    expect(store.getState().valBC.valC).toBe(2000);
  
    expect(subscriptionCalls).toBe(1);
  });

  test('Calling a handler from inside another!', () => {
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

});

