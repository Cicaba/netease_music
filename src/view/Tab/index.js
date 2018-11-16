import React, { Component } from 'react';
import { Flex,Drawer } from 'antd-mobile';
import {Route} from 'react-router-dom';
import './index.scss'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      TouchStart:[0,0],
      TouchEnd:[0,0],
      present:1
    };
  }

  componentWillMount(){
    console.log(this.props.state.userData)
    this.props.screenHeight({"type":"screenHeight","data":document.body.clientHeight});
    this.props.screenWidth({"type":"screenWidth","data":document.body.clientWidth});
    if(!this.props.state.loginState){
      this.props.history.replace('/Login');
    }
  }
  Drawer(){
    this.setState({
      open:true,
      present:0
    })
  }
  TouchStart(e){
    let arr = [e.touches[0].pageX,e.touches[0].pageY]
    this.setState({
      TouchStart:arr
    })
  }
  TouchEnd(e){
    let arr = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
    this.setState({
      TouchEnd:arr
    },()=>{
      if(getDirection(...this.state.TouchStart,...this.state.TouchEnd)==3){
        this.setState({
          open:false,
          present:1
        })
      }
    });
  }
  sidebar(){
    return(
      <div className={"sidebar"} onTouchStart={(e)=>{this.TouchStart(e)}} onTouchEnd={(e)=>{this.TouchEnd(e)}}>
        <div className={"bag"} style={{backgroundImage:`url(${this.props.state.userData.profile.backgroundUrl})`}}>
          <div className={"img"}>
            <img src={this.props.state.userData.profile.avatarUrl}></img>
            <p>{this.props.state.userData.profile.nickname}</p>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <main className="App">
        <Drawer open={this.state.open} sidebar={this.sidebar()}>
          <nav className="TabBar">
            <Flex align={"center"}>
              <Flex.Item onClick={()=>this.Drawer()} className="icon-menu" style={this.state.present==0?{color:"#fff"}:{}}></Flex.Item>
              <Flex.Item style={{flex:4}}>
                <Flex style={{padding:"0 2rem 0 2rem"}}>
                  <Flex.Item onClick={()=>{this.setState({present:1})}} className="icon-music" style={this.state.present==1?{color:"#fff"}:{}}></Flex.Item>
                  <Flex.Item onClick={()=>{this.setState({present:2})}} className="icon-music-1" style={this.state.present==2?{color:"#fff"}:{}}></Flex.Item>
                  <Flex.Item onClick={()=>{this.setState({present:3})}} className="icon-users" style={this.state.present==3?{color:"#fff"}:{}}></Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item  onClick={()=>{this.setState({present:4})}} className=" icon-search-1" style={this.state.present==4?{color:"#fff"}:{}}></Flex.Item>
            </Flex>
          </nav>
        </Drawer>
        <Route path={this.props.match.path} component={()=>this.props.children}></Route>
      </main>
    );
  }
}
//获得角度
function getAngle(angx, angy) {
  return Math.atan2(angy, angx) * 180 / Math.PI;
};

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }

  return result;
}
export default App;
