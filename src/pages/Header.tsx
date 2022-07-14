import { LanguageContext } from '../contexts/LanguageContext'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Typography } from 'antd'
import { UserContext } from '../contexts/UserContext'
import { networkErrorMessage, setNetworkErrorMessageFalse } from '../App'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
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

  const dispatch = useDispatch()

  useEffect(() => {
    setIsAdmin(inRole('ROLE_ADMIN'))
    setIsLoggedIn(email !== '')
  }, [email, inRole])

  useEffect(() => {
    if (networkErrorMessage) {
      dispatch(setMessage(getExpression('anErrorHappend')))
      setNetworkErrorMessageFalse()
    }
    // eslint-disable-next-line
  }, [networkErrorMessage])

  const logout = () => {
    logoutUser()
    navigate('/admin')
  }

  return (
    <>
      <Title>{getExpression('danekFamily')}</Title>
      <Message />
      {networkErrorMessage}
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
          <Link to='/admin/'>{getExpression('header.welcome')}</Link>
        </Menu.Item>
        {isLoggedIn && (
          <Menu.Item key={'changePassword_menu_01'}>
            <Link to='/admin/change_password'>{getExpression('header.changePassword')}</Link>
          </Menu.Item>
        )}
        {isLoggedIn && (
          <Menu.Item key={'changeLogin_menu_01'}>
            <Link to='/admin/user'>{getExpression('header.user')}</Link>
          </Menu.Item>
        )}
        {isLoggedIn || (
          <>
            <Menu.Item key={'login_menu_02'}>
              <Link to='/admin/login'>{getExpression('header.login')}</Link>
            </Menu.Item>
            <Menu.Item key={'login_menu_03'}>
              <Link to='/admin/registration'>{getExpression('header.registration')}</Link>
            </Menu.Item>
          </>
        )}
        {isAdmin && (
          <>
            <Menu.Item key={'registration_menu_03'}>
              <Link to='/admin/introduction'>{getExpression('header.introduction')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_04'}>
              <Link to='/admin/articles'>{getExpression('header.articles')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_05'}>
              <Link to='/admin/jobs'>{getExpression('header.jobs')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_06'}>
              <Link to='/admin/education'>{getExpression('header.education')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_07'}>
              <Link to='/admin/residency'>{getExpression('header.residency')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_08'}>
              <Link to='/admin/patent'>{getExpression('header.patents')}</Link>
            </Menu.Item>
            <Menu.Item key={'registration_menu_09'}>
              <Link to='/admin/homepage'>{getExpression('header.preview')}</Link>
            </Menu.Item>
          </>
        )}
      </Menu>
    </>
  )
}

const LanguageWrapper = styled.div`
  transform: translate(40rem, -4rem);
  display: inline-block;
`

export default Header
