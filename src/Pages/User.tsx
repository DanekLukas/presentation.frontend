import { Button, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'

const query = {
  login: gql`
    query getLogin {
      getLogin {
        error
        data {
          login
          introduction
        }
        message
      }
    }
  `,
}

const mutation = {
  login: gql`
    mutation setLogin($login: String, $password: String, $introduction: String) {
      setLogin(login: $login, password: $password, introduction: $introduction) {
        error
        data
        message
      }
    }
  `,
}

const User = () => {
  const { getExpression } = useContext(LanguageContext)
  const [login, setLogin] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [introduction, setIntroduction] = useState<string>()
  const dispatch = useDispatch()
  const [loginMutation] = useMutation(mutation.login, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: data => {
      dispatch(setMessage(data.setLogin.data))
    },
  })
  const { refetch: refetchLogin } = useQuery(query.login, {
    skip: true,
    onCompleted: data => {
      if (data.getLogin.error) {
        dispatch(setMessage(getExpression(data.getLogin.message)))
        return
      }
      setLogin(data.getLogin.data.login)
      setIntroduction(data.getLogin.data.introduction)
    },
  })

  useEffect(() => {
    refetchLogin()
  }, [refetchLogin])

  const onFinish = () => {
    loginMutation({
      variables: {
        login: login,
        password: password,
        introduction: introduction,
      },
    })
    return
  }

  const onFinishFailed = () => {
    return
  }

  return (
    <FormStyled
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item
        label={getExpression('Login')}
        rules={[
          {
            required: true,
            message: getExpression('EnterNewLogin'),
          },
        ]}
      >
        <Input
          onChange={({ target: { value } }) => {
            setLogin(value)
          }}
          value={login}
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
          onChange={({ target: { value } }) => {
            setPassword(value)
          }}
          value={password}
        />
      </Form.Item>

      <Form.Item
        label={getExpression('introduction')}
        rules={[
          {
            required: true,
            message: getExpression('enterIntroductionText'),
          },
        ]}
      >
        <Input.TextArea
          onChange={({ target: { value } }) => {
            setIntroduction(value)
          }}
          value={introduction || ''}
        />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {getExpression('submit')}
        </Button>
      </Form.Item>
    </FormStyled>
  )
}

const FormStyled = styled(Form)`
  padding: 2rem;

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

export default User
