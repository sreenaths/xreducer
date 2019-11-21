import { createReducer } from '../../../index';
import { createStore } from 'redux';

import produce from "immer";
import update from 'immutability-helper';
import {createStorageReducer, getStorageState} from "../helpers/localStorage";

import initialStateObj from '../data/users';

describe('Unit Test : onStateChange attribute of createReducer()', () => {

  test('By handling object state change using Immer', () => {

    const reducerHandlers = {
      addUser: (state, payload) => {
        state.users.push(payload);
        state.maxAge = Math.max(state.maxAge, payload.age);
      },
    };
  
    const onStateChange = function (state, payload, handler) {
      return produce(state, draftState => {
        handler(draftState, payload);
      });
    };
  
    let reducer = createReducer(reducerHandlers, initialStateObj, {onStateChange});
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

  test('By handling object state change using immutability-helper', () => {

    const reducerHandlers = {
      addUser: (state, payload) => {
        return {
          users: {$push: [payload]},
          maxAge: {$set: Math.max(state.maxAge, payload.age)}
        };
      },
    };
  
    const onStateChange = function (state, payload, handler) {
      return update(state, handler(state, payload));
    };
  
    let reducer = createReducer(reducerHandlers, initialStateObj, {onStateChange});
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

  describe('By implementing a persistence layer in the reducer using localStorage', () => {

    test('localStorage - Step 1', () => {
      let reducer = createStorageReducer();
      let store = createStore(reducer);
      let actions = reducer.getActions(store.dispatch);
    
      expect(store.getState().count).toBe(0);
      actions.inc(3);
      expect(store.getState().count).toBe(3);
    });
    
    test('localStorage - Step 2', () => {
      let reducer = createStorageReducer();
      let store = createStore(reducer);
      let actions = reducer.getActions(store.dispatch);
    
      expect(store.getState().count).toBe(3);
      actions.inc(1);
      expect(store.getState().count).toBe(4);
    });
    
    test('localStorage - Step 3', () => {
      let reducer = createStorageReducer();
      let store = createStore(reducer);
      let actions = reducer.getActions(store.dispatch);
    
      expect(store.getState().count).toBe(4);
      actions.inc(5);
      expect(store.getState().count).toBe(9);
    });
    
    test('localStorage value check', () => {
      expect(getStorageState().count).toBe(9);
    })

  });

});
