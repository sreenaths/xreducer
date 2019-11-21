import React from 'react';
import { connect } from 'react-redux';
import reducer from './reducer';

class Counter extends React.Component {
  render() {
    return <div>
      <p>{this.props.count}</p>
      <button onClick={this.props.inc} />
      <button onClick={this.props.dec} />
    </div>;
  }
}

const mapStateToProps = state => state;
export default connect(
  mapStateToProps,
  reducer.getActions
)(Counter);