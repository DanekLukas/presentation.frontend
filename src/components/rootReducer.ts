import { combineReducers } from 'redux'
import messageReducer from './Message/messageReducer'

const rootReducer = combineReducers({
  message: messageReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default rootReducer
