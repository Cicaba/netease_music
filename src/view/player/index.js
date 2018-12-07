import React, { Component } from 'react';
import './index.scss'
import axios from '../../plugin/axios'
import store from "../../store/state";

export default class player extends Component{
  constructor(props){
    super(props)
  }

  componentDidMount() {
    store.dispatch({type:"audio",data:this.refs.audio})
  }

  //播放暂停
  play(e) {
    e&&e.stopPropagation()
    let audio = this.refs.audio;
    if(audio.paused){
      e.target.className = "icon-pause"
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,play:true}})
      audio.play()
    }else{
      e.target.className = "icon-play"
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,play:false}})
      audio.pause()
    }
  }
  player(){
    let play = this.refs.play;
    let audio = this.refs.audio;
    if(audio.paused){
      play.className = "icon-pause"
      audio.play()
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,play:true}})
    }else{
      play.className = "icon-play"
      audio.pause()
      store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,play:false}})
    }
  }
  //歌曲切换
  Ended(e,type,auto){
    let _this = this;
    e&&e.stopPropagation()
    let i;
    //自动播放
    if(auto ==='auto'){
      //随机播放
      if(store.getState().beforePlay.PlayMode==='icon-shuffle'){
        //随机播放
        i = parseInt(Math.random()*store.getState().beforePlay.trackCount)
      }else if(store.getState().beforePlay.PlayMode==='icon-loop'){
        //单曲循环
        i = store.getState().beforePlay.index-1;
      }else{
        i = store.getState().beforePlay.index
      }
    }else{
      if(type === 'next'){
        //随机播放
        if(store.getState().beforePlay.PlayMode==='icon-shuffle'){
          //随机播放
          i = parseInt(Math.random()*store.getState().beforePlay.trackCount)
        }else{
          i = store.getState().beforePlay.index
        }
      }else if(type == 'before'){
        if(store.getState().beforePlay.PlayMode==='icon-shuffle'){
          //随机播放
          i = parseInt(Math.random()*store.getState().beforePlay.trackCount)
        }else{
          i = store.getState().beforePlay.index-2
        }
      }
    }

    let data = store.getState().beforePlay.allItem[i] ? store.getState().beforePlay.allItem[i] : [];
    if(data){
      axios.get("/song/url",{params:{
        id:data.id
        }}).then(res=>{
        data.playItem=res.data.data[0];
        //获取歌词
          axios.get('/lyric', {
            params: {
              id: data.id
            }
          }).then(res => {
            let dataState = {
              ...data,
              lrc:res.data.lrc?res.data.lrc.lyric:null,
              allItem:store.getState().beforePlay.allItem,
              play:true,
              PlayMode:store.getState().beforePlay.PlayMode?store.getState().beforePlay.PlayMode:'icon-exchange',
            }
            store.dispatch({type:"beforePlay",data:dataState})
            _this.refs.play.className = "icon-pause"
            _this.refs.audio.play()
          })

      })
    }
  }
  //明细播放器
  DetailPlayer(e){
    if(e.target.className.indexOf('icon')>0) return
    store.dispatch({type:'DetailPlayer',data:true})
    // this.props.DetailPlayer(store.getState().beforePlay)
  }
  render(){
    return (
      <div className={"player"} style={store.getState().beforePlay.al?{}:{display:'none'}} onClick={(e)=>this.DetailPlayer(e)}>
        <div>
          <img src={store.getState().beforePlay.al?store.getState().beforePlay.al.picUrl:''}/>
        </div>
        <audio onEnded={(e)=>this.Ended(e,'next','auto')} ref="audio" src={store.getState().beforePlay.playItem?store.getState().beforePlay.playItem.url:""}></audio>
        <div className="control">
          <div className={"content"}>
            <span style={{fontWeight:"900",fontSize:"1rem"}}>{store.getState().beforePlay.name?store.getState().beforePlay.name:""}</span>
            <br/>
            {
              store.getState().beforePlay.ar && store.getState().beforePlay.ar.map(v=>{
                return <span key={v.id} style={{fontSize:"1rem"}}>{v.name} </span>
              })
            }
          </div>
          <div className={"handle"}>
            <span onClick={(e)=>this.Ended(e,"before")} className={"icon-to-start"}></span>
            <span ref={"play"} onClick={(e)=>{this.play(e)}} className={!store.getState().beforePlay.play ? "icon-play" : "icon-pause"}></span>
            <span onClick={(e)=>this.Ended(e,"next")} className={"icon-to-end"}></span>
          </div>
        </div>
      </div>
    )
  }
}