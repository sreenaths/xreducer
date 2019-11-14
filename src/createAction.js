import { isFunction, assert } from './helpers';

export const TYPE_PREFIX = "X_REDUCER"; // To prevent type name conflicts when used alongside normal reducers

function createAction(handler, type = TYPE_PREFIX) {
  assert(isFunction(handler), "Handler is not a function!");

  function action(payload) {
    this.__dispatch({
      type,
      tag: this.__reducerInfo.tag,
      handler,
      thisArg: this.__reducerInfo.handlers,
      payload
    });
  };

  action.isWrapped = true;
  return action;
}

export default createAction;