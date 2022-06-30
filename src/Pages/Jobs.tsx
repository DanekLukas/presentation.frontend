import { LanguageContext } from '../contexts/LanguageContext'
import Base, { EnteredT } from './Base'
import React, { useContext } from 'react'

const Jobs = () => {
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
    description: getTitle('description', 'textArea'),
    language: getTitle('language', { select: ['en', 'cs'] }, 'cs'),
    position: getTitle('position'),
    skills: getTitle('skills'),
    platform: getTitle('platform'),
    started: getTitle('started', { rangePicker: ['started', 'finished'] }, '2015-01-01'),
    finished: getTitle('finished', { rangePicker: ['started', 'finished'] }, '2015-01-01'),
    mark_records: getTitle('markRecords'),
  }

  return <Base columns={columns} table='Job' readProc='allJobsCut' />
}

export default Jobs
