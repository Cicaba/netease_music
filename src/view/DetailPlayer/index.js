import React, {Component} from 'react';
import './index.scss'
import { Slider,Flex } from 'antd-mobile';
import imgurl from '../../imgs/唱片.png'
import store from "../../store/state";
import {Toast} from "antd-mobile/lib/index";
import axios from "../../plugin/axios";

export default class DetailPlayer extends Component {
  constructor(props) {
    super(props)
    this.state={
      PlayMode:{'icon-exchange':"列表循环",'icon-loop':'单曲循环','icon-shuffle':"随机播放"},
      currentTime:0
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // console.log(store.getState().beforePlay)
    // console.log(store.getState().beforePlay.loveid,store.getState().beforePlay.pid)
    return true
  }
//喜欢的音乐
  love(){
    if(store.getState().beforePlay.loveid===store.getState().beforePlay.pid){
      axios.get("/playlist/tracks", {
        params: {
          op: "del",
          pid: store.getState().beforePlay.loveid,
          tracks: store.getState().beforePlay.id
        }
      }).then(res => {
        store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,pid:null}})
        Toast.info('成功移除喜欢歌单!', 2);
      }).catch(() => {
        Toast.info('歌曲移除失败!', 2);
      })
    }else{
      axios.get("/playlist/tracks", {
        params: {
          op: "add",
          pid: store.getState().beforePlay.loveid,
          tracks: store.getState().beforePlay.id
        }
      }).then(res => {
        store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,pid:store.getState().beforePlay.loveid}})
        Toast.info("已成功添加到喜欢的歌单歌单!", 2)
      }).catch(() => {
        Toast.info("添加失败! 歌曲以存在歌单内!", 3);
      })
    }
  }
  //播放
  DetailPlay(carry){
    if(!store.getState().beforePlay.play || carry){
      var currentTime = setInterval(()=>{
          this.setState({
            currentTime:this.props.audio.currentTime
          })

      },1000)
    }else{
      clearInterval(currentTime)
    }
    carry||this.props.DetailPlay()
  }
  //设置进度
  planChange(v){
    this.setState({
      currentTime:v
    })
    this.props.audio.currentTime=v;
  }
  //设置音量
  volumeChange(v){
    this.props.audio.volume=v/100;
  }
  //播放模式
  PlayMode(){
    let ModeKeys = Object.keys(this.state.PlayMode);
    let index =  ModeKeys.indexOf(store.getState().beforePlay.PlayMode?store.getState().beforePlay.PlayMode:"icon-exchange");
    if(ModeKeys[index+1]){
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,PlayMode:ModeKeys[index+1]}})
    }else{
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,PlayMode:ModeKeys[0]}})
    }
    Toast.info(this.state.PlayMode[store.getState().beforePlay.PlayMode], 2);
  }
  render(){
    let bag = {
      backgroundImage: `url(${store.getState().beforePlay.al?store.getState().beforePlay.al.picUrl:''})`,
      backgroundSize: `${store.getState().screenWidth+'px'} ${store.getState().screenHeight+'px'}`
   }
    return (
      <div className={this.props.DetailPlayer ? 'DetailPlayer fade-in' : 'DetailPlayer fade-out'} style={this.props.DetailPlayer?{...bag,display:'block'}:{...bag,display:'none'}}>
        <div className={'mask'}>
          <div className={'head'}>
            <span className={'icon-left'} onClick={this.props.back}></span>
            <span className={"text"}> {store.getState().beforePlay.name?store.getState().beforePlay.name:""}</span>
            <span className={"author"}>&nbsp;
              {
                store.getState().beforePlay.ar && store.getState().beforePlay.ar.map(v=>{
                  return <span key={v.name}>{v.name} </span>
                })
              }
            </span>
          </div>
          <div className={'volume'}>
            <span className={'icon-volume-up'}></span>
            <Slider
              style={{ margin:".5rem 1rem 0 2rem"}}
              defaultValue={100}
              onAfterChange={(v)=>this.volumeChange(v)}
              min={0}
              max={100}
              trackStyle={{
                backgroundColor: '#ccc',
                height: '.1rem',
              }}
              railStyle={{
                backgroundColor: '#666',
                height: '.1rem',
              }}
              handleStyle={{
                borderColor: '#ccc',
                height: '1rem',
                width: '1rem',
                marginLeft: '-8px',
                marginTop: '-7px',
                backgroundColor: '#ccc',
              }}
            />
          </div>
          <div className={store.getState().beforePlay.play?'disc rotate paused':"disc rotate"}>
            <img src={imgurl} alt=""/>
            <div className={'img'}>
              <img src={store.getState().beforePlay.al?store.getState().beforePlay.al.picUrl:''} alt=""/>
            </div>
          </div>
          <Flex className={'control'}>
            <Flex.Item onClick={()=>{this.love()}} style={{fontSize:"1.4rem"}} className={store.getState().beforePlay.loveid===store.getState().beforePlay.pid?"icon-heart-filled":"icon-heart-1"}></Flex.Item>
            <Flex.Item onClick={this.props.DetailPlayStart} className={"icon-to-start"}></Flex.Item>
            <Flex.Item onClick={()=>this.DetailPlay()} className={!store.getState().beforePlay.play?"icon-play":"icon-pause"}></Flex.Item>
            <Flex.Item onClick={this.props.DetailPlayEnd} className={"icon-to-end"}></Flex.Item>
            <Flex.Item style={{fontSize:"1.2rem"}} onClick={()=>this.PlayMode()} className={store.getState().beforePlay.PlayMode?store.getState().beforePlay.PlayMode:"icon-exchange"}></Flex.Item>
          </Flex>
          <div className={'plan'}>
            <span style={{fontSize:".6rem"}}>{this.state.currentTime?formatSeconds(Math.ceil(this.state.currentTime)):"0: 0"}</span>
            <Slider
              style={{ margin:".5rem 0rem 0 0.5rem"}}
              defaultValue={0}
              min={0}
              value={this.state.currentTime}
              max={this.props.audio?Math.ceil(this.props.audio.duration):100}
              trackStyle={{
                backgroundColor: '#C20C0C',
                height: '.1rem',
              }}
              railStyle={{
                backgroundColor: '#666',
                height: '.1rem',
              }}
              handleStyle={{
                borderColor: '#ccc',
                height: '1rem',
                width: '1rem',
                marginLeft: '-8px',
                marginTop: '-7px',
                backgroundColor: '#ccc',
              }}
            />
            <span style={{fontSize:".6rem"}}>{this.props.audio?formatSeconds(Math.ceil(this.props.audio.duration)):"0: 0"}</span>
          </div>
          <div className={'plancopy'}>
            <span></span>
            <Slider
              style={{ margin:".5rem 0rem 0 0.5rem"}}
              onAfterChange={(v)=>this.planChange(v)}
              defaultValue={0}
              min={0}
              max={this.props.audio?Math.ceil(this.props.audio.duration):100}
              trackStyle={{
                backgroundColor: '#C20C0C',
                height: '.1rem',
              }}
              railStyle={{
                backgroundColor: '#666',
                height: '.1rem',
              }}
              handleStyle={{
                borderColor: '#ccc',
                height: '1rem',
                width: '1rem',
                marginLeft: '-8px',
                marginTop: '-7px',
                backgroundColor: '#ccc',
              }}
            />
            <span></span>
          </div>
        </div>
      </div>
    )
  }
}
function formatSeconds(value) {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  //var theTime2 = 0;// 小时
  if(theTime > 60) {
    theTime1 = parseInt(theTime/60);
    theTime = parseInt(theTime%60);
    if(theTime1 > 60) {
      //theTime2 = parseInt(theTime1/60);
      theTime1 = parseInt(theTime1%60);
    }
  }
  var result = ""+parseInt(theTime);
    result = ""+parseInt(theTime1)+": "+result;
  // if(theTime2 > 0) {
  //   result = ""+parseInt(theTime2)+"小时"+result;
  // }
  return result?result:'0 .0';
}

