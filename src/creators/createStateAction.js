import constructDispatchType from '../helpers/constructDispatchType';
import setupAction from '../helpers/setupAction';

const ACTION_CLASS = "ACTION";

function createAction(handler, {customType, debounceWait} = {}) {
  function action(payload) {
    if(!this.type) {
      this.type = customType || constructDispatchType(ACTION_CLASS, this.reducerProps.name, this.name);
    }

    this.dispatch({
      type: this.type,
      name: this.name,
      tag: this.reducerProps.tag,
      payload
    });
  }

  return setupAction(action, handler, debounceWait);
}

export default createAction;