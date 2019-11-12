import { isFunction } from './helpers';

function createReducer(handlers, initialState, beforeHandle) {
  const TAG = {};

  Object.freeze(handlers);

  // TAG: To execute current handler only if it was dispatched from the related dispatcher
  // action.handlers[action.type]: Getting handler reference this way turned out to be the best in performance
  // Writing this as two separate functions for the minor increase in performance
  const reducer = beforeHandle ? function(state = initialState, action) {
    if(action.tag === TAG) {
      state = beforeHandle(state, action.payload, function (state, payload) {
        return action.handlers[action.name](state, payload);
      });
    }
    return state;
  } : function(state = initialState, action) {
    if(action.tag === TAG) {
      state = action.handlers[action.name](state, action.payload);
    }
    return state;
  };

  reducer.getHandlers = createGetHandlers(handlers, TAG);

  return reducer;
}

const TYPE_PREFIX = "X_REDUCER_"; // To prevent type name conflicts when used alongside normal reducers
function createDispatchers(handlers) {
  let dispatchers = {};

  if(!handlers || Object.keys(handlers).length === 0) {
    throw new Error("Reducer creation failed. No handlers found!");
  }

  // Is there a better way than iterating!? Proxy could help, but comes with a performance cost.
  Object.keys(handlers).forEach(name => {
    if(!isFunction(handlers[name])) {
      throw new TypeError(`Handler '${name}' is not a function!`);
    }

    const type = TYPE_PREFIX + name.toUpperCase();
    dispatchers[name] = function(payload) {
      this.dispatch({
        type,
        name,
        tag: this.tag,
        handlers: this.handlers,
        handler: this.handlers[name],
        payload
      });
    };
  });

  return dispatchers;
}

function createGetHandlers(handlers, tag) {
  const dispatchers = createDispatchers(handlers);

  return function(dispatch) {
    if(!isFunction(dispatch)) {
      throw new TypeError("Invalid dispatch!");
    }

    let newHandlers = Object.create(dispatchers);
    newHandlers.dispatch = dispatch;
    newHandlers.tag = tag;
    newHandlers.handlers = handlers;
    return newHandlers;
  };
}

export { createReducer };