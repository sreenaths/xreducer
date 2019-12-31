import debounce from '../helpers/debounce';
import assert from '../helpers/assert';
import isFunction from '../helpers/isFunction';

function setupAction(method, handler, debounceWait) {
  assert(isFunction(handler), "Handler is not a function!");

  if(debounceWait) {
    method = debounce(method, debounceWait);
  }

  const action = {
    method,
    handler
  };
  Object.freeze(action);
  return action;
}

export default setupAction;