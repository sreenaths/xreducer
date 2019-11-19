import { isFunction, assert } from './helpers/utils';
import setupBuilder from './helpers/setupBuilder';

function createReduxThunkBuilder(handler) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({getHandlers}) {

    function reduxThunk(dispatch, payload) {
      dispatch(function(dispatch, getState) {
        const helpers = {
          dispatch
        };
        return handler.call(getHandlers(), this, getState, payload, helpers);
      });
    };

    return [reduxThunk, handler];
  }, "THUNK");
}

export default createReduxThunkBuilder;