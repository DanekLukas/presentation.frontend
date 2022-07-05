import { Button, Checkbox, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { Typography } from 'antd'
import { UserContext } from '../contexts/UserContext'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import styled from '@emotion/styled'

const query = {
  login: gql`
    query Login($email: String, $password: String) {
      Login(email: $email, password: $password) {
        error
        data {
          id
          email
          roles
        }
        message
      }
    }
  `,
}

const { Link } = Typography

const Login = () => {
  const navigate = useNavigate()
  const { getExpression } = useContext(LanguageContext)
  const { email: mail, loginUser, logoutUser } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const dispatch = useDispatch()
  const { refetch: login } = useQuery(query.login, {
    skip: true,
    onCompleted: data => {
      if (data.Login.error) {
        dispatch(setMessage(getExpression(data.Login.message)))
        return
      }
      loginUser({
        id: data.Login.data.id,
        email: data.Login.data.email,
        roles: data.Login.data.roles,
        remember: remember,
      })
    },
  })

  const onFinish = () => {
    login({
      email: email,
      password: password,
    })
    return
  }

  const onFinishFailed = () => {
    return
  }

  return (
    <>
      {mail ? (
        <p onClick={logoutUser}>{getExpression('logout')}</p>
      ) : (
        <FormStyled
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label={getExpression('email')}
            rules={[
              {
                required: true,
                message: getExpression('EnterYourEmail'),
              },
            ]}
          >
            <Input
              onChange={e => {
                setEmail(e.currentTarget.value)
              }}
              value={email}
            />
          </Form.Item>

          <Form.Item
            label={getExpression('password')}
            rules={[
              {
                required: true,
                message: getExpression('enterYourPassword'),
              },
            ]}
          >
            <Input.Password
              onChange={e => {
                setPassword(e.currentTarget.value)
              }}
              value={password}
              style={{ width: '16rem' }}
            />
          </Form.Item>

          <Form.Item valuePropName='checked'>
            <Checkbox
              style={{ width: '16rem', transform: 'translateX(5rem)' }}
              checked={remember}
              onChange={() => setRemember(!remember)}
            >
              {getExpression('rememberMe')}
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {getExpression('submit')}
            </Button>
          </Form.Item>
        </FormStyled>
      )}
      <LinkToReset onClick={() => navigate('/reset_password')}>
        {getExpression('forgottenPassword')}
      </LinkToReset>
    </>
  )
}

const FormStyled = styled(Form)`
  margin-top: 1rem !important;

  & > div {
    width: 26rem;
    display: flex;
    flex-direction: row;
  }

  & > div > div > label {
    display: block;
    width: 5rem;
    text-align: right;
    transform: translateY(3px);
  }

  & > div > div > label::first-letter {
    text-transform: uppercase;
  }

  input {
    width: 16rem;
  }

  button {
    transform: translateX(5rem);
  }
`

const LinkToReset = styled(Link)`
  display: block;
  transform: translate(15rem, -5rem);
`

export default Login
