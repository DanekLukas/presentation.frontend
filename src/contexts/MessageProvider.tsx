import { MessageContext } from './MessageContext'

import React, { ReactNode, useState } from 'react'

type Msg = Record<number, string>

type Props = {
  children: ReactNode
  fn: React.MutableRefObject<(message: string, timeout?: number) => void>
}

const MessageProvider = ({ children, fn }: Props) => {
  const [messages, setMessages] = useState<Msg>({})

  const setMessage = (message: string, timeout: number = 5000) => {
    const tmp = { ...messages }
    const id = Date.now()
    tmp[id] = message
    setTimeout(
      id => {
        setMessages(messages => {
          const tmp = { ...messages }
          delete tmp[id]
          return tmp
        })
      },
      timeout,
      id
    )
    setMessages(tmp)
  }

  fn.current = setMessage

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export default MessageProvider
