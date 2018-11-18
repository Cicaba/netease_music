import { connect } from 'react-redux';
import Index from './index';

const mapStateToProps = state => {
  return { state: state };
};

const mapDispatchToProps = dispatch => {
  return {
    beforePlay:(Obj) => dispatch(Obj),
    loginState: (Obj) => dispatch(Obj),
    screenWidth: (Obj) => dispatch(Obj),
    screenHeight: (Obj) => dispatch(Obj),
    userDataDetail: (Obj) => dispatch(Obj)
  };
};

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(Index);

export default VisibleTodoList;