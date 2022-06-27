export const SET_MESSAGE_TYPE: 'message/SET_MESSAGE' = 'message/SET_MESSAGE'
export const setMessage = (message: string, timeout: number = 3000) => ({
  type: SET_MESSAGE_TYPE,
  message,
  timeout,
})

export const REMOVE_MESSAGE_TYPE: 'message/REMOVE_MESSAGE' = 'message/REMOVE_MESSAGE'
export const removeMessage = (messageId: string) => ({
  type: REMOVE_MESSAGE_TYPE,
  messageId,
})

export const RESET_TIMEOUTS_TYPE: 'message/RESET_TIMEOUTS_MESSAGE' =
  'message/RESET_TIMEOUTS_MESSAGE'
export const resetTimeouts = () => ({
  type: RESET_TIMEOUTS_TYPE,
})

export type MessageAction =
  | ReturnType<typeof setMessage>
  | ReturnType<typeof removeMessage>
  | ReturnType<typeof resetTimeouts>
