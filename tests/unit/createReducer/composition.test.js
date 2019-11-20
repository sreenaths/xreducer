import { createReducer, func } from '../../../index';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunkMiddleware from 'redux-thunk';

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

test('Positive tests: Calling reducer actions from one another', () => {
  let reducerA = createReducer({
    inc: (state, payload) => state + payload,
    incB: func((actions, getReducerState, payload, helpers) => {
      let actionsB = reducerB.getActions(helpers.dispatch);
      actionsB.inc(payload);
    })
  }, 1);
  let reducerB = createReducer({
    inc: (state, payload) => state + payload,
    incA: func((actions, getReducerState, payload, helpers) => {
      let actionsA = reducerA.getActions(helpers.dispatch);
      actionsA.inc(payload);
    })
  }, 1);

  let combinedReducer = combineReducers({
    valA: reducerA,
    valB: reducerB
  });

  let store = createStore(combinedReducer);

  let actionsA = reducerA.getActions(store.dispatch);
  let actionsB = reducerB.getActions(store.dispatch);

  actionsA.incB(2);
  expect(store.getState().valA).toBe(1);
  expect(store.getState().valB).toBe(3);

  actionsB.incA(2);
  expect(store.getState().valA).toBe(3);
  expect(store.getState().valB).toBe(3);
});

test('Positive tests: combineReducers with a xReducers and a normal reducer', () => {
  let xReducer = createReducer({
    inc: (state, payload) => state + payload,
    dispToNormal: func((actions, getReducerState, payload, helpers) => helpers.dispatch({type: "INC", payload}))
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

  let store = createStore(combinedReducer, applyMiddleware(ReduxThunkMiddleware));
  let actions = xReducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  // Call xReducer action
  actions.inc(1);
  expect(store.getState().valX).toBe(2);
  expect(store.getState().valN).toBe(100);

  actions.inc(2);
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(100);

  // Call normal redux dispatch
  store.dispatch(action(7));
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(107);

  store.dispatch(action(2));
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(109);

  // Call normal redux dispatch from a xReducer action
  actions.dispToNormal(2);
  expect(store.getState().valX).toBe(4);
  expect(store.getState().valN).toBe(111);

  // Call xReducer action from a redux thunk dispatch
  store.dispatch(function (dispatch) {
    let actions = xReducer.getActions(dispatch);
    actions.inc(2);
  });
  expect(store.getState().valX).toBe(6);
  expect(store.getState().valN).toBe(111);

  expect(subscriptionCalls).toBe(6);
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