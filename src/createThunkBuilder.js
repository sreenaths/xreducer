import { isFunction, assert } from './helpers/utils';
import setupBuilder from './helpers/setupBuilder';

function createThunkBuilder(handler) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({getReducerState, getHandlers}) {

    function thunk(payload) {
      const helpers = {
        dispatch: this.__dispatch,
      };
      return handler.call(getHandlers(), this, getReducerState, payload, helpers);
    };

    return [thunk, handler];
  }, "THUNK");
}

export default createThunkBuilder;