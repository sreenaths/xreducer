import { createReducer, func, reduxThunk } from '../../../index';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunkMiddleware from 'redux-thunk';

describe('Unit Test : debugMode attribute of createReducer()', () => {

  test('With func()', (done) => {
    let reducer = createReducer({
      act: func(() => {})
    }, null, {reducerName: "testReducer", debugMode: true});

    expect.assertions(1);

    function middleMan({ getState }) {
      return next => action => {
        expect(action.type).toBe("@FUNC.testReducer.act");
        done();
        return next(action)
      }
    }

    let store = createStore(reducer, applyMiddleware(middleMan));
    let actions = reducer.getActions(store.dispatch);

    actions.act();
  });

  test('With reduxThunk()', (done) => {
    let reducer = createReducer({
      act: reduxThunk(() => {})
    }, null, {reducerName: "testReducer", debugMode: true});
  
    function middleMan({ getState }) {
      return next => action => {
        if(action.type) {
          expect(action.type).toBe("@THUNK.testReducer.act");
          done();
        }
        return next(action)
      }
    }
  
    let store = createStore(reducer, applyMiddleware(ReduxThunkMiddleware, middleMan));
    let actions = reducer.getActions(store.dispatch);
  
    actions.act();
  });

});