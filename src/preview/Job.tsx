import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'

import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type JobRow = {
  id: number
  title: string
  description: string
  position: string
  skills: string
  platform: string
  started: string
  finished: string
}

type Props = {
  name?: string
}

const query = {
  getJobs: gql`
    query Jobs($login: String, $language: String, $orderBy: String) {
      allJobsRanges(login: $login, language: $language, orderBy: $orderBy) {
        error
        data {
          id
          title
          description
          position
          skills
          platform
          started
          finished
        }
        message
      }
    }
  `,
}

const Job = ({ name }: Props) => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<JobRow>>([])
  const { Paragraph, Title } = Typography
  const menuItem = { link: 'job', name: 'header.professional.experience' }

  const { refetch: refetchJobsData } = useQuery(query.getJobs, {
    skip: true,
    onCompleted: allJobsData => {
      if (allJobsData.allJobsRanges.error) {
        removeItem(menuItem)
        dispatch(setMessage(allJobsData.allJobsRanges.message))
        return
      }
      const datas: Array<JobRow> = []
      Object.keys(allJobsData.allJobsRanges.data).forEach(key =>
        datas.push({
          ...allJobsData.allJobsRanges.data[key],
          ...{ action: '', key: `jobs_${allJobsData.allJobsRanges.data[key].id}` },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchJobsData({ login: name, language: getLanguage(), orderBy: 'started' })
  }, [refetchJobsData, getLanguage, name])

  return (
    <>
      {data.length > 0 && (
        <Title level={4} className='section' id={menuItem.link}>
          {getExpression('header.professional.experience')}
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
          <ReactMarkdown>
            {`>${item['description' as keyof typeof item]}  
            
            \n${['position', 'skills', 'platform']
              .map(key => `${getExpression(key)}: **${item[key as keyof typeof item]}**`)
              .join('  \n ')}`}
          </ReactMarkdown>
        </Paragraph>
      ))}
    </>
  )
}

export default Job
