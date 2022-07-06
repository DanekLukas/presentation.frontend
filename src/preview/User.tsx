import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'

const query = {
  getUser: gql`
    query getLogin {
      getLogin {
        error
        data {
          name
        }
        message
      }
    }
  `,
}

const User = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState<string>()
  const { Title } = Typography

  const { refetch: refetchUserData } = useQuery(query.getUser, {
    skip: true,
    onCompleted: data => {
      if (data.getLogin.error) {
        dispatch(setMessage(data.getLogin.message))
        return
      }
      setUser(data.getLogin.data.name)
    },
  })

  useEffect(() => {
    refetchUserData()
  }, [refetchUserData])

  return <Title level={2}>{user}</Title>
}

export default User
