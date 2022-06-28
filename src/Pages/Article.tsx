import { LanguageContext } from '../contexts/LanguageContext'
import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type ArticleRow = { id: number; title: string; content: string; links: string }

const query = {
  getArticles: gql`
    query Articles($language: String, $orderBy: String) {
      allArticles(language: $language, orderBy: $orderBy) {
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

const Article = () => {
  const dispatch = useDispatch()
  const { getExpression, getLanguage } = useContext(LanguageContext)
  const [keptData, setKeptData] = useState<Array<ArticleRow>>([])
  const [tableOrderBy, setTableOrderBy] = useState('id')
  const { Link, Paragraph, Text, Title } = Typography

  const { refetch: refetchArticleData } = useQuery(query.getArticles, {
    skip: true,
    onCompleted: allArticlesData => {
      if (allArticlesData.allArticles.error) {
        dispatch(setMessage(allArticlesData.allArticles.message))
        return
      }
      const datas: Array<ArticleRow> = []
      Object.keys(allArticlesData.allArticles.data).forEach(key =>
        datas.push({
          ...allArticlesData.allArticles.data[key],
          ...{ action: '', key: `articles_${allArticlesData.allArticles.data[key].id}` },
        })
      )
      setKeptData(datas)
    },
  })

  useEffect(() => {
    refetchArticleData({ language: getLanguage(), orderBy: tableOrderBy })
  }, [refetchArticleData, tableOrderBy, getLanguage])

  return (
    <>
      {keptData.map((item, index) => (
        <Paragraph key={index}>
          <Title>{item.title}</Title>
          <ReactMarkdown>{item.content}</ReactMarkdown>
          <Link>{item.links}</Link>
        </Paragraph>
      ))}
      {!keptData.length && <Title>{getExpression('noArticle')}</Title>}
    </>
  )
}

export default Article
