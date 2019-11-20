import { createReducer, func } from '../index';
import { createStore, applyMiddleware } from 'redux';

//-- Positive tests ---------------------------------------------------------------------

test('Positive tests: Ticker test', async (done) => {

  /**
   * Ticker Test
   * state object would have two values tickerCount & tickerID. For a non-running ticker ID would be null.
   * startTicker(t) func increments tickerCount every t milliseconds through incrementTicker action. Returns false if ticker is already running else true.
   * waitTicker(t) func waits for t milliseconds and returns the ticker value.
   * stopTicker() func stops ticking.
   * waitStopTick(t) func waits for t milliseconds stops and returns the ticker value.
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

    // Normal function as func
    startTicker: func(function (actions, getReducerState, payload) {
      if(getReducerState().tickerID === null) {
        actions.setID(setInterval(() => {
          actions.incrementTick();
        }, payload));
        return true;
      }
      return false;
    }),
    stopTicker: func(function (actions, getReducerState) {
      clearInterval(getReducerState().tickerID);
      actions.setID(null);
    }),

    // Async function as func
    waitTicker: func(async (actions, getReducerState, payload) => {
      return new Promise((res, rej) => {
        setTimeout(() => res(getReducerState().tickerCount), payload);
      });
    }),
    // Calling a func handler from inside another
    waitStopTick: func(async function(actions, getReducerState, payload) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          this.stopTicker(actions, getReducerState, payload);
          res(getReducerState().tickerCount)
        }, payload);
      });
    }),
  };

  let reducer = createReducer(handlers, ticker);
  let store = createStore(reducer);
  let actions = reducer.getActions(store.dispatch);

  expect(actions.startTicker(100)).toBeTruthy();
  expect(await actions.waitTicker(320)).toBe(3);
  expect(store.getState().tickerCount).toBe(3);
  expect(actions.startTicker(100)).toBeFalsy();
  expect(await actions.waitTicker(210)).toBe(5);
  expect(store.getState().tickerCount).toBe(5);
  actions.stopTicker();
  expect(await actions.waitTicker(500)).toBe(5);
  expect(store.getState().tickerCount).toBe(5);
  expect(actions.startTicker(100)).toBeTruthy();
  expect(await actions.waitTicker(320)).toBe(8);
  expect(store.getState().tickerCount).toBe(8);
  expect(await actions.waitStopTick(220)).toBe(10);

  done();
});

test('Positive tests: Debounce func with payload', (done) => {
  let reducer = createReducer({
    inc: (state, payload) => state + payload,
    act: func((actions, getReducerState, payload) => actions.inc(payload), {debounceWait: 100})
  }, 1);

  let middleManCalls = 0;
  function middleMan({ getState }) {
    return next => action => {
      middleManCalls++;
      return next(action)
    }
  }

  let store = createStore(reducer, applyMiddleware(middleMan));
  let actions = reducer.getActions(store.dispatch);

  let subscriptionCalls = 0;
  store.subscribe(() => subscriptionCalls++);

  actions.act(1);
  actions.act(2);
  actions.act(3);
  actions.act(4); // << Only this must get called

  setTimeout(() => {
    expect(middleManCalls).toBe(1);
    expect(subscriptionCalls).toBe(1);

    expect(store.getState()).toBe(1 + 4);

    done();
  }, 200);
});