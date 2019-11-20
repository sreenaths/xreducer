import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import debounce from './helpers/debounce';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "THUNK";

// TODO: Based on an optional param, dispatch actions on start and end without TAG for debugging
function createReduxThunkBuilder(handler, {debounceWait} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({getHandlers}) {

    let reduxThunk = function(dispatch, payload) {
      const actions = this;
      dispatch(function(dispatch, getState) {
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