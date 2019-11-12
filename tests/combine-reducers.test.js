import { createReducer } from '../index';
import { createStore } from 'redux';
import { combineReducers } from 'redux'

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

  let handlersA = reducerA.getHandlers(store.dispatch);
  let handlersB = reducerB.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlersA.inc(1);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valB).toBe(100);

  handlersA.inc(2);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(100);

  handlersB.inc(7);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(107);

  handlersB.inc(2);
  expect(store.getState().valA).toBe(4);
  expect(store.getState().valB).toBe(109);

  handlersA.dec(1);
  expect(store.getState().valA).toBe(3);
  expect(store.getState().valB).toBe(109);

  handlersB.dec(5);
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
  let handlers = xReducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  handlers.inc(1);
  expect(store.getState().valX).toBe(2);
  expect(store.getState().valN).toBe(100);

  handlers.inc(2);
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

  let handlersA = reducerA.getHandlers(store.dispatch);
  let handlersB = reducerB.getHandlers(store.dispatch);
  let handlersC = reducerC.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  expect(store.getState().valA).toBe(1);
  expect(store.getState().valBC.valB).toBe(100);
  expect(store.getState().valBC.valC).toBe(1000);

  handlersA.inc(1);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(100);
  expect(store.getState().valBC.valC).toBe(1000);

  handlersB.inc(100);
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(200);
  expect(store.getState().valBC.valC).toBe(1000);

  handlersC.inc(1000);
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

  let handlers = reducer.getHandlers(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  expect(store.getState().valA).toBe(1);
  expect(store.getState().valBC.valB).toBe(100);
  expect(store.getState().valBC.valC).toBe(1000);

  handlers.inc({
    valA: 1,
    valB: 100,
    valC: 1000
  });
  expect(store.getState().valA).toBe(2);
  expect(store.getState().valBC.valB).toBe(200);
  expect(store.getState().valBC.valC).toBe(2000);

  expect(subscriptionCalls).toBe(1);
});