import React, { Component } from 'react';
import { Flex,Drawer } from 'antd-mobile';
import Song from '../Song/index';
import Player from '../player/index';
import axios from '../../plugin/axios'
import './index.scss'

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      TouchStart:[0,0],
      TouchEnd:[0,0],
      present:1,
    };
  }

  componentWillMount(){
    console.log(this.props.state.userData)
    this.props.screenHeight({"type":"screenHeight","data":document.body.clientHeight});
    this.props.screenWidth({"type":"screenWidth","data":document.body.clientWidth});
    if(!this.props.state.loginState){
      this.props.history.replace('/Login');
    }else{
      axios.get('/user/detail',{params:{"uid":this.props.state.userData.profile.userId}}).then(res=>{
        this.props.userDataDetail({"type":"userDataDetail",data:res.data})
      })
      //登陆状态
      axios.get('/login/status').catch(()=>{
        this.props.loginState({type:"loginState",data:false});
        this.props.history.replace('/Login');
      })
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
      if('level' in this.props.state.userData.detail){
        return(
          <div className={"sidebar"} onTouchStart={(e)=>{this.TouchStart(e)}} onTouchEnd={(e)=>{this.TouchEnd(e)}}>
            <div className={"bag"} style={{backgroundImage:`url(${this.props.state.userData.profile.backgroundUrl})`}}>
              <div className={"img"}>
                <img src={this.props.state.userData.profile.avatarUrl}></img>
              </div>
              <p>
                {this.props.state.userData.profile.nickname}
                &emsp;
                <span className="level">{this.props.state.userData.detail.level}</span>
                <span className="sign">签到</span>
              </p>
            </div>
          </div>
        )
      }else{
        return(<div></div>)
      }
  }
  play(item,arr){
    this.props.beforePlay({type:"beforePlay",data:{...item,allItem:arr}})
    this.refs.player.player()
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
        <Song id={this.props.state.userData.profile.userId} play={(item,arr)=>{this.play(item,arr)}}></Song>
        <Player ref={"player"}></Player>
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
export default Tab;
