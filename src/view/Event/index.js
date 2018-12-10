/**
 * @date 2018/11/15
 * @author Cicaba
 * @Description:
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { PullToRefresh} from 'antd-mobile';
import axios from '../../plugin/axios'
import store from "../../store/state";
import './index.scss'

export default class Found extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      refreshing: false
    }
  }

  static contextTypes = {
    loading: PropTypes.func
  }

  componentDidMount() {
    this.getEvent()
  }

  getEvent(state) {
    axios.get("/event?timestamp=" + +new Date()).then(res => {
        res.data.event = res.data.event.map(v => {
          return {...v, json: JSON.parse(v.json)}
        })
        this.setState({
          event: res.data.event
        })
        state && this.setState({refreshing: false});
      }
    )
  }

  play(e,json,i) {
    document.querySelectorAll(".video").forEach(v=>{
      v.pause()
    })
    if (json.song) {
      axios.get("/song/url", {
        params: {
          id: json.song.id
        }
      }).then(res => {
        let data = {
          ...json.song,
          index: 1,
          ar: json.song.artists,
          al: json.song.album,
          pname: '动态',
          pid: null,
          loveid: store.getState().userData.loveid,
          trackCount: store.getState().beforePlay.allItem?store.getState().beforePlay.allItem.length + 1:1,
          play: true,
          allItem: store.getState().beforePlay.allItem?store.getState().beforePlay.allItem:[]
        }
        data.playItem = res.data.data[0];
        //获取歌词
        axios.get('/lyric', {
          params: {
            id: data.id
          }
        }).then(res => {
          data.lrc=res.data.lrc?res.data.lrc.lyric:null;
          store.dispatch({type: "beforePlay", data})
          store.getState().audio.play()
        })
      })
    }else{
      e.persist()
      axios.post("/video/url?timestamp=" + +new Date(),{id:json.video.videoId}).then(res=>{
        store.dispatch({type: "beforePlay", data:{...store.getState().beforePlay,play:false}})
        store.getState().audio.pause()
        e.target.parentNode.innerHTML='<video width="100%" height="202px" class="video" src="'+res.data.urls[0].url+'" controls="controls">'
      })
    }
  }

  render() {
    return (
      <div className="Event">
        <PullToRefresh
          damping={60}
          indicator={this.state.down ? {} : {deactivate: '上拉可以刷新'}}
          direction={"down"}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({refreshing: true});
            this.getEvent(true)
          }}
        >
          {this.state.event.map((v,i) => {
            return (<div className={'item'} key={v.id}>
              <div className={"user"}>
                <img src={v.user.avatarUrl} alt=""/>
                <span>{v.user.nickname}</span>
                <div>{v.json.msg}</div>
              </div>
              <div className={"msg"}>
                <img onClick={(e) => this.play(e,v.json,i)}
                     src={v.json.video ? v.json.video.coverUrl : v.json.song?v.json.song.album.blurPicUrl:""} alt=""/>
                <div className={v.json.video?"icon-play":""}></div>
              </div>
            </div>)
          })}
        </PullToRefresh>
      </div>
    )
  }
}