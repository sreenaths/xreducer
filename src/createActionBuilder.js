import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import createDispatchType from './helpers/createDispatchType';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "ACTION";

function createActionBuilder(handler, {customType} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({reducerName, handlerName, tag}) {
    const type = customType || createDispatchType(HANDLER_TYPE, reducerName, handlerName);

    let action = function action(dispatch, payload) {
      dispatch({type, tag, handlerName, payload});
    };

    return [action, handler];
  }, HANDLER_TYPE);
}

export default createActionBuilder;