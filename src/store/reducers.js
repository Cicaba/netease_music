import defaultState from './defaultState'
export default (state=defaultState,action)=>{
  switch (action.type) {
    case 'screenWidth':
      return { ...state, screenWidth: action.data };
    case 'screenHeight':
      return { ...state, screenHeight: action.data };
    case 'loginState':
      return { ...state, loginState: action.data };
    case 'userData':
      return { ...state, userData: {...action.data,detail:state.userData.detail} };
    case 'beforePlay':
      return { ...state, beforePlay: action.data };
    case 'userDataDetail':
      return { ...state, userData: {...state.userData,detail:action.data} };
    default:
      return state;
  }
}