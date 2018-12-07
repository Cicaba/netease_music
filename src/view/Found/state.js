import { connect } from 'react-redux';
import Index from './index';

const mapStateToProps = state => {
  return { state: state };
};

const mapDispatchToProps = dispatch => {
  return {
    loginState: (Obj) => dispatch(Obj),
  };
};

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(Index);

export default VisibleTodoList;