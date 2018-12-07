// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置
import Tab from '../view/Tab/state';
import Login from '../view/Login/state';
import Song from '../view/Song/index';
import Found from "../view/Found/state";
import Event from "../view/Event/state";
// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

const routerConfig = [
  {
    path: '/',
    component: Tab,
    children:[
      {
        path: '/Song',
        component: Song,
      },
      {
        path:"/Found",
        component: Found,
      },
      {
        path:"/Event",
        component: Event,
      }
    ]
  },
  {
    path: '/Login',
    component: Login
  }
  ];

export default routerConfig;