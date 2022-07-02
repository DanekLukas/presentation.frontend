import { Button, Form, Input, Select } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'

const query = {
  introduction: gql`
    query getIntroduction($language: String) {
      getIntroduction(language: $language) {
        error
        data {
          content
          language
        }
        message
      }
    }
  `,
}

const mutation = {
  introduction: gql`
    mutation saveIntroduction($language: String, $content: String) {
      saveIntroduction(language: $language, content: $content) {
        error
        data
        message
      }
    }
  `,
}

const Introduction = () => {
  const { getExpression } = useContext(LanguageContext)
  const [language, setLanguage] = useState('cs')
  const [content, setContent] = useState<string>()
  const dispatch = useDispatch()
  const { Option } = Select
  const [introductionMutation] = useMutation(mutation.introduction, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: data => {
      dispatch(setMessage(data.saveIntroduction.data))
    },
  })
  const { refetch: refetchIntroduction } = useQuery(query.introduction, {
    variables: { language },
    onCompleted: data => {
      if (data.getIntroduction.error) {
        dispatch(setMessage(getExpression(data.getIntroduction.message)))
        return
      }
      setContent(data.getIntroduction.data.content)
    },
  })

  useEffect(() => {
    refetchIntroduction()
  }, [language])

  const onFinish = () => {
    introductionMutation({
      variables: {
        language: language,
        content: content,
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
        label={getExpression('Introduction')}
        rules={[
          {
            required: true,
            message: getExpression('EnterIntroduction'),
          },
        ]}
      >
        <Input.TextArea
          onChange={({ target: { value } }) => {
            setContent(value)
          }}
          value={content}
        />
      </Form.Item>

      <Form.Item
        label={getExpression('Language')}
        rules={[
          {
            required: true,
            message: getExpression('ChooseLanguage'),
          },
        ]}
      >
        <Select
          defaultValue={'cs'}
          onChange={(value: string) => {
            setLanguage(value)
          }}
          value={language}
        >
          {['en', 'cs'].map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
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

export default Introduction
