import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'

const query = {
  getUser: gql`
    query getUserByLogin($login: String) {
      getUserByLogin(login: $login) {
        error
        data {
          name
        }
        message
      }
    }
  `,
}

type Props = {
  name: string
}

const User = ({ name }: Props) => {
  const dispatch = useDispatch()
  const [user, setUser] = useState<string>()
  const { Title } = Typography

  const { refetch: refetchUserData } = useQuery(query.getUser, {
    variables: { login: name },
    onCompleted: data => {
      if (data.getUserByLogin.error) {
        dispatch(setMessage(data.getUserByLogin.message))
        return
      }
      setUser(data.getUserByLogin.data.name)
    },
  })

  useEffect(() => {
    refetchUserData()
  }, [refetchUserData])

  return <Title level={2}>{user}</Title>
}

export default User
