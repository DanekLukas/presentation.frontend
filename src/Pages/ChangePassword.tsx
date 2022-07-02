import { Button, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { UserContext } from '../contexts/UserContext'
import { gql, useMutation } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
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

const ChanagePassword = () => {
  const [originalPassword, setOriginalPassword] = useState('')
  const [password, setPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const { getUser } = useContext(UserContext)

  const { getExpression } = useContext(LanguageContext)
  const dispatch = useDispatch()

  const [passwordMutation] = useMutation(mutations.setPasswordMutation, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: data => {
      if (data.SetPassword?.error === 0) {
        dispatch(setMessage(getExpression('passwordChanged')))
        setOriginalPassword('')
        setPassword('')
        setCheckPassword('')
      } else {
        dispatch(setMessage(getExpression(data.SetPassword?.message)))
      }
    },
  })

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
          id: parseInt(getUser().id),
          password: originalPassword,
          newPassword: password,
        },
      })
    } catch (e) {
      dispatch(setMessage(getExpression(e.getMessage())))
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
        <Input.Password
          value={originalPassword}
          onChange={e => setOriginalPassword(e.target.value)}
          style={{ width: '16rem' }}
        />
      </Form.Item>

      <Form.Item
        label={getExpression('newPassword')}
        rules={[
          {
            required: true,
            message: getExpression('enterPassword'),
          },
        ]}
      >
        <Input.Password
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '16rem' }}
        />
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
          value={checkPassword}
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
  padding: 2rem;

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

export default ChanagePassword
