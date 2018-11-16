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
      return { ...state, userData: action.data };
    default:
      return state;
  }
}