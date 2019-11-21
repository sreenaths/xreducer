import { createReducer } from '../../index';
import { createStore } from 'redux';

import initialStateObj from './data/users';

describe('Unit Test : State as Primitive data type', () => {

  test('By handling increment & decrement actions without payload', () => {
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
  
  test('By handling increment, decrement, & set actions with payload', () => {
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
  
});

describe('Unit Test : State as an object', () => {

  test('By handling actions with payload', () => {

    const reducerHandlers = {
      addUser: (state, payload) => {
        return {
          ...state,
          users: [...state.users, payload],
          maxAge: Math.max(state.maxAge, payload.age),
        };
      },
    };
  
    let reducer = createReducer(reducerHandlers, initialStateObj);
    let store = createStore(reducer);
    let actions = reducer.getActions(store.dispatch);
  
    let subscriptionCalls = 0;
    store.subscribe(() => subscriptionCalls++);
  
    actions.addUser({
      name: "Kesav",
      age: 85,
      code: "COH",
    });
  
    expect(store.getState()).not.toBe(initialStateObj);
    expect(store.getState().users.length).toBe(4);
    expect(store.getState().users[3].name).toBe("Kesav");
    expect(store.getState().maxAge).toBe(85);
    expect(store.getState().cities).toBe(initialStateObj.cities);
  
    actions.addUser({
      name: "Sid",
      age: 28,
      code: "SFO",
    });
  
    expect(store.getState()).not.toBe(initialStateObj);
    expect(store.getState().users.length).toBe(5);
    expect(store.getState().users[4].name).toBe("Sid");
    expect(store.getState().maxAge).toBe(85);
    expect(store.getState().cities).toBe(initialStateObj.cities);
  
  });

});
