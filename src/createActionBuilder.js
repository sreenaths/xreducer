import isFunction from './helpers/isFunction';
import assert from './helpers/assert';
import createDispatchType from './helpers/createDispatchType';
import debounce from './helpers/debounce';

import setupBuilder from './helpers/setupBuilder';

const HANDLER_TYPE = "ACTION";

function createActionBuilder(handler, {customType, debounceWait} = {}) {
  assert(isFunction(handler), "Handler is not a function!");

  return setupBuilder(function({reducerName, handlerName, tag}) {
    const type = customType || createDispatchType(HANDLER_TYPE, reducerName, handlerName);

    let action = function(dispatch, payload) {
      dispatch({type, tag, handlerName, payload});
    };

    if(debounceWait) {
      action = debounce(action, debounceWait);
    }

    return [action, handler];
  }, HANDLER_TYPE);
}

export default createActionBuilder;