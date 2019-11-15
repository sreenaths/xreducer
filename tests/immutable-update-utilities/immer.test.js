import { createReducer } from '../../index';
import { createStore } from 'redux';
import produce from "immer";

import initialStateObj from '../data/users';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Updating an object state with immer', () => {

  const reducerHandlers = {
    addUser: (state, payload) => {
      state.users.push(payload);
      state.maxAge = Math.max(state.maxAge, payload.age);
    },
  };

  const beforeHandle = function (state, payload, handler) {
    return produce(state, draftState => {
      handler(draftState, payload);
    });
  };

  let reducer = createReducer(reducerHandlers, initialStateObj, {beforeHandle});
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