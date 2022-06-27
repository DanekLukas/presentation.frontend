import { LanguageContext } from '../Contexts/LanguageContext'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import { UserContext } from '../Contexts/UserContext'
import Language from './Language'
import Logged from './Logged'
import Message from '../components/Message'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'

const { Title, Paragraph, Link: Lnk } = Typography

const Header = () => {
  const { getExpression } = useContext(LanguageContext)
  const { email, logoutUser, inRole } = useContext(UserContext)
  const [isLoggedIn, setIsLoggedIn] = useState(email !== '')
  const [isAdmin, setIsAdmin] = useState(inRole('ROLE_ADMIN'))
  const navigate = useNavigate()

  useEffect(() => {
    setIsAdmin(inRole('ROLE_ADMIN'))
    setIsLoggedIn(email !== '')
  }, [email, inRole])

  const logout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <>
      <Title>{getExpression('danekFamily')}</Title>
      <Message />
      <LanguageWrapper>
        <Logged />
        <Language />
        {isLoggedIn && (
          <Paragraph>
            <Lnk onClick={logout}>{getExpression('logout')}</Lnk>
          </Paragraph>
        )}
      </LanguageWrapper>
      <Menu mode='horizontal'>
        <Menu.Item key={'article_menu_01'}>
          <Link to='/'>{getExpression('header.articles')}</Link>
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item key={'changePassword_menu_05'}>
            <Link to='/change_password'>{getExpression('header.changePassword')}</Link>
          </Menu.Item>
        )}
        {isLoggedIn || (
          <>
            <Menu.Item key={'login_menu_02'}>
              <Link to='/login'>{getExpression('header.login')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_03'}>
              <Link to='/registration'>{getExpression('header.registration')}</Link>
            </Menu.Item>
          </>
        )}
        {isAdmin && (
          <Menu.Item key={'registration_menu_04'}>
            <Link to='/articles'>{getExpression('header.articles')}</Link>
          </Menu.Item>
        )}
      </Menu>
    </>
  )
}

const LanguageWrapper = styled.div`
  transform: translate(20rem, -4rem);
  display: inline-block;
`

export default Header
