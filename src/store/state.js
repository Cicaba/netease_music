import {createStore} from 'redux'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers'
//redux数据持久化
let persistedReducer = persistReducer({ key: 'auto', storage }, reducers);
export default createStore(persistedReducer);