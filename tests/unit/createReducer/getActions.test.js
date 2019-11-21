import { createReducer } from '../../../index';

describe('Unit Test : createReducer().getAction()', () => {

  test('With invalid dispatch reference as argument', () => {
    const ERROR_REGEX = /Invalid dispatch function reference/;
    const DUMMY_DISPATCH = () => {};
  
    let reducer = createReducer({
      fun: () => {}
    });
  
    reducer.getActions(DUMMY_DISPATCH);
  
    expect(() => {
      reducer.getActions();
    }).toThrow(ERROR_REGEX);
  
    expect(() => {
      reducer.getActions(1);
    }).toThrow(ERROR_REGEX);
  
    expect(() => {
      reducer.getActions("No dispatch");
    }).toThrow(ERROR_REGEX);
  
    expect(() => {
      reducer.getActions({});
    }).toThrow(ERROR_REGEX);
  
    reducer.getActions(DUMMY_DISPATCH);
  });

  test('By trying to add new actions into the frozen returned object', () => {
    let handlers = {
      inc: () => {},
      dec: () => {},
    };
  
    let reducer = createReducer(handlers, 1);
    let actions = reducer.getActions(() => {});
  
    expect(() => {
      actions.newAction = () => {};
    }).toThrow(TypeError);
  });

});