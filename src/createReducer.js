import { isFunction, assert } from './helpers';

function createReducer(handlers, initialState, beforeHandle) {
  const TAG = {};

  let lastState;
  const getState = () => lastState;

  Object.freeze(handlers);

  // TAG: To execute current handler only if it was dispatched from the related dispatcher
  // Writing this as two separate functions for the minor increase in performance
  const reducer = beforeHandle ? function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = beforeHandle(state, actionObj.payload, function (state, payload) {
        return actionObj.handler.call(actionObj.thisArg, state, payload);
      });
    }
    lastState = state;
    return state;
  } : function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = actionObj.handler.call(actionObj.thisArg, state, actionObj.payload);
    }
    lastState = state;
    return state;
  };

  reducer.getActions = createActionsGetter(handlers, TAG, getState);

  return reducer;
}

const TYPE_PREFIX = "X_REDUCER"; // To prevent type name conflicts when used alongside normal reducers
function createAction(handler, type = TYPE_PREFIX) {
  assert(isFunction(handler), "Handler is not a function!");

  function action(payload) {
    this.__dispatch({
      type,
      tag: this.__reducerInfo.tag,
      handler,
      thisArg: this.__reducerInfo.handlers,
      payload
    });
  };

  action.isWrapped = true;
  return action;
}

function createThunk(handler) {
  assert(isFunction(handler), "Handler is not a function!");

  function thunk(payload) {
    const helpers = {
      dispatch: this.__dispatch,
      getState: this.__reducerInfo.getState,
    };
    return handler(this, payload, helpers);
  };

  thunk.isWrapped = true;
  return thunk;
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

export {
  createReducer,
  createThunk as thunk,
  createAction as action,
};