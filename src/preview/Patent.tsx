import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'

import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'

type PatentRow = {
  number: string
  title: string
}

type Props = {
  name?: string
}

const query = {
  getPatents: gql`
    query Patents($login: String, $language: String, $orderBy: String) {
      allPatents(login: $login, language: $language, orderBy: $orderBy) {
        error
        data {
          number
          title
        }
        message
      }
    }
  `,
}

const Patent = ({ name }: Props) => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<PatentRow>>([])
  const { Paragraph, Title } = Typography
  const menuItem = { link: 'patent', name: 'header.patents' }

  const { refetch: refetchPatentsData } = useQuery(query.getPatents, {
    skip: true,
    onCompleted: allPatentsData => {
      if (allPatentsData.allPatents.error) {
        removeItem(menuItem)
        dispatch(setMessage(allPatentsData.allPatents.message))
        return
      }
      const datas: Array<PatentRow> = []
      Object.keys(allPatentsData.allPatents.data).forEach((key, index) =>
        datas.push({
          ...allPatentsData.allPatents.data[key],
          ...{ action: '', key: index },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchPatentsData({ login: name, language: getLanguage(), orderBy: 'id' })
  }, [refetchPatentsData, getLanguage, name])

  return (
    <>
      {data.length > 0 && (
        <Title level={4} className='section' id={menuItem.link}>
          {getExpression('header.patents')}
        </Title>
      )}
      {data.map((item, index) => (
        <Paragraph key={index}>
          <span style={{ display: 'block', float: 'left', fontWeight: 'bold' }}>{item.number}</span>
          <span style={{ paddingLeft: '8rem', fontWeight: 'bold' }}>{item.title}</span>
        </Paragraph>
      ))}
    </>
  )
}

export default Patent
