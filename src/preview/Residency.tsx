import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'

import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type ResidencyRow = {
  title: string
  description: string
  started: string
  finished: string
}

const query = {
  getResidencies: gql`
    query Residencies($language: String, $orderBy: String) {
      allResidencyRanges(language: $language, orderBy: $orderBy) {
        error
        data {
          title
          description
          started
          finished
        }
        message
      }
    }
  `,
}

const Residency = () => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<ResidencyRow>>([])
  const { Paragraph, Title } = Typography
  const menuItem = { link: 'residency', name: 'header.residency' }

  const { refetch: refetchResidencyData } = useQuery(query.getResidencies, {
    skip: true,
    onCompleted: data => {
      if (data.allResidencyRanges.error) {
        removeItem(menuItem)
        dispatch(setMessage(data.allResidencyRanges.message))
        return
      }
      const datas: Array<ResidencyRow> = []
      Object.keys(data.allResidencyRanges.data).forEach((key, index) =>
        datas.push({
          ...data.allResidencyRanges.data[key],
          ...{ action: '', key: index },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchResidencyData({ language: getLanguage(), orderBy: 'id' })
  }, [refetchResidencyData, getLanguage])

  return (
    <>
      {data.length > 0 && (
        <Title level={4} className='section' id={menuItem.link}>
          {getExpression('header.residency')}
        </Title>
      )}
      {data.map((item, index) => (
        <Paragraph key={index}>
          <Title level={5}>
            <span style={{ display: 'block', float: 'left' }}>
              {item.started} - {item.finished}
            </span>
            <span style={{ paddingLeft: '8rem' }}>{item.title}</span>
          </Title>
          <ReactMarkdown>{item.description}</ReactMarkdown>
        </Paragraph>
      ))}
    </>
  )
}

export default Residency
