import React, { Component } from 'react';
import { List } from 'antd-mobile';
import './index.scss'
import axios from '../../plugin/axios'
import store from "../../store/state";

export default class PlayList extends Component{
  constructor(props){
    super(props)
    this.state={}
  }

  componentDidMount() {
  }
  playItem(item,arr){
    axios.get("/song/url",{params:{
      id:item.id
    }}).then(res=>{
      item.playItem=res.data.data[0];
      this.props.play(item,arr)
    })
  }
  SongList(){
    if(this.props.playDetail.tracks){
      let arr=[(
        <List.Item activeStyle={{paddingLeft:'0rem'}} onClick={()=>this.playItem(this.props.playDetail.tracks[0],this.props.playDetail.tracks)} key={"播放全部"} thumb={(<span style={{fontSize:"1.2rem"}} className="icon-play-circled2"></span>)} extra={(<span style={{fontSize:"1.2rem"}} className="icon-menu"></span>)}>
          播放全部 {this.props.playDetail.trackCount}
        </List.Item>
      )]
      this.props.playDetail.tracks.map((v,i,arrData)=>{
        arr.push((
          <List.Item onClick={()=>this.playItem(v,arrData)} key={v.id} thumb={(<span style={{fontSize:"1rem"}}>{i+1}</span>)} extra={(<span style={{fontSize:"1.2rem"}} className="icon-ellipsis-vert"></span>)}>
            <span style={{fontSize:"1rem"}}>{v.name}</span>
          </List.Item>
        ))
      })
      return arr;
    }
  }
  render(){
    const size = {
      height:store.getState().screenHeight+'px',width:store.getState().screenWidth+'px',
    }
    return (
      <div className={this.props.playDetail.name?'PlayList fade-in':"PlayList fade-out"} style={size}>
          <div className={"header"}>
            <span onClick={this.props.back} className={"icon-left"}></span>
            <span style={{fontSize:"1rem"}}>{this.props.playDetail.name}</span>
            <span className={"icon-ellipsis-vert"}></span>
          </div>
          <div style={{height:store.getState().screenHeight-7*16+"px"}}>
            <div className={"headImg"}>
              <img src={this.props.playDetail.coverImgUrl} />
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