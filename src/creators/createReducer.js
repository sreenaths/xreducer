import isFunction from '../helpers/isFunction';
import assert from '../helpers/assert';

import createStateAction from './createStateAction';

function createReducer(actions, initialState, {reducerName, onStateChange} = {}) {
  const TAG = {};

  let currentReducerState;
  const getReducerState = () => currentReducerState;

  initialState = initialState || null;
  actions = normalizeActions(actions);
  onStateChange = normalizeOnStateChange(onStateChange);

  const handlers = getHandlers(actions);

  // TAG Check: To execute current handler only if it was dispatched from the related dispatcher
  function reducer(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = onStateChange(state, actionObj.payload, function(state, payload) {
        return handlers[actionObj.name](state, payload);
      });
    }
    currentReducerState = state;
    return state;
  };

  reducer.getActions = createActionsGetter(actions, {
    reducerName,
    getReducerState,
    tag: TAG,
    handlers,
  });

  Object.freeze(reducer);
  return reducer;
}

function defaultOnHandle(state, payload, handler) {
  return handler(state, payload);
}

function normalizeOnStateChange(onStateChange) {
  if(onStateChange) {
    assert(isFunction(onStateChange), "onStateChange passed is not a function!");
  } else {
    onStateChange = defaultOnHandle;
  }
  return onStateChange;
}

function normalizeActions(actions) {
  assert(actions && Object.keys(actions).length !== 0, "Reducer creation failed. No functions found!");
  Object.freeze(actions);

  var normalized = {};
  Object.keys(actions).forEach(name => {
    let action = actions[name];

    if(isFunction(action)) {
      action = createStateAction(action);
    }

    assert(isFunction(action.method) && isFunction(action.handler), `Action ${name} is invalid!`);

    normalized[name] = action;
  });

  Object.freeze(normalized);
  return normalized;
}

function getHandlers(actions) {
  const handlers = {};
  Object.keys(actions).forEach(name => {
    handlers[name] = actions[name].handler;
  });
  Object.freeze(handlers);
  return handlers;
}

function bindActions(actions, dispatch, reducerProps) {
  const boundedActions = {};
  Object.keys(actions).forEach(name => {
    const actionContext = {
      dispatch,
      name,
      reducerProps,

      getActions: () => boundedActions
    };
    boundedActions[name] = actions[name].method.bind(actionContext);
  });
  Object.freeze(boundedActions);
  return boundedActions;
}

function createActionsGetter(actions, reducerProps) {
  const cache = new WeakMap(); // In case multiple stores are in use

  return function(dispatch) {
    if(cache.has(dispatch)) {
      return cache.get(dispatch);
    }

    assert(isFunction(dispatch), "Invalid dispatch function reference!");

    const boundedActions = bindActions(actions, dispatch, reducerProps);
    cache.set(dispatch, boundedActions);
    return boundedActions;
  };
}

export default createReducer;