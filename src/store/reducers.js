import defaultState from './defaultState'
export default (state=defaultState,action)=>{
  switch (action.type) {
    case 'screenWidth':
      return { ...state, screenWidth: action.data };
    case 'screenHeight':
      return { ...state, screenHeight: action.data };
    case 'loginState'://登录状态
      return { ...state, loginState: action.data };
    case 'userData'://登陆使用
      return { ...state, userData: {...action.data,detail:state.userData.detail} };
    case 'beforePlay':
      return { ...state, beforePlay: action.data };
    case 'userDataDetail'://首页使用
      return { ...state, userData: {...state.userData,detail:action.data} };
    case 'audio':
      return { ...state, audio: action.data };
    case 'loveid':
      return { ...state, userData: {...state.userData,loveid:action.data} };
      case 'DetailPlayer':
      return { ...state, DetailPlayer: action.data };
    default:
      return state;
  }
}