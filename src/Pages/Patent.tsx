import { LanguageContext } from '../contexts/LanguageContext'
import Base, { EnteredT } from './Base'
import React, { useContext } from 'react'

const Patents = () => {
  const { getExpression } = useContext(LanguageContext)

  const getTitle = (
    text: string,
    inputType: string | {} = 'input',
    initValue: string | number | undefined = ''
  ) => {
    return { title: getExpression(text), inputType: inputType, initValue: initValue } as EnteredT
  }

  const columns: Record<string, EnteredT> = {
    number: getTitle('number'),
    title: getTitle('title'),
    link: getTitle('link'),
    language: getTitle('language', { select: ['en', 'cs'] }, 'cs'),
    mark_records: getTitle('markRecords'),
  }

  return <Base columns={columns} table='Patent' readProc='allPatentsCut' />
}

export default Patents
