import React, {Component} from 'react';
import {Modal, List, ActionSheet, Toast} from 'antd-mobile';
import './index.scss'
import axios from '../../plugin/axios'
import store from "../../store/state";

export default class PlayList extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
  }

  playItem(item, arr) {
    axios.get("/song/url", {
      params: {
        id: item.id
      }
    }).then(res => {
      item.playItem = res.data.data[0];
      item.PlayMode = store.getState().beforePlay.PlayMode?store.getState().beforePlay.PlayMode:'icon-exchange'
      //获取歌词
      axios.get('/lyric', {
        params: {
          id: item.id
        }
      }).then(res => {
        store.dispatch({type:"beforePlay",data:{...store.getState().beforePlay,lrc:res.data.lrc?res.data.lrc.lyric:""}})

      })
      store.dispatch({type: "beforePlay", data: {...item, allItem: arr,play:true}})
      store.getState().audio.play()
    })
  }

  //添加歌单
  handle(item, v) {
    axios.get("/playlist/tracks", {
      params: {
        op: "add",
        pid: item.id,
        tracks: v.id
      }
    }).then(res => {
      Toast.info('已成功添加到' + item.name + "歌单 !", 3);
    }).catch(() => {
      Toast.info('添加失败! 歌曲以存在' + item.name + "歌单 !", 3);
    })
  }

  //删除歌单
  Delete(v) {
    axios.get("/playlist/tracks", {
      params: {
        op: "del",
        pid: v.pid,
        tracks: v.id
      }
    }).then(res => {
      Toast.info('歌曲成功移除!', 3);
    }).catch(() => {
      Toast.info('歌曲移除失败!', 3);
    })
  }

  //操作歌曲
  showActionSheet(e,v) {
    e.stopPropagation();
    const BUTTONS = ['收藏到歌单', '删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        message: `歌曲 ${v.name}`,
        maskClosable: true,
        'data-seed': 'logId',
      },
      (buttonIndex) => {
        if (BUTTONS[buttonIndex] === '收藏到歌单') {
          axios.get("/user/playlist", {params: {uid: store.getState().userData.profile.userId}}).then(res => {
            let arr = res.data.playlist.map(item => {
              return {text: item.name, onPress: () => this.handle(item, v)}
            })
            Modal.operation(arr)
          })
        } else if (BUTTONS[buttonIndex] === '删除') {
          Modal.alert('移除该歌单', '是否确定该操作???', [
            {
              text: '取消', onPress: () => {
              }
            },
            {text: '确定', onPress: () => this.Delete(v)},
          ])
        }
      });
  }

  SongList() {
    if (this.props.playDetail.tracks) {
      let arr = [(
        <List.Item activeStyle={{paddingLeft: '0rem'}}
                   onClick={() => this.playItem(this.props.playDetail.tracks[0], this.props.playDetail.tracks)}
                   key={"播放全部"} thumb={(<span style={{fontSize: "1.2rem"}} className="icon-play-circled2"></span>)}
                   extra={(<span style={{fontSize: "1.2rem"}} className="icon-menu"></span>)}>
          播放全部 {this.props.playDetail.trackCount}
        </List.Item>
      )]
      this.props.playDetail.tracks.map((v, i, arrData) => {
        arr.push((
          <List.Item onClick={() => this.playItem(v, arrData)} key={v.id}
                     thumb={(<span style={{fontSize: "1rem"}}>{i + 1}</span>)}
                     extra={(<span style={{fontSize: "1.2rem"}} onClick={(e) => this.showActionSheet(e,v)}
                                   className="icon-ellipsis-vert"></span>)}>
            <span style={{fontSize: "1rem"}}>{v.name}</span>
          </List.Item>
        ))
      })
      return arr;
    }
  }

  render() {
    const size = {
      height: store.getState().screenHeight + 'px', width: store.getState().screenWidth + 'px',
    }
    return (
      <div className={this.props.playDetail.tracks ? 'PlayList fade-in' : "PlayList fade-out"} style={size}>
        <div className={"header"}>
          <span onClick={this.props.back} className={"icon-left"}></span>
          <span style={{fontSize: "1rem"}}>{this.props.playDetail.name}</span>
          <span onClick={(e)=>{e.stopPropagation();Toast.info('请去客服端操作!', 2);}} className={"icon-ellipsis-vert"}></span>
        </div>
        <div style={store.getState().beforePlay.al?{height: store.getState().screenHeight - 7 * 16 + "px"}:{height: store.getState().screenHeight + "px"}}>
          <div className={"headImg"} style={this.props.playDetail.coverImgUrl ? {} : {display: "none"}}>
            <img src={this.props.playDetail.coverImgUrl}/>
            <div className={"message"}>
              <div>{store.getState().userData.profile.nickname}</div>
            </div>
          </div>
          <List>
            {this.SongList()}
          </List>
        </div>
      </div>
    )
  }
}
