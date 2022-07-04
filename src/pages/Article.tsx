import { LanguageContext } from '../contexts/LanguageContext'
import React, { useContext } from 'react'
import ReactMarkdown from 'react-markdown'

const Article = () => {
  const { getExpression } = useContext(LanguageContext)

  return (
    <div className='base'>
      <ReactMarkdown>{getExpression('welcome')}</ReactMarkdown>
    </div>
  )
}

export default Article
