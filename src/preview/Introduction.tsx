import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const query = {
  getIntroduction: gql`
    query getIntroduction($language: String) {
      getIntroduction(language: $language) {
        error
        data {
          content
        }
        message
      }
    }
  `,
}

const Introduction = () => {
  const dispatch = useDispatch()
  const { getLanguage } = useContext(LanguageContext)
  const [Introduction, setIntroduction] = useState<string>()

  const { refetch: refetchIntroductionData } = useQuery(query.getIntroduction, {
    variables: { language: getLanguage() },
    onCompleted: data => {
      if (data.getIntroduction.error) {
        dispatch(setMessage(data.getIntroduction.message))
        return
      }
      setIntroduction(data.getIntroduction.data.content)
    },
  })

  useEffect(() => {
    refetchIntroductionData()
  }, [refetchIntroductionData])

  return <ReactMarkdown>{Introduction}</ReactMarkdown>
}

export default Introduction
