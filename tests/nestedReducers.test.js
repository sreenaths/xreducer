import { createReducer } from '../index';
import { createStore } from 'redux';
import { combineReducers } from 'redux'

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: combineReducers with 2 xReducers', () => {
  let handlers = {
    inc: (state, payload) => state + payload,
    dec: (state, payload) => state - payload,
  };

  let reducerA = createReducer(handlers, 1);
  let reducerB = createReducer(handlers, 100);

  let combinedReducer = combineReducers({
    valA: reducerA,
    valB: reducerB
  });

  let store = createStore(combinedReducer);

  let actionsA = reducerA.getActions(store.dispatch);
  let actionsB = reducerB.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actionsA.inc(1);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valB).toBe(100);

  actionsA.inc(2);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(100);

  actionsB.inc(7);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(107);

  actionsB.inc(2);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(109);

  actionsA.dec(1);
  expect(store.getState().valA).toBe(3);
  expect(store.getState().valB).toBe(109);

  actionsB.dec(5);
  expect(store.getState().valA).toBe(3);
  expect(store.getState().valB).toBe(104);

  expect(subscriptionCalls).toBe(6);
});

test('Positive tests: combineReducers with a xReducers and a normal reducer', () => {
  let xReducer = createReducer({
    inc: (state, payload) => state + payload,
  }, 1);

  const normalReducer = function (state = 100, action) {
    switch(action.type) {
      case "INC":
        return state + action.payload;
      break;
      default:
        return state;
    }
  }
  const action = function (payload) {
    return {
      type: "INC",
      payload
    };
  }

  let combinedReducer = combineReducers({
    valX: xReducer,
    valN: normalReducer
  });

  let store = createStore(combinedReducer);
  let actions = xReducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.inc(1);
  expect(store.getState().valX).toBe(2);
  expect(store.getState().valN).toBe(100);

  actions.inc(2);
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(100);

  store.dispatch(action(7));
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(107);

  store.dispatch(action(2));
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(109);

  expect(subscriptionCalls).toBe(4);
});

test('Positive tests: combineReducers with nested xReducers', () => {
  let handlers = {
    inc: (state, payload) => state + payload,
  };

  let reducerA = createReducer(handlers, 1);
  let reducerB = createReducer(handlers, 100);
  let reducerC = createReducer(handlers, 1000);

  let combinedReducer = combineReducers({
    valA: reducerA,
    valBC: combineReducers({
      valB: reducerB,
      valC: reducerC,
    })
  });

  let store = createStore(combinedReducer);

  let actionsA = reducerA.getActions(store.dispatch);
  let actionsB = reducerB.getActions(store.dispatch);
  let actionsC = reducerC.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  expect(store.getState().valA).toBe(1);
  expect(store.getState().valBC.valB).toBe(100);
  expect(store.getState().valBC.valC).toBe(1000);

  actionsA.inc(1);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(100);
  expect(store.getState().valBC.valC).toBe(1000);

  actionsB.inc(100);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(200);
  expect(store.getState().valBC.valC).toBe(1000);

  actionsC.inc(1000);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(200);
  expect(store.getState().valBC.valC).toBe(2000);

  expect(subscriptionCalls).toBe(3);
});

test('Positive tests: nesting with handlers!', () => {
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