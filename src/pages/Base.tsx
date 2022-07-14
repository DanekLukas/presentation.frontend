import { Button, DatePicker, Form, Input, Select, Space, Table } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import moment, { Moment } from 'moment'

export type EnteredT = {
  title: string
  inputType: string | {}
  initValue: string | number | undefined
}

export const getCurrDate = () => {
  return (new Date().toLocaleDateString('en-GB').split('/') as string[]).reverse().join('-')
}

type Props = {
  columns: Record<string, EnteredT>
  table: string
  readProc: string
}

const Base = ({ columns: allColumns, table, readProc }: Props) => {
  const { getExpression } = useContext(LanguageContext)
  const { Option } = Select
  const { RangePicker } = DatePicker

  const keysS = Object.keys(allColumns)

  const columns: Record<string, string | number> = {}
  const initValue: Record<string, string | number | undefined> = { id: undefined }
  const inputType: Record<string, string | {}> = {}

  const dateFormat = 'YYYY-MM-DD'
  const displayDateFormat = getExpression('dateFormat')

  keysS.forEach((key: string) => {
    columns[key] = allColumns[key].title
    inputType[key] = allColumns[key].inputType
    initValue[key] = allColumns[key].initValue
  })

  const columnsI = { ...{ id: 0 }, ...columns }

  const [id, setId] = useState<number>()

  const dispatch = useDispatch()

  const keys = Object.keys(columnsI)

  const query = {
    getAllData: gql`
      query items($orderBy: String) {
        ${readProc}(orderBy: $orderBy) {
          error
          data {
            ${keys.join(' ')}
          }
          message
        }
      }
    `,
    getData: gql`
      query item($id: Int) {
        get${table}(id: $id) {
          ${keys.map(item => `${item}: ${item}`).join(`\n`)}
      }
    }
    `,
  }

  const mutation = {
    enterItem: gql`
      mutation EnterItem(${keysS.map(item => `$${item}: String`).join(', ')}) {
        Enter${table}(${keysS.map(item => `${item}: $${item}`).join(', ')}) {
          error
          data {
            ${keys.join(`\n`)}
          }
          message
        }
      }
    `,
    updateItem: gql`
      mutation updateItem($id: Int, ${keysS.map(item => `$${item}: String`).join(', ')}) {
        Update${table}(id: $id, ${keysS.map(item => `${item}: $${item}`).join(', ')}) {
          error
          data {
            ${keys.join(`\n`)}
          }
          message
        }
      }
    `,
    deleteItem: gql`
      mutation deleteItem($id: Int) {
        Delete${table}(id: $id) {
          error
          data
          message
        }
      }
    `,
  }

  const [baseval, setBaseval] = useState<Array<typeof columnsI>>([])

  const processReturnData = <T extends typeof columnsI>(inputData: {
    error: number
    data: T
    message: string
  }) => {
    if (inputData.error === 0) {
      return inputData.data
    }
    dispatch(setMessage(inputData.message))
  }

  const { loading: loadingAll, refetch: refetchData } = useQuery(query.getAllData, {
    onCompleted: allData => {
      if (allData[readProc].error) {
        dispatch(setMessage(allData.allArticles.message))
        return
      }
      const datas: Array<typeof columnsI> = []
      Object.keys(allData[readProc].data).forEach((key, index) =>
        datas.push({
          ...allData[readProc].data[key],
          ...{ action: '', key: index },
        })
      )
      setBaseval(datas)
    },
  })

  const { loading, refetch: refetchEdit } = useQuery(query.getData, {
    onCompleted: data => {
      const ret: typeof initValue = {}
      keys.forEach(key => {
        ret[key] = data[`get${table}`][key as keyof typeof data] || initValue[key]
      })
      setInputValues(ret)
    },
  })

  const [enterItem] = useMutation(mutation.enterItem, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: enterData => {
      const got = processReturnData(enterData[`Enter${table}`])
      if (got?.id > 0) {
        setSpecificInputValue('id', got.id)
        refetchData()
      } else {
        dispatch(setMessage(getExpression('DataNotEntered')))
      }
    },
  })

  const [updateItem] = useMutation(mutation.updateItem, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: ItemData => {
      processReturnData(ItemData[`Update${table}`])
      refetchData()
    },
  })

  const [deleteItem] = useMutation(mutation.deleteItem, {
    onError: error => {
      dispatch(setMessage(error.message))
    },
    onCompleted: ItemData => {
      processReturnData(ItemData[`Delete${table}`])
      refetchData()
    },
  })

  const resetEdit = () => {
    setInputValues(initValue)
  }

  const [inputValues, setInputValues] = useState(initValue)

  const setSpecificInputValue = (key: string, value: string | number) => {
    const tmp = { ...inputValues } as typeof initValue
    tmp[key as keyof typeof tmp] = value
    setInputValues(tmp)
  }

  const getBaseValById = (id: number, key: string) => {
    return (
      (baseval as Array<typeof columnsI>).find(elm => elm['id' as keyof typeof elm] === id) as any
    )[key]
  }

  const getValuesToSend = (record: typeof inputValues) => {
    const ret: typeof initValue = {}
    const recordKeys = Object.keys(record)
    keys.forEach(key => {
      ret[key] = recordKeys.includes(key) ? record[key as keyof typeof record] : initValue[key]
    })
    return ret
  }

  const handleDelete = (id: number) => {
    setId(undefined)
    resetEdit()
    deleteItem({
      variables: {
        id: id,
      },
    })
  }

  const handleUpdate = () => {
    updateItem({
      variables: getValuesToSend(inputValues),
    })
  }

  const handleEnter = () => {
    const tmp = { ...inputValues }
    delete tmp.id
    enterItem({
      variables: getValuesToSend(tmp),
    })
  }

  useEffect(() => {
    refetchData({ orderBy: 'id' })
  }, [refetchData])

  return (
    <>
      {(loading || loadingAll) && <div className='loading'>{getExpression('loading')}</div>}
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              refetchEdit({ id: record.id })
              setId(record.id)
            },
          }
        }}
        columns={(function () {
          const ret: any = []
          keys.forEach(key => {
            if (key !== 'id')
              ret.push({
                title: columns[key as keyof typeof columns],
                dataIndex: key,
                sortDirections: ['ascend', 'descend', 'ascend'],
                sorter: (a: object, b: object) => {
                  if ((a[key as keyof typeof a] as string) == null) return true
                  if ((b[key as keyof typeof a] as string) == null) return false
                  return (a[key as keyof typeof a] as string).localeCompare(
                    b[key as keyof typeof b] as string
                  )
                },
              })
          })
          return ret
        })()}
        dataSource={baseval}
        className='ant-table-thead'
      />
      <div className='use-margin-bottom'>
        <Form layout='inline' className='display-flex-column form-item'>
          {Object.keys(columns).map((key, index) =>
            typeof inputType[key] === 'object' &&
            Object.keys(inputType[key]).includes('rangePicker') &&
            (
              inputType[key] as {
                rangePicker: Array<string>
              }
            )['rangePicker'][1] === key ? null : (
              <div className='use-margin-bottom' key={index}>
                <Form.Item
                  className='form-width'
                  label={columns[key as keyof typeof columns]}
                  hidden={key === 'id'}
                >
                  {inputType[key] === 'input' && (
                    <Input
                      onChange={({ target: { value } }) => {
                        setSpecificInputValue(key, value)
                      }}
                      value={
                        (inputValues && inputValues[key as keyof typeof inputValues]) ||
                        initValue[key]
                      }
                    />
                  )}
                  {inputType[key] === 'textArea' && (
                    <Input.TextArea
                      onChange={({ target: { value } }) => {
                        setSpecificInputValue(key, value)
                      }}
                      value={
                        (inputValues && inputValues[key as keyof typeof inputValues]) ||
                        initValue[key]
                      }
                    />
                  )}
                  {typeof inputType[key] === 'object' &&
                    Object.keys(inputType[key]).includes('rangePicker') &&
                    (
                      inputType[key] as {
                        rangePicker: Array<string>
                      }
                    )['rangePicker'][0] === key && (
                      <Space direction='vertical' size={12}>
                        <RangePicker
                          onChange={(dates: [Moment, Moment], dateStrings: [string, string]) => {
                            const tmp = { ...inputValues } as typeof initValue
                            for (const pos of [0, 1]) {
                              tmp[
                                (
                                  inputType[key] as {
                                    rangePicker: Array<string>
                                  }
                                )['rangePicker'][pos]
                              ] = dates[pos].format(dateFormat)
                              setInputValues(tmp)
                            }
                          }}
                          value={[
                            inputValues && moment(inputValues[key], dateFormat),
                            inputValues &&
                              moment(
                                inputValues[
                                  (
                                    inputType[key] as {
                                      rangePicker: Array<string>
                                    }
                                  )['rangePicker'][1]
                                ],
                                dateFormat
                              ),
                          ]}
                          defaultValue={[
                            moment(allColumns[key].initValue),
                            moment(
                              allColumns[
                                (
                                  inputType[key] as {
                                    rangePicker: Array<string>
                                  }
                                )['rangePicker'][1]
                              ].initValue
                            ),
                          ]}
                          format={displayDateFormat}
                        />
                      </Space>
                    )}
                  {typeof inputType[key] === 'object' &&
                    Object.keys(inputType[key]).includes('select') && (
                      <Select
                        defaultValue={allColumns[key].initValue}
                        onChange={(value: string) => {
                          setSpecificInputValue(key, value)
                        }}
                        value={
                          (inputValues && inputValues[key as keyof typeof inputValues]) ||
                          allColumns[key].initValue
                        }
                      >
                        {(allColumns.language.inputType as { select: [] })['select'].map(
                          (option, index) => (
                            <Option key={index} value={option}>
                              {option}
                            </Option>
                          )
                        )}
                      </Select>
                    )}
                </Form.Item>
              </div>
            )
          )}
          <div className='display-flex-row'>
            <Button
              className='gradient-bkg'
              onClick={async () => {
                !inputValues || inputValues.id === undefined ? handleEnter() : handleUpdate()
              }}
            >
              {getExpression(!inputValues || inputValues.id === undefined ? 'insert' : 'save')}
            </Button>
            {!inputValues ||
              (inputValues.id !== undefined && (
                <>
                  <Button
                    className='gradient-bkg use-margin-left'
                    onClick={async () => {
                      handleDelete(inputValues.id as number)
                    }}
                  >
                    {getExpression('delete')}
                  </Button>
                  <Button
                    className='gradient-bkg use-margin-left'
                    onClick={() => {
                      setId(undefined)
                      setInputValues(initValue)
                    }}
                  >
                    {getExpression('new')}
                  </Button>
                </>
              ))}
          </div>
        </Form>
      </div>
      {Object.keys(columns).map((key, index) => (
        <div key={index}>
          {`${columns[key as keyof typeof columns]}: ${
            (baseval && id && getBaseValById(id, key)) || ''
          }`}
        </div>
      ))}
    </>
  )
}

export default Base
