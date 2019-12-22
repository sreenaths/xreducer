import setupAction from '../helpers/setupAction';

function createReduxThunk(handler, {debounceWait} = {}) {
  function reduxThunk(payload) {
    const handlers = this.reducerProps;
    const actions = this.getActions();
    this.dispatch(function(dispatch, getState) {
      const helpers = {
        dispatch
      };
      return handler.call(handlers, actions, getState, payload, helpers);
    });
  }  

  return setupAction(reduxThunk, handler, debounceWait);
}

export default createReduxThunk;