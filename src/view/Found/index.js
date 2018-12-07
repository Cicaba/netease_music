/**
 * @date 2018/11/15
 * @author Cicaba
 * @Description:
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Flex, Tabs, List,Picker} from 'antd-mobile';
import axios from '../../plugin/axios'
import PlayList from "../PlayList/index"
import store from "../../store/state";
import './index.scss'

export default class Found extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: {},
      personalized: [],
      newList: [],
      district: [],
      Picker: [null],
      newSong: [],
      hotSong: [],
      radioRec: [],
      rankingList: []
    }
  }

  static contextTypes = {
    loading: PropTypes.func
  }

  componentDidMount() {
    let data = {
      ...this.props.state.beforePlay,
      play:!store.getState().audio.paused
    }
    store.dispatch({type:"beforePlay",data})
    axios.get('/personalized').then(res=>{
      this.setState({personalized:res.data.result})
    })
    axios.get('/top/playlist',{params:{
        order:"new"
      }}).then(res=>{
      this.setState({newList:res.data.playlists})
    })
    axios.get('/dj/recommend').then(res=>{
      this.setState({radioRec:res.data.djRadios})
    })
    //排行榜
    let id = 0
    let rankingArr = []
    let ranking=()=>{
      if(id>23){
        this.setState({rankingList:rankingArr})
        return
      }
      axios.get('/top/list',{params:{
          idx:id
        }}).then(res=>{
        rankingArr.push(res.data.playlist)
        id+=1
        ranking()
      })
    }
    ranking()
    this.getSong()
    axios.get('/playlist/catlist').then(res=>{
      let data = [{value:null,label:"全部歌单"}]
      let categoriesValue = Object.keys(res.data.categories)
      let categoriesLabel = Object.values(res.data.categories)
      categoriesValue.forEach((v,i)=>{
        let row = {value:categoriesLabel[i],label:categoriesLabel[i],children:[]}
        res.data.sub.forEach((item,j)=>{
          if(v==item.category){
            row.children.push({value:item.name,label:item.name})
          }
        })
        data.push(row)
      })
      this.setState({
        district:data
      })
    })
  }
  getSong(){
    axios.get('/top/playlist',{params:{
        cat:this.state.Picker[0]?this.state.Picker[1]:null
      }}).then(res=>{
      this.setState({hotSong:res.data.playlists})
    })
    axios.get('/top/playlist',{params:{
        order:"new",
        cat:this.state.Picker[0]?this.state.Picker[1]:null
      }}).then(res=>{
      this.setState({newSong:res.data.playlists})
    })
  }
  renderContent = tab => {
    if (tab.title === '个性推荐') {
      return (<div className='music'>{this.recommendation()}</div>)
    } else if (tab.title === '歌单') {
      return (<div className='music'>{this.song()}</div>)
    } else if (tab.title === '主播电台') {
      return (<div className='music'>{this.hostStation()}</div>)
    } else {
      return (<div className='music'>{this.top()}</div>)
    }
  }

  //个性推荐
  recommendation() {
    return (
      <div className={"recommendation"}>
        <Flex className={"tab"}>
          <Flex.Item onClick={() => this.PrivateFM()}>
            <div className="icon-credit-card-alt"></div>
            <div className={'size'}>私人FM</div>
          </Flex.Item>
          <Flex.Item onClick={() => this.recommend()}>
            <div className="icon-calendar"></div>
            <div className={'size'}>每日歌单推荐</div>
          </Flex.Item>
          <Flex.Item onClick={() => this.ranking()}>
            <div className="icon-chart"></div>
            <div className={'size'}>云音乐排行榜</div>
          </Flex.Item>
        </Flex>
        <List.Item>推荐歌单</List.Item>
        {
          this.state.personalized.map((v,i,arr)=>{
            if(i%3===0){
              return (
                <div className={"imgrow"} key={v.id}>
                  <div onClick={()=>{this.SongDetail(arr[i])}}>
                    <img src={arr[i].picUrl} alt=""/>
                    <div className={"text"}>{v.name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+1])}}>
                    <img src={arr[i+1].picUrl} alt=""/>
                    <div className={"text"}>{arr[i+1].name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+2])}}>
                    <img src={arr[i+2].picUrl} alt=""/>
                    <div className={"text"}>{arr[i+2].name}</div>
                  </div>
                </div>
              )
            }
          })
        }
        <List.Item>最新音乐</List.Item>
        {this.state.newList.map((v,i,arr)=>{
            if(i%3===0){
              return (
                <div className={"imgrow"} key={v.id}>
                  <div onClick={()=>{this.SongDetail(arr[i])}}>
                    <img src={arr[i].coverImgUrl} alt=""/>
                    <div className={"text"}>{v.name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+1])}}>
                    <img src={arr[i+1].coverImgUrl} alt=""/>
                    <div className={"text"}>{arr[i+1].name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+2])}}>
                    <img src={arr[i+2]?arr[i+2].coverImgUrl:null} alt=""/>
                    <div className={"text"}>{arr[i+2]?arr[i+2].name:null}</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  //歌单
  song() {
    return (
      <div className={"song"}>
        <Picker extra="请选择"
                value={this.state.Picker}
                cols={2}
                data={this.state.district}
                title="歌单分类"
                onPickerChange={e =>this.setState({Picker:e}) }
                onOk={e => this.getSong()}
                onDismiss={e => this.setState({Picker:[null]})}>
          <List.Item arrow="horizontal">歌单分类</List.Item>
        </Picker>
        <List.Item className={"Item"}>最热歌单</List.Item>
        {
          this.state.hotSong.map((v,i,arr)=>{
            if(i%2===0){
              return (
                <div className={"imgrow"} key={v.id}>
                  <div onClick={()=>{this.SongDetail(arr[i])}}>
                    <img src={arr[i].coverImgUrl} alt=""/>
                    <div className={"text"}>{v.name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+1])}}>
                    <img src={arr[i+1].coverImgUrl} alt=""/>
                    <div className={"text"}>{arr[i+1].name}</div>
                  </div>
                </div>
              )
            }
          })
        }
        <List.Item className={"Item"}>最新歌单</List.Item>
        {
          this.state.newSong.map((v,i,arr)=>{
            if(i%2===0){
              return (
                <div className={"imgrow"} key={v.id}>
                  <div onClick={()=>{this.SongDetail(arr[i])}}>
                    <img src={arr[i].coverImgUrl} alt=""/>
                    <div className={"text"}>{v.name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+1])}}>
                    <img src={arr[i+1].coverImgUrl} alt=""/>
                    <div className={"text"}>{arr[i+1].name}</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  //主播电台
  hostStation() {
    return(
    <div className={"song"}>
      <List.Item className={"Item"}>推荐电台</List.Item>
      {
        this.state.radioRec.map((v,i,arr)=>{
          if(i%2===0){
            return (
              <div className={"imgrow"} key={v.id}>
                <div onClick={()=>{this.radioRec(arr[i])}}>
                  <img src={arr[i].picUrl} alt=""/>
                  <div className={"text"}>{v.name}</div>
                </div>
                <div onClick={()=>{this.radioRec(arr[i+1])}}>
                  <img src={arr[i+1].picUrl} alt=""/>
                  <div className={"text"}>{arr[i+1].name}</div>
                </div>
              </div>
            )
          }
        })
      }
    </div>
    )
  }

  //排行榜
  top() {
    return(
      <div className={"song"}>
        {/*<List.Item className={"Item"}>推荐电台</List.Item>*/}
        {
          this.state.rankingList.map((v,i,arr)=>{
            if(i%2===0){
              return (
                <div className={"imgrow"} key={v.id}>
                  <div onClick={()=>{this.SongDetail(arr[i])}}>
                    <img src={arr[i].coverImgUrl} alt=""/>
                    <div className={"text"}>{v.name}</div>
                  </div>
                  <div onClick={()=>{this.SongDetail(arr[i+1])}}>
                    <img src={arr[i+1].coverImgUrl} alt=""/>
                    <div className={"text"}>{arr[i+1].name}</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  //私人FM
  PrivateFM() {
    let i = 10;
    let arr = []
    let recursive = () => {
      if (!i) {
        this.setState({
          playList: {
            tracks: arr,
            name: "私人FM"
          }
        })
        this.context.loading(false)
        return
      }
      this.context.loading(true)
      axios.get('/personal_fm?timestamp=' + +new Date()).then(res => {
        i -= 1;
        res.data.data.forEach((v,i,farr) => {
          v.ar = v.artists
          v.al = v.album
          v.pname = '私人FM'
          v.pid = null
          v.loveid = store.getState().userData.loveid
          v.trackCount = farr.length
          v.index = i+1
          arr.push(v)
        })
        recursive()
      })
    }
    recursive()
  }
  //每日推荐
  recommend(){
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
            loveid: store.getState().userData.loveid,
            trackCount: res.data.recommend.length,
            ...v
          }
        })
        this.setState({
          playList: playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }
  //云音乐排行
  ranking(){
    this.context.loading(true)
    axios.post("/top/list?idx=1")
      .then(res => {
        let playDetail = {
          name: "云音乐热歌榜",
        };
        playDetail.tracks = res.data.playlist.tracks.map((v, i) => {
          return {
            index: i + 1,
            pname: '云音乐热歌榜',
            pid: null,
            loveid: store.getState().userData.loveid,
            trackCount: res.data.playlist.tracks.length,
            ...v
          }
        })
        this.setState({
          playList: playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }
  //推荐歌单明细
  SongDetail(item){
    this.context.loading(true)
    axios.get("/playlist/detail",{params:{id:item.id,timestamp:+new Date()}})
      .then(res => {
        let playDetail = {
          name: item.name,
        };
        playDetail.tracks = res.data.playlist.tracks.map((v, i) => {
          return {
            index: i + 1,
            // ar: v.artists,
            // al: v.album,
            pname: item.name,
            pid: null,
            loveid: store.getState().userData.loveid,
            trackCount: res.data.playlist.tracks.length,
            ...v
          }
        })
        this.setState({
          playList: playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }
  //电台
  radioRec(item){
    this.context.loading(true)
    axios.get("/dj/program",{params:{rid:item.id,limit:1000,timestamp:+new Date()}})
      .then(res => {
        let playDetail = {
          name: item.name,
        };
        playDetail.tracks = res.data.programs.map((v, i) => {
          return {
            ...v,
            index: i + 1,
            ar: v.mainSong.artists,
            al: v.mainSong.album,
            pname: item.name,
            pid: null,
            id:v.mainSong.id,
            loveid: store.getState().userData.loveid,
            trackCount: res.data.programs.length
          }
        })
        playDetail.tracks=playDetail.tracks.reverse()
        this.setState({
          playList: playDetail
        })
        this.context.loading(false)
      }).catch(() => {
      this.context.loading(false)
    })
  }
  render() {
    return (
      <div className="found">
        <Tabs tabs={[{title: "个性推荐"}, {title: "歌单"}, {title: "主播电台"}, {title: "排行榜"}]}
              tabBarUnderlineStyle={{borderColor: '#C20C0C'}} tabBarActiveTextColor={'#C20C0C'}>
          {this.renderContent}
        </Tabs>
        <PlayList playDetail={this.state.playList} back={() => {
          this.setState({playList: {}})
        }}></PlayList>
      </div>
    )
  }
}