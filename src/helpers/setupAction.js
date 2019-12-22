import debounce from '../helpers/debounce';
import assert from '../helpers/assert';
import isFunction from '../helpers/isFunction';

function setupAction(action, handler, debounceWait) {
  assert(isFunction(handler), "Handler is not a function!");

  if(debounceWait) {
    action = debounce(action, debounceWait);
  }

  action.handler = handler;
  Object.freeze(action);
  return action;
}

export default setupAction;