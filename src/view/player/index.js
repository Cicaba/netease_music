import React, { Component } from 'react';
import './index.scss'
import axios from '../../plugin/axios'
import store from "../../store/state";

export default class player extends Component{
  constructor(props){
    super(props)
  }
  //播放暂停
  play(e) {
    let audio = this.refs.audio;
    if(audio.paused){
      e.target.className = "icon-pause"
      audio.play()
    }else{
      e.target.className = "icon-play"
      audio.pause()
    }
  }
  player(){
    let play = this.refs.play;
    let audio = this.refs.audio;
    if(audio.paused){
      play.className = "icon-pause"
      audio.play()
    }else{
      play.className = "icon-play"
      audio.pause()
    }
  }
  Ended(type){
    let i;
    if(type == 'next'){
      i = store.getState().beforePlay.index
    }else if(type == 'before'){
      i = store.getState().beforePlay.index-2
    }
    let data = store.getState().beforePlay.allItem[i]
    if(data){
      axios.get("/song/url",{params:{
        id:data.id
        }}).then(res=>{
        data.playItem=res.data.data[0];
        store.dispatch({type:"beforePlay",data:{...data,allItem:store.getState().beforePlay.allItem}})
        this.refs.play.className = "icon-pause"
        this.refs.audio.play()
      })
    }
  }
  render(){
    return (
      <div className={"player"}>
        <div>
          <img src={store.getState().beforePlay?store.getState().beforePlay.al.picUrl:''}/>
        </div>
        <audio onEnded={()=>this.Ended('next')} ref="audio" src={store.getState().beforePlay?store.getState().beforePlay.playItem.url:""}></audio>
        <div className="control">
          <div className={"content"}>
            <span style={{fontWeight:"900",fontSize:"1rem"}}>{store.getState().beforePlay?store.getState().beforePlay.name:""}</span>
            <br/>
            {
              store.getState().beforePlay && store.getState().beforePlay.ar.map(v=>{
                return <span key={v.id} style={{fontSize:"1rem"}}>{v.name} </span>
              })
            }
          </div>
          <div className={"handle"}>
            <span onClick={()=>this.Ended("before")} className={"icon-to-start"}></span>
            <span ref={"play"} onClick={(e)=>{this.play(e)}} className={"icon-play"}></span>
            <span onClick={()=>this.Ended("next")} className={"icon-to-end"}></span>
          </div>
        </div>
      </div>
    )
  }
}