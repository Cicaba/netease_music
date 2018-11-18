/**
 * @date 2018/11/15
 * @author Cicaba
 * @Description:
*/
import React,{Component} from 'react'
import { Flex,Picker,List,InputItem,Button,Toast } from 'antd-mobile';
import axios from '../../plugin/axios'
import Loading from '../../plugin/Loading'
import './index.scss'
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      way: 2,
      loading:false
    }
  }

  componentDidMount(){
    this.props.screenHeight({"type":"screenHeight","data":document.body.clientHeight});
    this.props.screenWidth({"type":"screenWidth","data":document.body.clientWidth});
  }

  Picker(e) {
    this.setState({
      way: e[0]
    })
  }

  Login() {
    let url;
    if (this.state.way==1) {
      url=`/login/cellphone?phone=${this.refs.userName.state.value}&password=${this.refs.passwrod.state.value}`
    }else{
      url=`/login?email=${this.refs.userName.state.value}&password=${this.refs.passwrod.state.value}`
    }
    this.setState({
      loading:true
    })
    axios.get(url).then(res=>{
      this.setState({
        loading:false
      },()=>{
        this.props.loginState({"type":"loginState",data:true});
        this.props.userData({type:"userData",data:{
            account:res.data.account,
            bindings:res.data.bindings,
            profile:res.data.profile,
          }})
        this.props.history.replace('/');
      })
    }).catch(()=>{
      this.setState({
        loading:false
      })
      Toast.info('登陆失败 !!!', 2);
    })
  }
  render() {
    return (
      <div className="Login">
        <Flex align={"center"} justify={"center"}>
          <Flex.Item>
            <List>
              <InputItem ref="userName" defaultValue={"Cicaba@163.com"} clear={true} placeholder="账户">
                <Picker cols={1} onChange={(e)=>{this.Picker(e)}} value={this.state.way} data={[{value:1,label:"手机登陆"},{value:2,label:"邮箱登陆"}]}>
                  <List.Item arrow="horizontal" style={{width:"12rem"}}>{this.state.way==1?'手机登陆':'邮箱登陆'}</List.Item>
                </Picker>
              </InputItem>
            </List>
            <InputItem ref="passwrod" defaultValue={""} clear={true} type={"password"} placeholder="密码"></InputItem>
            <Button type="primary" onClick={()=>{this.Login()}}>登陆</Button>
          </Flex.Item>
        </Flex>
        <Loading loading={this.state.loading}/>
      </div>
    )
  }
}