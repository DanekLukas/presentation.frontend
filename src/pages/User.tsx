import { Button, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { MessageContext } from '../contexts/MessageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'

const query = {
  login: gql`
    query getLogin {
      getLogin {
        error
        data {
          name
          login
        }
        message
      }
    }
  `,
}

const mutation = {
  login: gql`
    mutation setLogin($name: String, $login: String, $password: String) {
      setLogin(name: $name, login: $login, password: $password) {
        error
        data
        message
      }
    }
  `,
}

const User = () => {
  const { getExpression } = useContext(LanguageContext)
  const [name, setName] = useState<string>()
  const [login, setLogin] = useState<string>()
  const [password, setPassword] = useState<string>()
  const { setMessage } = useContext(MessageContext)
  const [loginMutation] = useMutation(mutation.login, {
    onError: error => {
      setMessage(error.message)
    },
    onCompleted: data => {
      setMessage(data.setLogin.data)
    },
  })
  const { refetch: refetchLogin } = useQuery(query.login, {
    skip: true,
    onCompleted: data => {
      if (data.getLogin.error) {
        setMessage(getExpression(data.getLogin.message))
        return
      }
      setName(data.getLogin.data.name)
      setLogin(data.getLogin.data.login)
    },
  })

  useEffect(() => {
    refetchLogin()
  }, [refetchLogin])

  const onFinish = () => {
    loginMutation({
      variables: {
        name: name,
        login: login,
        password: password,
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
        label={getExpression('Name')}
        rules={[
          {
            required: true,
            message: getExpression('EnterName'),
          },
        ]}
      >
        <Input
          onChange={({ target: { value } }) => {
            setName(value)
          }}
          value={name}
        />
      </Form.Item>

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
