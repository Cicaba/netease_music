import React, { Component } from 'react';
import { List } from 'antd-mobile';
import Loading from '../../plugin/Loading'
import PlayList from"../PlayList/index"
import './index.scss'
import axios from '../../plugin/axios'

class Song extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist:[],
      playDetail:{},
      loading:false
    };
  }

   componentWillMount(){
    axios.get("/user/playlist",{params:{uid:this.props.id}}).then(res=>{
       this.setState({
         playlist:res.data.playlist
       })
    })
  }

  song(){
    return(
      this.state.playlist.map(v=>{
        return (
          <List.Item
            key={v.coverImgId}
            thumb={v.coverImgUrl}
            arrow="horizontal"
            onClick={() => {this.PlayDetail(v.id)}}
          >{v.name}</List.Item>
        )
      })
    )
  }
  PlayDetail(id){
    this.setState({
      loading:true
    })
    axios.get("/playlist/detail",{params:{"id":id}}).then(res=>{
      res.data.playlist.tracks.forEach((v,i)=>{
        v.index = i+1
      })
      this.setState({
        playDetail:res.data.playlist,
        loading:false
      })
    }).catch(()=>{
      this.setState({
        loading:false
      })
    })
  }
  renderHeader(){
    return(
      <div className="headerList">
        歌单
        <span className={"icon-cog"}></span>
      </div>
    )
  }
  back(){
    this.setState({
      playDetail:{}
    })
  }
  play(item,arr){
    this.props.play(item,arr)
  }
  render() {
    return (
      <div className={"Song"}>
        <List>
          <List.Item
            thumb={(<span style={{fontSize:"1.2rem"}} className="icon-play-circled2"></span>)}
            arrow="horizontal"
            onClick={() => {}}
          >播放历史</List.Item>
          <List.Item
            thumb={(<span style={{fontSize:"1.2rem"}} className="icon-dropbox"></span>)}
            arrow="horizontal"
            onClick={() => {}}
          >我的收藏</List.Item>
        </List>
        <List renderHeader={this.renderHeader()}>
          {this.song()}
        </List>
        <PlayList playDetail={this.state.playDetail} back={()=>{this.back()}} play={(item,arr)=>{this.play(item,arr)}}></PlayList>
        <Loading loading={this.state.loading}></Loading>
      </div>
    );
  }
}
export default Song;
