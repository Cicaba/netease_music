import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Route} from 'react-router-dom'
import {Flex, Drawer, List, ActionSheet, Modal} from 'antd-mobile';
import Loading from '../../plugin/Loading'
import DetailPlayer from '../DetailPlayer/index';
import axios from '../../plugin/axios';
import './index.scss';
import {formatDate, newDate} from '../../plugin/date'
import store from "../../store/state";

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      TouchStart: [0, 0],
      TouchEnd: [0, 0],
      present: 1,
      DetailPlayer: null,
      SRTS: null,
      message: false,
      loading: false
    };
  }

  getChildContext() {
    return {
      loading: (f) => {
        this.setState({loading: f})
      }
    };
  }

  static childContextTypes = {
    loading: PropTypes.func
  }


  componentWillMount() {
    if (this.props.location.pathname === '/Found') {
      this.setState({
        present: 2
      })
    } else if (this.props.location.pathname === '/Song') {
      this.setState({
        present: 1
      })
    } else if (this.props.location.pathname === '/Event') {
      this.setState({
        present: 3
      })
    } else if (this.props.location.pathname === '/Search') {
      this.setState({
        present: 4
      })
    } else {
      this.props.history.replace('/Song');
    }
    this.props.screenHeight({"type": "screenHeight", "data": document.body.clientHeight});
    this.props.screenWidth({"type": "screenWidth", "data": document.body.clientWidth});
    let data = {
      ...this.props.state.beforePlay,
      play: this.props.state.audio ? !this.props.state.audio.paused : false
    }
    this.props.beforePlay({type: "beforePlay", data})
    if (!this.props.state.loginState) {
      this.props.history.replace('/Login');
    } else {
      axios.get('/user/detail', {params: {"uid": this.props.state.userData.profile.userId}}).then(res => {
        this.props.userDataDetail({"type": "userDataDetail", data: res.data})
      })
      //登陆状态
      axios.get('/login/status').catch(() => {
        this.props.loginState({type: "loginState", data: false});
        this.props.history.replace('/Login');
      })
    }
    let time = JSON.parse(localStorage.getItem('tiem'))
    if(time){
      if(+new Date()-time.now>1000*360*24){
        axios.get('/daily_signin').then(()=>{
          localStorage.setItem('tiem',JSON.stringify({now: +new Date()}))
        }).catch(()=>{
          localStorage.setItem('tiem',JSON.stringify({now: +new Date()}))
        })
      }
    }else{
      localStorage.setItem('tiem',JSON.stringify({now: +new Date()}))
    }

  }

  Drawer() {
    this.setState({
      open: true
    })
  }

  TouchStart(e) {
    let arr = [e.touches[0].pageX, e.touches[0].pageY]
    this.setState({
      TouchStart: arr
    })
  }

  TouchEnd(e) {
    let arr = [e.changedTouches[0].pageX, e.changedTouches[0].pageY]
    this.setState({
      TouchEnd: arr
    }, () => {
      if (getDirection(...this.state.TouchStart, ...this.state.TouchEnd) == 3) {
        this.setState({
          open: false
        })
      }
    });
  }

  sidebar() {
    if ('level' in this.props.state.userData.detail) {
      return (
        <div className={"sidebar"} onTouchStart={(e) => {
          this.TouchStart(e)
        }} onTouchEnd={(e) => {
          this.TouchEnd(e)
        }}>
          <div className={"bag"} style={{backgroundImage: `url(${this.props.state.userData.profile.backgroundUrl})`}}>
            <div className={"img"}>
              <img src={this.props.state.userData.profile.avatarUrl}></img>
            </div>
            <p>
              {this.props.state.userData.profile.nickname}
              &emsp;
              <span className="level">{this.props.state.userData.detail.level}</span>
              <span className="sign">自动签到</span>
            </p>
          </div>
          <List className={"menuList"}>
            <List.Item
              thumb={(<span style={{fontSize: "1.2rem"}} className="icon-safari"></span>)}
              arrow="horizontal"
              onClick={() => {
                const BUTTONS = ['15分钟', '30分钟', '45分钟', '1小时', '2小时', '取消定时', '取消'];
                ActionSheet.showActionSheetWithOptions({
                    options: BUTTONS,
                    cancelButtonIndex: BUTTONS.length - 1,
                    destructiveButtonIndex: BUTTONS.length - 2,
                    // title: 'title',
                    // message: `${this.state.SRTS}`,
                    maskClosable: true,
                    'data-seed': 'logId'
                  },
                  (buttonIndex) => {
                    let time = 0;
                    switch (BUTTONS[buttonIndex]) {
                      case '15分钟':
                        time = 60000 * 15;
                        break
                      case '30分钟':
                        time = 60000 * 30;
                        break
                      case "45分钟":
                        time = 60000 * 45;
                        break
                      case "1小时":
                        time = 60000 * 60;
                        break
                      case "2小时":
                        time = 60000 * 120;
                        break
                      default:
                        time = 0;
                        break
                    }
                    if (time) {
                      this.setTiem = setTimeout(() => {
                        this.props.beforePlay({
                          type: "beforePlay",
                          data: {...this.props.state.beforePlay, play: false}
                        });
                        store.getState().audio.pause()
                        clearTimeout(this.setval)
                        this.setState({
                          SRTS: null
                        })
                      }, time)
                      let _time = time - 60000 * 480;
                      if (this.setval) {
                        clearTimeout(this.setval)
                      }
                      this.setval = setInterval(() => {
                        _time -= 1000;
                        this.setState({
                          SRTS: formatDate(newDate(_time), 'hh:mm:ss')
                        })
                      }, 1000)
                    }
                    if (BUTTONS[buttonIndex] === '取消定时') {
                      clearTimeout(this.setTiem)
                      clearTimeout(this.setval)
                      this.setState({
                        SRTS: null
                      })
                    }
                  });
              }}
            >定时播放{this.state.SRTS}</List.Item>
            <List.Item
              thumb={(<span style={{fontSize: "1.2rem"}} className="icon-mail"></span>)}
              arrow="horizontal"
              onClick={() => {
                this.setState({
                  message: true
                })
              }}>
              基本信息
            </List.Item>
          </List>
          <Modal
            visible={this.state.message}
            transparent
            maskClosable={false}
            title=""
            footer={[{
              text: 'Ok', onPress: () => {
                this.setState({
                  message: false
                })
              }
            }]}
          >
            <div style={{height: 120, overflow: 'scroll'}}>
              作者: Cicaba<br/>
              联系方式: 1533436877@qq.com<br/>
              该音乐播放器为个人学习所用<br/>
              禁止商业用途<br/>
              音乐资源来自网易云音乐<br/>
            </div>
          </Modal>
          <Flex className='menu'>
            <Flex.Item>
            </Flex.Item>
            <Flex.Item>
            </Flex.Item>
            <Flex.Item className={"exit icon-reply-1"} onClick={() => this.exit()}>
              退出
            </Flex.Item>
          </Flex>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }


  //退出
  exit() {
    localStorage.removeItem('persist:auto');
    this.props.history.replace('/Login');
  }

  //返回
  back() {
    this.setState({
      DetailPlayer: null
    })
  }


  //明细播放器
  DetailPlayer(item) {
    this.refs.DetailPlay.DetailPlay(true)
    this.setState({
      DetailPlayer: item
    })
  }


  render() {
    return (
      <main className="App">
        <Drawer open={this.state.open} sidebar={this.sidebar()}>
          <nav className="TabBar">
            <Flex align={"center"}>
              <Flex.Item onClick={() => this.Drawer()} className="icon-menu"
                         style={this.state.present == 0 ? {color: "#fff"} : {}}></Flex.Item>
              <Flex.Item style={{flex: 4}}>
                <Flex style={{padding: "0 2rem 0 2rem"}}>
                  <Flex.Item onClick={() => {
                    this.setState({present: 1}, () => {
                      this.props.history.push('/Song')
                    })
                  }} className="icon-music" style={this.state.present == 1 ? {color: "#fff"} : {}}></Flex.Item>
                  <Flex.Item onClick={() => {
                    this.setState({present: 2}, () => {
                      this.props.history.push('/Found')
                    })
                  }} className="icon-music-1" style={this.state.present == 2 ? {color: "#fff"} : {}}></Flex.Item>
                  <Flex.Item onClick={() => {
                    this.setState({present: 3}, () => {
                      this.props.history.push('/Event')
                    })
                  }} className="icon-users" style={this.state.present == 3 ? {color: "#fff"} : {}}></Flex.Item>
                </Flex>
              </Flex.Item>
              <Flex.Item onClick={() => {
                this.setState({present: 4})
                this.props.history.push('/Search')
              }} className=" icon-search-1" style={this.state.present == 4 ? {color: "#fff"} : {}}></Flex.Item>
            </Flex>
          </nav>
        </Drawer>
        <Route path={this.props.match.url} render={() => this.props.children ? this.props.children : 'null'}></Route>
        {/*{this.props.children}*/}
        {/*<Player ref={"player"} DetailPlayer={(item) => this.DetailPlayer(item)}></Player>*/}
        <DetailPlayer ref={'DetailPlay'} DetailPlayer={this.state.DetailPlayer}
                      DetailPlayStart={() => this.DetailPlayStart()} DetailPlayEnd={() => this.DetailPlayEnd()}
                      DetailPlay={() => this.DetailPlay()} back={() => {
          this.back()
        }}></DetailPlayer>
        <Loading loading={this.state.loading}></Loading>
      </main>
    );
  }
}

//获得角度
function getAngle(angx, angy) {
  return Math.atan2(angy, angx) * 180 / Math.PI;
};

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
  var angx = endx - startx;
  var angy = endy - starty;
  var result = 0;

  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }

  var angle = getAngle(angx, angy);
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }

  return result;
}

export default Tab;
