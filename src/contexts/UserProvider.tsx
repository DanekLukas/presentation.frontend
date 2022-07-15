import { LanguageContext } from './LanguageContext'
import { MessageContext } from '../contexts/MessageContext'
import { UserContext } from './UserContext'
import { gql, useMutation } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'

const USER_STORAGE_KEY = 'USER'

const mutation = {
  logout: gql`
    mutation Logout {
      logout {
        error
        data
        message
      }
    }
  `,
}

const noUser = {
  id: '',
  email: '',
  roles: [] as Array<string>,
  remember: false,
}

type Props = {
  children: React.ReactNode
}

export type LoginUserProps = {
  id: string
  email?: string
  roles?: Array<string>
  remember?: boolean
}

const UserProvider = ({ children }: Props) => {
  const { getExpression } = useContext(LanguageContext)
  const { setMessage } = useContext(MessageContext)
  const [logoutMutation] = useMutation(mutation.logout, {
    onError: error => {
      // console.error(error)
    },
    onCompleted: data => {
      if (data.logout.error === 0) {
        setMessage(getExpression(data.logout.data))
      } else {
        setMessage(getExpression(data.logout.message))
      }
    },
  })

  const [email, setEmail] = useState('')
  const loginUser = ({ id, email = '', roles = [], remember = false }: LoginUserProps) => {
    const payload = btoa(`${id}#${email}#${roles.join('$')}`)
    setEmail(email)

    if (remember) {
      localStorage.setItem(USER_STORAGE_KEY, payload)
    } else {
      sessionStorage.setItem(USER_STORAGE_KEY, payload)
    }
  }

  const logoutUser = () => {
    logoutMutation()
    localStorage.removeItem(USER_STORAGE_KEY)
    sessionStorage.removeItem(USER_STORAGE_KEY)
    document.cookie = 'logged_in= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'

    setEmail('')
  }

  const inRole = (role: string) => {
    const sessionItem = sessionStorage.getItem(USER_STORAGE_KEY)
    const localItem = localStorage.getItem(USER_STORAGE_KEY)
    const item = sessionItem || localItem
    if (!item) {
      return false
    }
    const user = atob(item).split('#')

    if (user.length < 3) {
      return false
    }
    const roles = user[2].split('$')
    return roles.includes(role)
  }

  const getUser = (): LoginUserProps => {
    const sessionItem = sessionStorage.getItem(USER_STORAGE_KEY)
    const localItem = localStorage.getItem(USER_STORAGE_KEY)
    const item = sessionItem || localItem

    if (!item) {
      return noUser
    }

    const [id, email, roles] = atob(item).split('#')

    if (!id || !email || !roles) {
      return noUser
    }

    return { id: id || '', email, roles: roles.split('$'), remember: Boolean(localItem) }
  }

  useEffect(() => {
    setEmail(getUser().email)
  }, [])

  return (
    <UserContext.Provider
      value={{
        loginUser,
        logoutUser,
        getUser,
        inRole,
        email,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
