import { isFunction, assert, createType } from './helpers/utils';
import setupBuilder from './helpers/setupBuilder';

function createActionBuilder(handler, customType) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({reducerName, name, tag, getHandlers}) {
    const type = customType || createType(reducerName, name);

    function action(payload) {
      this.__dispatch({
        type,
        tag,
        handler,
        thisArg: getHandlers(),
        payload
      });
    };

    return [action, handler];
  }, "ACTION");
}

export default createActionBuilder;