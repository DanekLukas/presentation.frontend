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
    query Educations($login: String, $language: String, $orderBy: String) {
      allEducationsRanges(login: $login, language: $language, orderBy: $orderBy) {
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

type Props = {
  name: string
}

const Education = ({ name }: Props) => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<EducationRow>>([])
  const { Paragraph, Title } = Typography
  const menuItem = { link: 'education', name: 'header.education' }

  const { refetch: refetchEducationData } = useQuery(query.getEducations, {
    skip: true,
    onCompleted: allEducationsData => {
      if (allEducationsData.allEducationsRanges.error) {
        removeItem(menuItem)
        dispatch(setMessage(allEducationsData.allEducationsRanges.message))
        return
      }
      const datas: Array<EducationRow> = []
      Object.keys(allEducationsData.allEducationsRanges.data).forEach((key, index) =>
        datas.push({
          ...allEducationsData.allEducationsRanges.data[key],
          ...{ action: '', key: index },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchEducationData({ login: name, language: getLanguage(), orderBy: 'id' })
  }, [refetchEducationData, getLanguage, name])

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
