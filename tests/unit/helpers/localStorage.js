import { createReducer, action } from '../../../index';

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
  // Can use debounce/throttle function to improve performance
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (err) {
    // Ignore
  }
}

function createStorageReducer(){
  const initialState = loadState() || {
    count: 0,
  };

  function onStateChange(state, payload, handler) {
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
  }, initialState, {onStateChange});

  return reducer;
}

function getStorageState() {
  return JSON.parse(localStorage.__STORE__.state);
}

export {
  createStorageReducer,
  getStorageState
};