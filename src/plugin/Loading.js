import React,{Component} from 'react'
import PropTypes from 'prop-types';
import store from '../store/state'
import './Loading.scss'
export default class Loading extends Component{

  constructor(props){
    super(props)
  }

  componentDidMount() {
    console.log(store.getState())
  }

  render(){
    const size = {
      height:store.getState().screenHeight+'px',width:store.getState().screenWidth+'px',
    }
    return (
      <div className={ this.props.loading?"Loading fade-in":"Loading fade-out"} style={size}>
        <div className={"outer"}></div>
        <div className={"inner"}></div>
      </div>
    )
  }
}
Loading.propTypes={
  loading:PropTypes.bool
}
