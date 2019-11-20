import isFunction from './helpers/isFunction';
import assert from './helpers/assert';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "THUNK";

// TODO: Based on an optional param, dispatch actions on start and end without TAG for debugging
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
  }, HANDLER_TYPE);
}

export default createReduxThunkBuilder;