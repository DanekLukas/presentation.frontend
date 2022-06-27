import * as actions from './messageActionCreators'
import { generateKey } from '../../utils/shared'
import produce from 'immer'

import { AppState } from '../rootReducer'

export type Message = {
  message: string
  timeout: number
}

export interface IMessageStatus {
  [index: string]: Message
}

const initialState: IMessageStatus = {}

const messageReducer = (
  message: IMessageStatus = initialState,
  action: actions.MessageAction
): IMessageStatus => {
  switch (action.type) {
    case actions.SET_MESSAGE_TYPE:
      const key = generateKey('pre')
      const msg: Message = {
        message: action.message,
        timeout: action.timeout,
      }
      return produce(message, draft => {
        draft[key] = msg
      })

    case actions.REMOVE_MESSAGE_TYPE:
      return produce(message, draft => {
        delete draft[action.messageId]
      })

    case actions.RESET_TIMEOUTS_TYPE:
      return produce(message, draft => {
        Object.keys(draft).forEach((key: string) => {
          draft[key].timeout = 0
        })
      })
  }
  return message
}

export const getMessages = (state: AppState) => {
  const res: { [index: string]: string } = {}
  Object.keys(state.message).forEach((key: string) => {
    res[key] = state.message[key].message
  })
  return res
}

export const getTimeouts = (state: AppState) => {
  const res: { [index: string]: number } = {}
  Object.keys(state.message).forEach((key: string) => {
    if (state.message[key].timeout > 0) {
      res[key] = state.message[key].timeout
    }
  })
  return res
}

export default messageReducer
