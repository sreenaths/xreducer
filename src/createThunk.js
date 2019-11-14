import { isFunction, assert } from './helpers';

function createThunk(handler) {
  assert(isFunction(handler), "Handler is not a function!");

  function thunk(payload) {
    const helpers = {
      dispatch: this.__dispatch,
      getState: this.__reducerInfo.getState,
    };
    return handler(this, payload, helpers);
  };

  thunk.isWrapped = true;
  return thunk;
}

export default createThunk;