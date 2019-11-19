import { isFunction, assert } from './helpers/utils';
import createActionBuilder from './createActionBuilder';

function createReducer(functions, initialState, {reducerName, onStateChange} = {}) {
  Object.freeze(functions);

  const TAG = {};

  let currentReducerState;
  const getReducerState = () => currentReducerState;

  if(onStateChange) {
    assert(isFunction(onStateChange), "onStateChange passed is not a function!");
  } else {
    onStateChange = defaultOnHandle;
  }

  const {actions, handlers} = build(functions, reducerName, TAG, getReducerState);

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

  reducer.getActions = createActionsGetter(actions);

  return reducer;
}

function defaultOnHandle(state, payload, handler) {
  return handler(state, payload);
}

function build(functions, reducerName, tag, getReducerState) {
  assert(functions && Object.keys(functions).length !== 0, "Reducer creation failed. No functions found!");

  const actions = {};
  const handlers = {};
  const getHandlers = () => handlers;

  Object.keys(functions).forEach(name => {
    const func = functions[name];
    assert(isFunction(func), `${name} is not a function!`);

    const builder = !func.hasOwnProperty("handlerType") ? createActionBuilder(func) : func;
    let [action, handler] = builder({reducerName, name, tag, getReducerState, getHandlers});

    actions[name] = action;
    handlers[name] = handler;
  });

  return {actions, handlers};
}

function bindActions(actions, dispatch) {
  const actionsObj = {};
  Object.keys(actions).forEach(name => {
    actionsObj[name] = actions[name].bind(actionsObj, dispatch);
  });
  return actionsObj;
}

function createActionsGetter(actions) {
  const cache = new WeakMap();

  return function(dispatch) {
    if(cache.has(dispatch)) {
      return cache.get(dispatch);
    }

    assert(isFunction(dispatch), "Invalid dispatch function reference!");

    const boundedActions = bindActions(actions, dispatch);
    cache.set(dispatch, boundedActions);
    return boundedActions;
  };
}

export default createReducer;