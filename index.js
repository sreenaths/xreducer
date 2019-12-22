import createReducer from './src/creators/createReducer';

import createFunc from './src/creators/createFunc';
import createStateAction from './src/creators/createStateAction';
import createReduxThunk from './src/creators/createReduxThunk';

export {
  createReducer,

  createStateAction as action,

  createFunc as func,
  createReduxThunk as reduxThunk
};