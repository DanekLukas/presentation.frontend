import { Button, Form, Input } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { MessageContext } from '../contexts/MessageContext'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import isEmail from 'validator/lib/isEmail'
import styled from '@emotion/styled'

const mutation = {
  resetpassword: gql`
    mutation resetPassword($email: String, $lang: String) {
      Resetpassword(email: $email, lang: $lang) {
        error
        data
        message
      }
    }
  `,
}

const Registration = () => {
  const navigate = useNavigate()
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [email, setEmail] = useState('')

  const { setMessage } = useContext(MessageContext)

  const [resetPasswordMutation] = useMutation(mutation.resetpassword, {
    onError: error => {
      console.error(error)
    },
    onCompleted: data => {
      if (data.Resetpassword.error) {
        setMessage(getExpression(data.Resetpassword.message))
      } else {
        navigate('/admin')
      }
    },
  })

  const onFinish = () => {
    if (!isEmail(email)) {
      setMessage(getExpression('notValidEmail'))
      return
    }
    resetPasswordMutation({
      variables: {
        email,
        lang: getLanguage(),
      },
    })
    setMessage(getExpression('emailSentForReset').replace('__email__', email))
    return
  }

  const onFinishFailed = () => {
    return
  }

  return (
    <>
      <FormStyled
        name='basic'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label={getExpression('email')}
          rules={[
            {
              required: true,
              message: getExpression('enterEmail'),
            },
          ]}
        >
          <Input onChange={e => setEmail(e.target.value)} value={email} />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {getExpression('submit')}
          </Button>
        </Form.Item>
      </FormStyled>
    </>
  )
}

const FormStyled = styled(Form)`
  padding: 2rem;

  & > div {
    width: 22rem;
    display: flex;
    flex-direction: row;
  }

  & > div > div > label {
    display: block;
    width: 4rem;
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
    transform: translateX(4rem);
  }
`

export default Registration
