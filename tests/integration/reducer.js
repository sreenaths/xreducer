import { createReducer } from '../../index';

const initialState = {
  count: 1
};

export default createReducer({
  inc: state => {
    return {
      count: state.count + 1
    }
  },
  dec: state => {
    return {
      count: state.count - 1
    }
  }
}, initialState);