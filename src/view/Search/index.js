import React, {Component} from 'react';
import './index.scss'
import {SearchBar, List} from 'antd-mobile';
import store from "../../store/state";
import {ActionSheet, Modal} from "antd-mobile/lib/index";
import axios from "../../plugin/axios";

export default class DetailPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchList: []
    }
  }

  componentDidMount() {

  }

  search(value) {
    if (value) {
      axios.get('/search?keywords=' + (value)).then(res => {
        res.data.result.songs.map((v, i,arr) => {
          v.index = i + 1
          v.ar = v.artists
          v.al = v.album
          v.pname = '搜索'
          v.pid = null
          v.loveid = store.getState().userData.loveid
          v.trackCount = arr.length
          v.al.picUrl = v.album.artist.img1v1Url
        })
        this.setState({
          searchList: res.data.result.songs
        })
      })
    }
  }

  playItem(item, arr) {
    axios.get("/song/url", {
      params: {
        id: item.id
      }
    }).then(res => {
      item.playItem = res.data.data[0];
      item.PlayMode = store.getState().beforePlay.PlayMode ? store.getState().beforePlay.PlayMode : 'icon-exchange'
      //获取歌词
      axios.get('/lyric', {
        params: {
          id: item.id
        }
      }).then(res => {
        store.dispatch({
          type: "beforePlay",
          data: {...store.getState().beforePlay, lrc: res.data.lrc ? res.data.lrc.lyric : ""}
        })

      })
      store.dispatch({type: "beforePlay", data: {...item, allItem: arr, play: true}})
      store.getState().audio.play()
    })
  }

  //操作歌曲
  showActionSheet(e, v) {
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

  render() {

    return (
      <div className={'Search'}>
        <SearchBar cancelText={"确定"} onCancel={(v) => {
          this.search(v)
        }} onSubmit={(v) => {
          this.search(v)
        }}  placeholder="Search" maxLength={30}/>
        <List>
          {
            this.state.searchList.map((v, i, arrData) => {
              return (<List.Item onClick={() => this.playItem(v, arrData)} key={v.id}
                                 thumb={(<span style={{fontSize: "1rem"}}>{i + 1}</span>)}
                                 extra={(<span style={{fontSize: "1.2rem"}} onClick={(e) => this.showActionSheet(e, v)}
                                               className="icon-ellipsis-vert"></span>)}>
                <span style={{fontSize: "1rem"}}>{v.name}</span>
              </List.Item>)
            })
          }
        </List>
      </div>
    )
  }
}



