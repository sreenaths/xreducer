import { createReducer } from '../../../index';
import { createStore } from 'redux';

describe('Unit Test : createReducer()', () => {

  test('By creating a reducer instance with 2 handlers', () => {
    let reducer = createReducer({
      handlerA: function (){return true},
      handlerB: function (){return this.handlerA()},
    }, null);
    let store = createStore(reducer);
    let actions = reducer.getActions(store.dispatch);
  
    expect(actions).toBeTruthy();
    expect(actions.handlerA).toBeTruthy();
    expect(actions.handlerB).toBeTruthy();
    expect(store.getState()).toBe(null);
  
    actions.handlerB()
    expect(store.getState()).toBeTruthy();
  });

  test('By creating a reducer instance without handlers', () => {
    const ERROR_REGEX = /No functions found/;
    expect(() => {
      createReducer();
    }).toThrow(ERROR_REGEX);
    expect(() => {
      createReducer({});
    }).toThrow(ERROR_REGEX);
  });
  
  test('By creating a reducer instance with invalid handler', () => {
    expect(() => {
      createReducer({
        propNum: 1
      });
    }).toThrow(/propNum is not a function/);
  
    expect(() => {
      createReducer({
        fun: () => {},
        propStr: "abc",
      });
    }).toThrow(/propStr is not a function/);
  
    expect(() => {
      createReducer({
        fun: () => {},
        propObj: {},
      });
    }).toThrow(/propObj is not a function/);
  });

});

describe('Unit Test : Objects frozen by createReducer()', () => {

  test('By trying to add new handler into the handler object passed into createReducer', () => {
    let handlers = {
      inc: () => {},
      dec: () => {},
    };
  
    createReducer(handlers, 1);
  
    expect(() => {
      handlers.newFun = () => {};
    }).toThrow(TypeError);
  });
  
  test('By trying to modify handlers in the handler object', () => {
    let handlers = {
      inc: () => {},
      dec: () => {},
    };
  
    createReducer(handlers, 1);
  
    expect(() => {
      handlers.inc = () => {};
    }).toThrow(TypeError);
  });

});