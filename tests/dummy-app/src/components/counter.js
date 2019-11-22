import React from 'react';
import { connect } from 'react-redux';

import reducer from '../reducers/counter';

class Counter extends React.Component {
  render() {
    return (
      <div>
        Counter
        <h1>{this.props.count}</h1>

        <button onClick={() => this.props.inc()}>Increment</button>
        <button onClick={() => this.props.dec()}>Decrement</button>
        <button onClick={() => this.props.incFunc()} className="animated">Debounce Increment</button>
        <button onClick={() => this.props.decFunc()} className="animated">Debounce Decrement</button>
      </div>
    );
  }
}

export default connect(state => state, reducer.getActions)(Counter);