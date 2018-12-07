import {createStore} from 'redux'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers'
//redux数据持久化
let config = {
  key: 'auto',
  storage,
  blacklist:['audio']
}

let persistedReducer = persistReducer(config, reducers);
export default createStore(persistedReducer);