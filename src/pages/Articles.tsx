import { LanguageContext } from '../contexts/LanguageContext'
import Base, { EnteredT } from './Base'
import React, { useContext } from 'react'

const Articles = () => {
  const { getExpression } = useContext(LanguageContext)

  const getTitle = (
    text: string,
    inputType: string | {} = 'input',
    initValue: string | number | undefined = ''
  ) => {
    return { title: getExpression(text), inputType: inputType, initValue: initValue } as EnteredT
  }

  const columns: Record<string, EnteredT> = {
    title: getTitle('title'),
    content: getTitle('content', 'textArea'),
    language: getTitle('language', { select: ['en', 'cs'] }, 'cs'),
    mark_records: getTitle('markRecords'),
    links: getTitle('links'),
  }

  return <Base columns={columns} table='Article' readProc='allArticlesCut' />
}

export default Articles
