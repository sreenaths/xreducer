import { isFunction } from './helpers';

function createReducer(handlers, defaultState, beforeHandle) {
  const VALIDATOR = {};

  Object.freeze(handlers);
  handlers = Object.assign({}, handlers);

  if(!handlers || Object.keys(handlers).length === 0) {
    throw new Error("Reducer creation failed. No handlers found!");
  }

  Object.keys(handlers).forEach(name => {
    if(!isFunction(handlers[name])) {
      throw new TypeError(`Handler '${name}' is not a function!`);
    }
  });

  const reducer = function(state = defaultState, currentAction) {
    // Execute current handler only if it was dispatched using xReducer
    if(currentAction.validator === VALIDATOR && currentAction.handler) {
      if(beforeHandle) {
        state = beforeHandle(state, currentAction.payload, function (state, payload) {
          return currentAction.handler.call(handlers, state, payload);
        });
      } else {
        state = currentAction.handler.call(handlers, state, currentAction.payload);
      }
    }
    return state;
  };

  const TYPE = "REDUCER_ACTION";
  const handlerGetter = function(obj, prop){
    if(this.cache[prop]) {
      return this.cache[prop];
    }

    const handler = obj[prop];
    if(isFunction(handler)) {
      const dispatch = this.dispatch;
      return this.cache[prop] = function(payload) {
        dispatch({
          type: TYPE,
          validator: VALIDATOR,
          payload,
          handler
        });
      };
    }
    return handler;
  }

  const getHandlers = function(dispatch) {
    if(!isFunction(dispatch)) {
      throw new Error("Invalid dispatch!");
    }

    // TODO 1: Should we cache handler set using a WeakMap with dispatch as key?
    // TODO 2: Should we go low tech and just loop through the handlers and create a new handlers object?

    return new Proxy(handlers, {
      dispatch,
      cache: {},
      get: handlerGetter
    });
  };

  reducer.getHandlers = getHandlers;
  return reducer;
}

export { createReducer };