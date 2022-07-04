import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const query = {
  getIntroduction: gql`
    query getIntroductionByLogin($login: String, $language: String) {
      getIntroductionByLogin(login: $login, language: $language) {
        error
        data {
          content
        }
        message
      }
    }
  `,
}

type Props = {
  name: string
}

const Introduction = ({ name }: Props) => {
  const dispatch = useDispatch()
  const { getLanguage } = useContext(LanguageContext)
  const [Introduction, setIntroduction] = useState<string>()

  const { refetch: refetchIntroductionData } = useQuery(query.getIntroduction, {
    variables: { login: name, language: getLanguage() },
    onCompleted: data => {
      if (data.getIntroductionByLogin.error) {
        dispatch(setMessage(data.getIntroductionByLogin.message))
        return
      }
      setIntroduction(data.getIntroductionByLogin.data.content)
    },
  })

  useEffect(() => {
    refetchIntroductionData()
  }, [refetchIntroductionData])

  return <ReactMarkdown>{Introduction}</ReactMarkdown>
}

export default Introduction
