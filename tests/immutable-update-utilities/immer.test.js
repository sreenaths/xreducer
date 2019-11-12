import { createReducer } from '../../index';
import { createStore } from 'redux';
import produce from "immer";

import initialStateObj from '../data/users';

test('Positive tests: Updating an object state with immer', () => {

  const reducerHandlers = {
    addUser: (state, payload) => {
      state.users.push(payload);
      state.maxAge = Math.max(state.maxAge, payload.age);
    },
  };

  let reducer = createReducer(reducerHandlers, initialStateObj, function (state, payload, handler) {
    return produce(state, draftState => {
      handler(draftState, payload);
    });
  });
  let store = createStore(reducer);
  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlers.addUser({
    name: "Kesav",
    age: 85,
    code: "COH",
  });

  expect(store.getState()).not.toBe(initialStateObj);
  expect(store.getState().users.length).toBe(4);
  expect(store.getState().users[3].name).toBe("Kesav");
  expect(store.getState().maxAge).toBe(85);
  expect(store.getState().cities).toBe(initialStateObj.cities);

  handlers.addUser({
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