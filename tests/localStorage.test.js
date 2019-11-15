import { createReducer } from '../index';
import { createStore } from 'redux';

//-- Helpers ----------------------------------------------------------------------------

const LS_KEY = "state";
function loadState(){
  try {
    const state = JSON.parse(localStorage.getItem(LS_KEY));
    return state || undefined;
  } catch (err) {
    return undefined;
  }
}
function saveState(state) {
  // Can use libraries like throttle from lodash to improve performance
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore
  }
}

//-- Positive tests ---------------------------------------------------------------------

function getNewReducer(){
  const initialState = loadState() || {
    count: 0,
  };

  function onHandle(state, payload, handler) {
    state = handler(state, payload);
    saveState(state);
    return state;
  }

  let reducer = createReducer({
    inc: (state, payload) => {
      return {
        ...state,
        count: state.count + payload
      };
    },
  }, initialState, {onHandle});

  return reducer;
}

test('Positive tests: Local Storage - Step 1', () => {
  let reducer = getNewReducer();
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(store.getState().count).toBe(0);
  actions.inc(3);
  expect(store.getState().count).toBe(3);
});

test('Positive tests: Local Storage - Step 2', () => {
  let reducer = getNewReducer();
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(store.getState().count).toBe(3);
  actions.inc(1);
  expect(store.getState().count).toBe(4);
});

test('Positive tests: Local Storage - Step 3', () => {
  let reducer = getNewReducer();
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(store.getState().count).toBe(4);
  actions.inc(5);
  expect(store.getState().count).toBe(9);
});

test('Positive tests: Local Storage value check', () => {
  expect(JSON.parse(localStorage.__STORE__.state).count).toBe(9);
})
