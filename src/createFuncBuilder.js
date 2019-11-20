import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import debounce from './helpers/debounce';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "FUNC";

// TODO: Based on an optional param, dispatch actions on start and end without TAG for debugging
function createFuncBuilder(handler, {debounceWait} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({getReducerState, getHandlers}) {

    let func = function(dispatch, payload) {
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