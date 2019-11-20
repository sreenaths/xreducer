import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import createDispatchType from './helpers/createDispatchType';
import debounce from './helpers/debounce';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "THUNK";

function createReduxThunkBuilder(handler, {debounceWait} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({reducerName, handlerName, getHandlers, debugMode}) {
    const type = createDispatchType(HANDLER_TYPE, reducerName, handlerName);

    let reduxThunk = function(dispatch, payload) {
      const actions = this;
      dispatch(function(dispatch, getState) {
        if(debugMode) {
          dispatch({type, payload});
        }

        const helpers = {
          dispatch
        };
        return handler.call(getHandlers(), actions, getState, payload, helpers);
      });
    };

    if(debounceWait) {
      reduxThunk = debounce(reduxThunk, debounceWait);
    }

    return [reduxThunk, handler];
  }, HANDLER_TYPE);
}

export default createReduxThunkBuilder;