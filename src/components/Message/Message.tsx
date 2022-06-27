import { getMessages, getTimeouts } from './messageReducer'
import { removeMessage, resetTimeouts } from './messageActionCreators'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import styled from '@emotion/styled'

const Message = () => {
  const dispatch = useDispatch()
  const messages = useSelector(getMessages, shallowEqual)
  const timeouts = useSelector(getTimeouts, shallowEqual)

  useEffect(() => {
    Object.keys(timeouts).forEach((key: string) => {
      return setTimeout(
        (key: string) => {
          dispatch(removeMessage(key))
        },
        timeouts[key],
        key
      )
    })
    dispatch(resetTimeouts())
  }, [timeouts, dispatch])

  return (
    <MessageMessage>
      {Object.keys(messages).map(message => (
        <div key={message}>{messages[message]}</div>
      ))}
    </MessageMessage>
  )
}

const MessageMessage = styled.div`
  position: fixed;
  z-index: 3;
  width: 100%;

  & > div {
    display: block;
    position: relative;
    border: 1px solid black;
    background-color: #ffffffaa;
    width: calc(100% - 2rem);
    padding: 0.2rem 1rem;
  }
`

export default Message
