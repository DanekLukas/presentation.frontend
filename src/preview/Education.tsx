import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'

import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type EducationRow = {
  title: string
  description: string
  degree: string
  started: string
  finished: string
}

const query = {
  getEducations: gql`
    query Educations($language: String, $orderBy: String) {
      allEducationRanges(language: $language, orderBy: $orderBy) {
        error
        data {
          title
          description
          degree
          started
          finished
        }
        message
      }
    }
  `,
}

const Education = () => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<EducationRow>>([])
  const { Paragraph, Title } = Typography
  const menuItem = { link: 'education', name: 'header.education' }

  const { refetch: refetchEducationData } = useQuery(query.getEducations, {
    skip: true,
    onCompleted: data => {
      if (data.allEducationRanges.error) {
        removeItem(menuItem)
        dispatch(setMessage(data.allEducationRanges.message))
        return
      }
      const datas: Array<EducationRow> = []
      Object.keys(data.allEducationRanges.data).forEach((key, index) =>
        datas.push({
          ...data.allEducationRanges.data[key],
          ...{ action: '', key: index },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchEducationData({ language: getLanguage(), orderBy: 'id' })
  }, [refetchEducationData, getLanguage])

  return (
    <>
      {data.length > 0 && (
        <Title level={4} className='section' id={menuItem.link}>
          {getExpression('header.education')}
        </Title>
      )}
      {data.map((item, index) => (
        <Paragraph key={index}>
          <Title level={5}>
            <span style={{ display: 'block', float: 'left' }}>
              {item.started} - {item.finished}
            </span>
            <span style={{ paddingLeft: '8rem' }}>{item.title}</span>
            <span style={{ display: 'block', float: 'right' }}>{item.degree}</span>
          </Title>
          <ReactMarkdown>{item.description}</ReactMarkdown>
        </Paragraph>
      ))}
    </>
  )
}

export default Education
