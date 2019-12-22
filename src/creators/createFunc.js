import setupAction from '../helpers/setupAction';

function createFunc(handler, {debounceWait} = {}) {
  function func(payload) {
    const reducerProps = this.reducerProps;
    const helpers = {
      dispatch: this.dispatch
    };
    return handler.call(reducerProps.handlers, this.getActions(), reducerProps.getReducerState, payload, helpers);
  }

  return setupAction(func, handler, debounceWait);
}

export default createFunc;