import * as React from 'react'
import { LanguageContext } from '../Contexts/LanguageContext'
import { UserContext } from '../Contexts/UserContext'
import { useContext } from 'react'

const Logged = () => {
  const { getExpression } = useContext(LanguageContext)
  const { email } = useContext(UserContext)
  return <div>{email || getExpression('youAreNotLoggedIn')}</div>
}

export default Logged
