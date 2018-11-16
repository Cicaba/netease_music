import React, { Component } from 'react';
import { Flex } from 'antd-mobile';
import './index.scss'

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    console.log(this.props.state.userData)
  }

  render() {
    return (
      <div className={"Song"}>
        <p>123</p>
        <p>123</p>
      </div>
    );
  }
}
export default Song;
