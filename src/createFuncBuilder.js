import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import createDispatchType from './helpers/createDispatchType';
import debounce from './helpers/debounce';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "FUNC";

// TODO: Based on an optional param, dispatch actions on start and end without TAG for debugging
function createFuncBuilder(handler, {debounceWait} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({reducerName, handlerName, getReducerState, getHandlers, debugMode}) {
    const type = createDispatchType(HANDLER_TYPE, reducerName, handlerName);

    let func = function(dispatch, payload) {
      if(debugMode) {
        dispatch({type, payload});
      }

      const helpers = {
        dispatch
      };
      return handler.call(getHandlers(), this, getReducerState, payload, helpers);
    };

    if(debounceWait) {
      func = debounce(func, debounceWait);
    }

    return [func, handler];
  }, HANDLER_TYPE);
}

export default createFuncBuilder;