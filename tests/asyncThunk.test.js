import { createReducer, thunk, action } from '../index';
import { createStore } from 'redux';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Ticker test', async (done) => {

  /**
   * Ticker Test
   * state object would have two values tickerCount & tickerID. For a non-running ticker ID would be null.
   * startTicker(t) thunk increments tickerCount every t milliseconds through incrementTicker action. Returns false if ticker is already running else true.
   * waitTicker(t) thunk waits for t milliseconds and returns the ticker value.
   * stopTicker() thunk stops ticking.
   * waitStopTick(t) thunk waits for t milliseconds stops and returns the ticker value.
  */

  let ticker = {
    tickerID: null,
    tickerCount: 0
  };

  let handlers = {
    // Handlers
    incrementTick: (state) => {
      return {
        ...state,
        tickerCount: state.tickerCount + 1,
      };
    },
    setID: (state, ID) => {
      return {
        ...state,
        tickerID: ID,
      };
    },

    // Normal function as thunk
    startTicker: thunk(function (actions, payload, helpers) {
      if(helpers.getState().tickerID === null) {
        actions.setID(setInterval(() => {
          actions.incrementTick();
        }, payload));
        return true;
      }
      return false;
    }),
    stopTicker: thunk(function (actions, payload, helpers) {
      clearInterval(helpers.getState().tickerID);
      actions.setID(null);
    }),

    // Async function as thunk
    waitTicker: thunk(async (actions, payload, helpers) => {
      return new Promise((res, rej) => {
        setTimeout(() => res(helpers.getState().tickerCount), payload);
      });
    }),
    // Calling a thunk handler from inside another
    waitStopTick: thunk(async function(actions, payload, helpers) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          this.stopTicker(actions, payload, helpers);
          res(helpers.getState().tickerCount)
        }, payload);
      });
    }),
  };

  let reducer = createReducer(handlers, ticker);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(actions.startTicker(100)).toBeTruthy();
  expect(await actions.waitTicker(310)).toBe(3);
  expect(store.getState().tickerCount).toBe(3);
  expect(actions.startTicker(100)).toBeFalsy();
  expect(await actions.waitTicker(210)).toBe(5);
  expect(store.getState().tickerCount).toBe(5);
  actions.stopTicker();
  expect(await actions.waitTicker(500)).toBe(5);
  expect(store.getState().tickerCount).toBe(5);
  expect(actions.startTicker(100)).toBeTruthy();
  expect(await actions.waitTicker(310)).toBe(8);
  expect(store.getState().tickerCount).toBe(8);
  expect(await actions.waitStopTick(210)).toBe(10);

  done();
});