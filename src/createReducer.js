import { isFunction, assert } from './helpers';
import createAction, { TYPE_PREFIX } from './createAction';

function createReducer(handlers, initialState, beforeHandle) {
  const TAG = {};

  let currentState;
  const getState = () => currentState;

  Object.freeze(handlers);

  assert(!beforeHandle || isFunction(beforeHandle), "beforeHandle passed is not a function!");

  // TAG: To execute current handler only if it was dispatched from the related dispatcher
  // Writing this as two separate functions for the minor increase in performance
  const reducer = beforeHandle ? function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = beforeHandle(state, actionObj.payload, function (state, payload) {
        return actionObj.handler.call(actionObj.thisArg, state, payload);
      });
    }
    currentState = state;
    return state;
  } : function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = actionObj.handler.call(actionObj.thisArg, state, actionObj.payload);
    }
    currentState = state;
    return state;
  };

  reducer.getActions = createActionsGetter(handlers, TAG, getState);

  return reducer;
}

function mapHandlersToActions(handlers) {
  assert(handlers && Object.keys(handlers).length !== 0, "Reducer creation failed. No handlers found!");

  let actions = {};
  let pureHandlers = {};
  Object.keys(handlers).forEach(name => {
    const handler = handlers[name];
    assert(isFunction(handler), `Handler '${name}' is not a function!`);

    const type = `${TYPE_PREFIX}_${name.toUpperCase()}`;
    if(handler.isWrapped) {
      actions[name] = handler;
    } else {
      actions[name] = createAction(handler, type);
      pureHandlers[name] = handler;
    }
  });
  return {actions, pureHandlers};
}

function createActionsGetter(handlers, tag, getState) {
  const {actions, pureHandlers} = mapHandlersToActions(handlers);
  const reducerInfo = {
    tag,
    getState,
    handlers: pureHandlers,
  };

  return function(dispatch) {
    assert(isFunction(dispatch), "Invalid dispatch function reference!");

    let actionsObj = Object.create(actions);
    actionsObj.__dispatch = dispatch;
    actionsObj.__reducerInfo = reducerInfo;

    return actionsObj;
  };
}

export default createReducer;