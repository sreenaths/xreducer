import { isFunction, assert } from './helpers/utils';
import setupBuilder from './helpers/setupBuilder';

function createFuncBuilder(handler) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({getReducerState, getHandlers}) {

    function func(dispatch, payload) {
      const helpers = {
        dispatch
      };
      return handler.call(getHandlers(), this, getReducerState, payload, helpers);
    };

    return [func, handler];
  }, "FUNC");
}

export default createFuncBuilder;