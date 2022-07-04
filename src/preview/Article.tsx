import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'

import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type ArticleRow = { id: number; title: string; content: string; links: string }

const query = {
  getArticles: gql`
    query Articles($login: String, $language: String, $orderBy: String) {
      allArticles(login: $login, language: $language, orderBy: $orderBy) {
        error
        data {
          id
          title
          content
          links
        }
        message
      }
    }
  `,
}

type Props = {
  name: string
}

const Article = ({ name }: Props) => {
  const dispatch = useDispatch()
  const { addItem, removeItem } = useContext(MenuContext)
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [data, setdata] = useState<Array<ArticleRow>>([])
  const { Link, Paragraph, Title } = Typography
  const menuItem = { link: 'article', name: 'header.projects' }

  const { refetch: refetchArticleData } = useQuery(query.getArticles, {
    skip: true,
    onCompleted: allArticlesData => {
      if (allArticlesData.allArticles.error) {
        removeItem(menuItem)
        dispatch(setMessage(allArticlesData.allArticles.message))
        return
      }
      const datas: Array<ArticleRow> = []
      Object.keys(allArticlesData.allArticles.data).forEach((key, index) =>
        datas.push({
          ...allArticlesData.allArticles.data[key],
          ...{ action: '', key: index },
        })
      )
      if (datas.length === 0) removeItem(menuItem)
      else addItem(menuItem)
      setdata(datas)
    },
  })

  useEffect(() => {
    refetchArticleData({ login: name, language: getLanguage(), orderBy: 'id' })
  }, [refetchArticleData, getLanguage, name])

  return (
    <>
      {data.length > 0 && (
        <Title level={4} className='section' id={menuItem.link}>
          {getExpression('header.projects')}
        </Title>
      )}
      {data.map((item, index) => (
        <Paragraph key={index}>
          <Title level={4}>{item.title}</Title>
          <ReactMarkdown>{item.content}</ReactMarkdown>
          <Link>{item.links}</Link>
        </Paragraph>
      ))}
    </>
  )
}

export default Article
