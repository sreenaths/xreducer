import { isFunction, assert } from './helpers/utils';
import createActionBuilder from './createActionBuilder';
import createHandlerStore from './helpers/createHandlerStore';

function createReducer(functions, initialState, {name, beforeHandle} = {}) {
  const TAG = {};

  let currentReducerState;
  const getReducerState = () => currentReducerState;

  Object.freeze(functions);

  assert(!beforeHandle || isFunction(beforeHandle), "beforeHandle passed is not a function!");

  // TAG: To execute current handler only if it was dispatched from the related dispatcher
  // Writing this as two separate functions for the minor increase in performance
  const reducer = beforeHandle ? function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = beforeHandle(state, actionObj.payload, function (state, payload) {
        return actionObj.handler.call(actionObj.thisArg, state, payload);
      });
    }
    currentReducerState = state;
    return state;
  } : function(state = initialState, actionObj) {
    if(actionObj.tag === TAG) {
      state = actionObj.handler.call(actionObj.thisArg, state, actionObj.payload);
    }
    currentReducerState = state;
    return state;
  };

  reducer.getActions = createActionsGetter(name, functions, TAG, getReducerState);

  return reducer;
}

function buildActions(reducerName, functions, tag, getReducerState) {
  assert(functions && Object.keys(functions).length !== 0, "Reducer creation failed. No functions found!");

  // TODO: Evaluate if this is actually required, why not open-up all handlers and leave it to the user to decide how to use it!
  // It was brought in so that action handler functions are not directly accessible from thunk using this object, instead
  // only through the actions object! That said thunk handler functions can be called using this.
  let handlerStore = createHandlerStore();

  let actions = {};
  Object.keys(functions).forEach(name => {
    const func = functions[name];
    assert(isFunction(func), `${name} is not a function!`);

    const builder = !func.hasOwnProperty("handlerType") ? createActionBuilder(func) : func;
    let {setHandler, getHandlers} = handlerStore(builder.handlerType);
    let [action, handler] = builder({reducerName, name, tag, getReducerState, getHandlers});

    actions[name] = action;
    setHandler(name, handler);
  });

  return actions;
}

function createActionsGetter(reducerName, functions, tag, getReducerState) {
  const actions = buildActions(reducerName, functions, tag, getReducerState);

  return function(dispatch) {
    assert(isFunction(dispatch), "Invalid dispatch function reference!");

    let actionsObj = Object.create(actions);
    actionsObj.__dispatch = dispatch;
    Object.freeze(actionsObj);

    return actionsObj;
  };
}

export default createReducer;