import { BaseContext } from './BaseContext'
import { LanguageContext } from '../contexts/LanguageContext'
import React, { useContext, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
}

const BaseProvider = ({ children }: Props) => {
  const { getExpression } = useContext(LanguageContext)

  const baseRows = {
    id: 'ID',
    title: getExpression('title'),
    content: getExpression('content'),
    links: getExpression('links'),
  }

  const [baseval, setBaseval] = useState<Array<typeof baseRows | undefined>>()
  const dataChangedRef = useRef(false)

  const loadDataRef = useRef<(spec: string, inputData: {}) => Promise<any>>()

  const setLoadDataRef = (fn: (spec: string, inputData: {}) => Promise<any>) => {
    loadDataRef.current = fn
  }

  const checkArray = (data: any) => {
    if (!data || !Array.isArray(data)) return false
    let isChecked = true
    Object.keys(data).forEach((val: any) => {
      const keys = Object.keys(data[val])
      Object.keys(baseRows).forEach(key => {
        if (key !== 'created_at') isChecked &&= keys.includes(key)
        if (isChecked === false) return false
      })
      keys.forEach(key => {
        if (!Object.keys(baseRows).includes(key)) {
          delete data[val][key as keyof typeof data]
        }
      })
    })
    return data
  }

  const loadJmData = async (spec: string, data: any) => {
    if (loadDataRef.current) {
      let loaded = await loadDataRef.current(spec, data)
      if (!loaded) return false
      if (loaded.result && loaded.result === 'success') return true
      loaded = checkArray(loaded)
      if (typeof loaded !== 'boolean') {
        setBaseval(loaded)
        dataChangedRef.current = !dataChangedRef.current
      }
    }
    return false
  }

  // useEffect(() => {
  //   console.info(baseval)
  // }, [baseval])

  return (
    <BaseContext.Provider
      value={{
        baseRows,
        loadJmData,
        baseval,
        setLoadDataRef,
        dataChanged: dataChangedRef.current as boolean,
      }}
    >
      {children}
    </BaseContext.Provider>
  )
}

export default BaseProvider
