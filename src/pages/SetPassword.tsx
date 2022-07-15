import { Button, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { MessageContext } from '../contexts/MessageContext'
import { UserContext } from '../contexts/UserContext'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import styled from '@emotion/styled'

const mutations = {
  setPasswordMutation: gql`
    mutation SetPassword($id: Int, $password: String, $newPassword: String) {
      SetPassword(id: $id, password: $password, newPassword: $newPassword) {
        error
        data {
          id
          email
        }
        message
      }
    }
  `,
}

type Props = {
  token: string
}

const SetPassword = ({ token }: Props) => {
  const params = token && token.split('-', 2)

  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const { loginUser } = useContext(UserContext)

  const { getExpression } = useContext(LanguageContext)
  const { setMessage } = useContext(MessageContext)

  const [passwordMutation] = useMutation(mutations.setPasswordMutation, {
    onCompleted: data => {
      if (data.SetPassword?.error === 0) {
        loginUser({
          id: data.SetPassword.data.id,
          email: data.SetPassword.data.email,
          roles: ['ROLE_USER', 'ROLE_ADMIN'],
          remember: true,
        })

        navigate('/admin')
      } else {
        setMessage(getExpression(data.SetPassword?.message))
      }
    },
  })

  const navigate = useNavigate()

  const onFinish = () => {
    try {
      if (password !== checkPassword) {
        throw new Error('passwordDiffers')
      }
      if (password.length < 6) {
        throw new Error('passwordTooShort')
      }
      if (password.match(/\s/g) !== null) {
        throw new Error('password')
      }
      passwordMutation({
        variables: {
          id: parseInt(params[0]),
          password: params[1],
          newPassword: password,
        },
      })
      navigate('/admin')
    } catch (e) {
      setMessage(getExpression(e.getMessage()))
    }
  }

  return (
    <FormStyled onFinish={onFinish}>
      <Form.Item
        label={getExpression('password')}
        rules={[
          {
            required: true,
            message: getExpression('enterPassword'),
          },
        ]}
      >
        <Input.Password onChange={e => setPassword(e.target.value)} style={{ width: '16rem' }} />
      </Form.Item>

      <Form.Item
        label={getExpression('checkPassword')}
        rules={[
          {
            required: true,
            message: getExpression('enterPassword'),
          },
        ]}
      >
        <Input.Password
          onChange={e => setCheckPassword(e.target.value)}
          style={{ width: '16rem' }}
        />
      </Form.Item>
      <Button type='primary' htmlType='submit'>
        {getExpression('submit')}
      </Button>
    </FormStyled>
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
    width: 8rem;
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
    transform: translateX(8rem);
  }
`

export default SetPassword
