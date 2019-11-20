import { createReducer } from '../../../index';
import { createStore } from 'redux';

test('Positive tests: Composition using handlers!', () => {
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