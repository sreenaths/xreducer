import { createReducer } from '../index';
import { createStore } from 'redux';

const ITERATIONS = 1000000;

// -- Helpers ---------------------------------------------
function executor(fun) {
  const start = Date.now();
  const state = fun();
  const duration = Date.now() - start;
  return [state, duration];
}

function printPerf(title, results) {
  const LINE = "─".repeat(60);
  const PADDING = "  ";

  console.log(LINE);
  console.log(PADDING + title);
  console.log(LINE);
  results.forEach(data => console.log(PADDING + data));
  console.log(LINE);
}

// -- Tests -----------------------------------------------
function xReducerPerfTest() {
  let reducer = createReducer({
    inc: state => state + 1,
  }, 0);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  for(var i = 0; i < ITERATIONS; i++) {
    actions.inc(1);
  }
  return store.getState();
}

function normalReducerPerfTest() {
  const reducer = function (state = 0, action) {
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
  let store = createStore(reducer);

  for(var i = 0; i < ITERATIONS; i++) {
    store.dispatch(action(1));
  }
  return store.getState();
}

// -- Execution -------------------------------------------
let [xState, xReducerPerf] = executor(xReducerPerfTest);
let [state, normalReducerPerf] = executor(normalReducerPerfTest);

printPerf("Perf Test : xReducer vs Redux reducer", [
  `xReducer : ${xReducerPerf} milliseconds \t| State: ${xState}`,
  `normal   : ${normalReducerPerf} milliseconds \t| State: ${state}`
]);