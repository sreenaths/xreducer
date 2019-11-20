"use strict";

import { createReducer } from '../../../index';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Function addition', () => {
  let handlers = {
    inc: () => {},
    dec: () => {},
  };

  createReducer(handlers, 1);

  expect(() => {
    handlers.newFun = () => {};
  }).toThrow(TypeError);
});

test('Positive tests: Function modification', () => {
  let handlers = {
    inc: () => {},
    dec: () => {},
  };

  createReducer(handlers, 1);

  expect(() => {
    handlers.inc = () => {};
  }).toThrow(TypeError);
});
