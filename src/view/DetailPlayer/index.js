import React, {Component} from 'react';
import './index.scss'
import {Slider, Flex} from 'antd-mobile';
import imgurl from '../../imgs/唱片.png'
import store from "../../store/state";
import {Toast} from "antd-mobile/lib/index";
import axios from "../../plugin/axios";
import LRC from 'lrc.js'

export default class DetailPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      PlayMode: {'icon-exchange': "列表循环", 'icon-loop': '单曲循环', 'icon-shuffle': "随机播放"},
      currentTime: 0,
      lrc: null,
      currentLine: []
    }
  }

  componentDidMount() {
    store.subscribe(()=>{
      if(store.getState().beforePlay.play){
        this.currentTime = setInterval(() => {
          this.setState({
            currentTime: store.getState().audio.currentTime
          })
          if (store.getState().beforePlay.lrc) {
            let lrc = new LRC(store.getState().beforePlay.lrc)
            this.setState({
              currentLine: [
                {...lrc.previousLine(this.state.currentTime), class: "top"},
                {...lrc.currentLine(this.state.currentTime), class: "center"},
                {...lrc.nextLine(this.state.currentTime), class: "bottom"}
              ]
            })
          }
        }, 1000)
      }else{
        clearInterval(this.currentTime)
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {

    return true
  }


//喜欢的音乐
  love() {
    if (store.getState().beforePlay.loveid === store.getState().beforePlay.pid) {
      axios.get("/playlist/tracks", {
        params: {
          op: "del",
          pid: store.getState().beforePlay.loveid,
          tracks: store.getState().beforePlay.id
        }
      }).then(res => {
        store.dispatch({type: "beforePlay", data: {...store.getState().beforePlay, pid: null}})
        Toast.info('成功移除喜欢歌单!', 2);
      }).catch(() => {
        Toast.info('歌曲移除失败!', 2);
      })
    } else {
      axios.get("/playlist/tracks", {
        params: {
          op: "add",
          pid: store.getState().beforePlay.loveid,
          tracks: store.getState().beforePlay.id
        }
      }).then(res => {
        store.dispatch({
          type: "beforePlay",
          data: {...store.getState().beforePlay, pid: store.getState().beforePlay.loveid}
        })
        Toast.info("已成功添加到喜欢的歌单歌单!", 2)
      }).catch(() => {
        Toast.info("添加失败! 歌曲以存在歌单内!", 3);
      })
    }
  }

  //播放
  DetailPlay() {
    if (store.getState().beforePlay.play) {
      store.getState().audio.pause();
      store.dispatch({type:'beforePlay',data:{...store.getState().beforePlay,play:false}})
      clearInterval(this.currentTime)
    } else {
      store.getState().audio.play();
      store.dispatch({type:'beforePlay',data:{...store.getState().beforePlay,play:true}})
    }
  }
  playCut(type){
    let _this = this;
    let i;
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
          if(!res.data.lrc){
            this.setState({
              currentLine:[]
            })
          }
          let dataState = {
            ...data,
            lrc:res.data.lrc?res.data.lrc.lyric:null,
            allItem:store.getState().beforePlay.allItem,
            play:true,
            PlayMode:store.getState().beforePlay.PlayMode?store.getState().beforePlay.PlayMode:'icon-exchange',
          }
          store.dispatch({type:"beforePlay",data:dataState})
          store.getState().audio.play()
        })

      })
    }
  }


  //设置进度
  planChange(v) {
    this.setState({
      currentTime: v
    })
    store.getState().audio.currentTime = v;
  }

  //设置音量
  volumeChange(v) {
    store.getState().audio.volume = v / 100;
  }

  //播放模式
  PlayMode() {
    let ModeKeys = Object.keys(this.state.PlayMode);
    let index = ModeKeys.indexOf(store.getState().beforePlay.PlayMode ? store.getState().beforePlay.PlayMode : "icon-exchange");
    if (ModeKeys[index + 1]) {
      store.dispatch({type: "beforePlay", data: {...store.getState().beforePlay, PlayMode: ModeKeys[index + 1]}})
    } else {
      store.dispatch({type: "beforePlay", data: {...store.getState().beforePlay, PlayMode: ModeKeys[0]}})
    }
    Toast.info(this.state.PlayMode[store.getState().beforePlay.PlayMode], 2);
  }

  render() {
    let bag = {
      backgroundImage: `url(${store.getState().beforePlay.al ? store.getState().beforePlay.al.picUrl : ''})`,
      backgroundSize: `${store.getState().screenWidth + 'px'} ${store.getState().screenHeight + 'px'}`
    }
    return (
      <div className={store.getState().DetailPlayer ? 'DetailPlayer fade-in' : 'DetailPlayer fade-out'}
           style={store.getState().DetailPlayer ? {...bag, display: 'block'} : {...bag, display: 'none'}}>
        <div className={'mask'}>
          <div className={'head'}>
            <span className={'icon-left'} onClick={()=>{store.dispatch({type:'DetailPlayer',data:false})}}></span>
            <span className={"text"}> {store.getState().beforePlay.name ? store.getState().beforePlay.name : ""}</span>
            <span className={"author"}>&nbsp;
              {
                store.getState().beforePlay.ar && store.getState().beforePlay.ar.map(v => {
                  return <span key={v.name}>{v.name} </span>
                })
              }
            </span>
          </div>
          <div className={'volume'}>
            <span className={'icon-volume-up'}></span>
            <Slider
              style={{margin: ".5rem 1rem 0 2rem"}}
              defaultValue={100}
              onAfterChange={(v) => this.volumeChange(v)}
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
          <div className={store.getState().beforePlay.play ? 'disc rotate paused' : "disc rotate"}>
            <img src={imgurl} alt=""/>
            <div className={'img'}>
              <img src={store.getState().beforePlay.al ? store.getState().beforePlay.al.picUrl : ''} alt=""/>
            </div>
          </div>
          {/*歌词*/}
          <div className='lrc'>
            {this.state.currentLine.map((v, i) => {
              return (<p key={v.time + String(i)} className={v.class}>
                {v.text}
              </p>)
            })}
          </div>
          <Flex className={'control'}>
            <Flex.Item onClick={() => {
              this.love()
            }} style={{fontSize: "1.4rem"}}
                       className={store.getState().beforePlay.loveid === store.getState().beforePlay.pid ? "icon-heart-filled" : "icon-heart-1"}></Flex.Item>
            <Flex.Item onClick={()=>this.playCut("before")} className={"icon-to-start"}></Flex.Item>
            <Flex.Item onClick={() => this.DetailPlay(true)}
                       className={!store.getState().beforePlay.play ? "icon-play" : "icon-pause"}></Flex.Item>
            <Flex.Item onClick={()=>this.playCut("next")} className={"icon-to-end"}></Flex.Item>
            <Flex.Item style={{fontSize: "1.2rem"}} onClick={() => this.PlayMode()}
                       className={store.getState().beforePlay.PlayMode ? store.getState().beforePlay.PlayMode : "icon-exchange"}></Flex.Item>
          </Flex>
          <div className={'plan'}>
            <span
              style={{fontSize: ".6rem"}}>{this.state.currentTime ? formatSeconds(Math.ceil(this.state.currentTime)) : "0: 0"}</span>
            <Slider
              style={{margin: ".5rem 0rem 0 0.5rem"}}
              defaultValue={0}
              min={0}
              value={this.state.currentTime}
              max={store.getState().audio ? Math.ceil(store.getState().audio.duration) : 100}
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
            <span
              style={{fontSize: ".6rem"}}>{store.getState().audio ? formatSeconds(Math.ceil(store.getState().audio.duration)) : "0: 0"}</span>
          </div>
          <div className={'plancopy'}>
            <span></span>
            <Slider
              style={{margin: ".5rem 0rem 0 0.5rem"}}
              onAfterChange={(v) => this.planChange(v)}
              defaultValue={0}
              min={0}
              max={store.getState().audio ? Math.ceil(store.getState().audio.duration) : 100}
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
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      //theTime2 = parseInt(theTime1/60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime);
  result = "" + parseInt(theTime1) + ": " + result;
  // if(theTime2 > 0) {
  //   result = ""+parseInt(theTime2)+"小时"+result;
  // }
  return value ? result : '0 .0';
}

