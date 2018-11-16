import { connect } from 'react-redux';
import Index from './index';

const mapStateToProps = state => {
  return { state: {} };
};

const mapDispatchToProps = dispatch => {
  return {
    loginState: (Obj) => dispatch(Obj),
    screenWidth: (Obj) => dispatch(Obj),
    screenHeight: (Obj) => dispatch(Obj),
    userData: (Obj) => dispatch(Obj)
  };
};

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(Index);

export default VisibleTodoList;