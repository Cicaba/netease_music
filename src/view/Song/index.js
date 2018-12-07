import React, {Component} from 'react';
import {List,Popover,Modal,Toast} from 'antd-mobile';
import PropTypes from 'prop-types'
import PlayList from "../PlayList/index"
import './index.scss'
import axios from '../../plugin/axios'
import store from "../../store/state";

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      playDetail: {},
      loading: false,
      visible:false
    };
  }
  static contextTypes = {
    loading: PropTypes.func
  }
  componentWillMount() {
    //用户歌单
    axios.get("/user/playlist", {params: {uid: store.getState().userData.profile.userId}}).then(res => {
      this.setState({
        playlist: res.data.playlist
      },()=>{
        store.dispatch({type:"loveid",data:this.state.playlist[0].id})
      })
    })
  }

  //渲染列表
  song() {
    return (
      this.state.playlist.map(v => {
        return (
          <List.Item
            key={v.coverImgId}
            thumb={v.coverImgUrl}
            arrow="horizontal"
            onClick={() => {
              this.PlayDetail(v)
            }}
          >{v.name}</List.Item>
        )
      })
    )
  }

  //列表详情
  PlayDetail(item) {
    this.context.loading(true)
    axios.get("/playlist/detail", {params: {"id": item.id}}).then(res => {
      res.data.playlist.tracks.forEach((v, i) => {
        v.index = i + 1;
        v.pid = item.id;
        v.pname = item.name;
        v.loveid = this.state.playlist[0].id;
        v.trackCount = res.data.playlist.trackCount;
      })
      this.setState({
        playDetail: res.data.playlist
      })
      this.context.loading(false)
    }).catch(() => {
      this.context.loading(false)
    })
  }

  //列表头部
  renderHeader() {
    return (
      <div className="headerList">
        歌单
        <Popover mask
                 overlayClassName="fortest"
                 overlayStyle={{color: 'currentColor'}}
                 visible={this.state.visible}
                 overlay={[
                   (<div onClick={()=>this.Add()} style={{padding:'.2rem .4rem'}}>+ 新增歌单</div>)
                 ]}
                 align={{
                   overflow: {adjustY: 0, adjustX: 0},
                   offset: [0, 10],
                 }}
        >
          <span className={"icon-cog"}></span>
        </Popover>
      </div>
    )
  }
  Add(){
    this.setState({
      visible:false
    },()=>{
      Modal.prompt('歌单名称','',
        [
          {
            text: '取消'
          },
          {
            text: '确认',
            onPress: value => new Promise((resolve, reject) => {
              if(!value){
                Toast.info('input your song', 1);
              }else{
                axios.get('/playlist/create',{
                  params:{name:value}
                }).then(()=>{
                  Toast.info('创建成功! 2分钟后刷新后即可', 2);
                  resolve()
                }).catch(()=>{
                  Toast.info('创建失败!', 1);
                })
              }
            }),
          },
        ], 'default', null, ['input your song'])
    })
  }
  //返回
  back() {
    this.setState({
      playDetail: {}
    })
  }


  //播放历史
  history() {
    this.context.loading(true)
    axios.post("/user/record", {
      type: 1,
      uid: store.getState().userData.profile.userId
    })
      .then(res => {
        res.data.weekData.forEach((v, i) => {
          v.song.index = i + 1;
          v.song.pid = null
          v.song.pname = '播放历史'
          v.song.loveid = this.state.playlist[0].id
          v.song.trackCount = res.data.weekData.length
        })
        let playDetail = {
          name: "播放历史"
        };
        playDetail.tracks = res.data.weekData.map(v => {
          return v.song
        })
        this.setState({
          playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }

  //每日推荐
  daily() {
    this.context.loading(true)
    axios.post("/recommend/songs")
      .then(res => {
        let playDetail = {
          name: "每日推荐",
          // coverImgUrl: res.data.recommend[0].album.picUrl
        };
        playDetail.tracks = res.data.recommend.map((v, i) => {
          return {
            index: i + 1,
            ar: v.artists,
            al: v.album,
            pname: '每日推荐',
            pid: null,
            loveid: this.state.playlist[0].id,
            trackCount: res.data.recommend.length,
            ...v
          }
        })
        this.setState({
          playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }

  //推荐新歌
  newSong() {
    this.context.loading(true)
    axios.post("/personalized/newsong")
      .then(res => {
        let playDetail = {
          name: "推荐新歌",
          // coverImgUrl: res.data.result[0].song.album.picUrl
        };
        playDetail.tracks = res.data.result.map((v, i) => {
          return {
            index: i + 1,
            ar: v.song.artists,
            al: v.song.album,
            pname: '推荐新歌',
            pid: null,
            loveid: this.state.playlist[0].id,
            trackCount: res.data.recommend.length,
            ...v
          }
        })
        this.setState({
          playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }

  render() {
    return (
      <div className={"Song"}>
        <List>
          <List.Item
            thumb={(<span style={{fontSize: "1.2rem"}} className=" icon-snowflake-o"></span>)}
            arrow="horizontal"
            onClick={() => {
              this.newSong()
            }}
          >推荐新歌</List.Item>
          <List.Item
            thumb={(<span style={{fontSize: "1.2rem"}} className="icon-thumbs-up-alt"></span>)}
            arrow="horizontal"
            onClick={() => {
              this.daily()
            }}
          >每日推荐</List.Item>
          <List.Item
            thumb={(<span style={{fontSize: "1.2rem"}} className="icon-play-circled2"></span>)}
            arrow="horizontal"
            onClick={() => this.history()}
          >播放历史</List.Item>
        </List>
        <List renderHeader={this.renderHeader()}>
          {this.song()}
        </List>
        <PlayList playDetail={this.state.playDetail} back={() => {
          this.back()
        }}></PlayList>
      </div>
    );
  }
}

export default Song;
