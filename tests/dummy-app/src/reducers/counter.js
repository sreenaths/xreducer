import { createReducer, func } from 'xreducer';

const initialState = {
  count: 1
};

const counterReducer = createReducer({
  inc: state => ({ count: state.count + 1 }),
  dec: state => ({ count: state.count - 1 }),
  incFunc: func(actions => actions.inc(), {debounceWait: 2000}),
  decFunc: func(actions => actions.dec(), {debounceWait: 2000})
}, initialState);

export default counterReducer;