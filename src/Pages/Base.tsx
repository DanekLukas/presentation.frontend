import { Button, Form, Input, Table } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'

type Props = {
  columns: {}
  table: string
  readProc: string
}

const Base = ({ columns, table, readProc }: Props) => {
  const { getExpression } = useContext(LanguageContext)

  const columnsI = { ...{ id: 0 }, ...columns }

  const [id, setId] = useState<number>()

  const dispatch = useDispatch()

  const keysS = Object.keys(columns)
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
    // getData: gql`
    //   query item($id: Int) {
    //     ${table}(id: $id) {
    //       ${keys.map(item => `values[${item}]: ${item}`).join(`\n`)}
    //   }
    // `,
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

  const [tableOrderBy, setTableOrderBy] = useState('id')

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

  const { refetch: refetchData } = useQuery(query.getAllData, {
    skip: true,
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

  const [enterItem] = useMutation(mutation.enterItem, {
    onError: error => {
      console.error(error)
    },
    onCompleted: enterData => {
      const got = processReturnData(enterData[`Enter${table}`])
      if (got.hasOwnProperty('id') && got.id > 0) {
        setSpecificInputValue('id', got.id.toString())
        refetchData()
      }
    },
  })

  const [updateItem] = useMutation(mutation.updateItem, {
    onError: error => {
      console.error(error)
    },
    onCompleted: ItemData => {
      processReturnData(ItemData[`Update${table}`])
      refetchData()
    },
  })

  const [deleteItem] = useMutation(mutation.deleteItem, {
    onError: error => {
      console.error(error)
    },
    onCompleted: ItemData => {
      processReturnData(ItemData[`Delete${table}`])
      refetchData()
    },
  })

  const resetEdit = () => {
    const tmp = {} as any
    keys.forEach(key => {
      tmp[key as keyof typeof columnsI] = key === 'id' ? undefined : ''
    })
    setInputValues(tmp)
  }

  const [inputValues, setInputValues] = useState<typeof columnsI>()

  const setSpecificInputValue = (key: string, value: string) => {
    const tmp = { ...inputValues } as any
    tmp[key as keyof typeof tmp] = value
    setInputValues(tmp)
  }

  const getBaseValById = (id: number, key: string) => {
    return (
      (baseval as Array<typeof columnsI>).find(elm => elm['id' as keyof typeof elm] === id) as any
    )[key]
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
      variables: inputValues,
    })
  }

  const handleEnter = () => {
    const tmp = { ...inputValues }
    delete tmp.id
    enterItem({
      variables: tmp,
    })
  }

  useEffect(() => {
    resetEdit()
    refetchData({ orderBy: tableOrderBy })
  }, [refetchData, tableOrderBy])

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setInputValues(record)
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
          {Object.keys(columns).map((key, index) => (
            <div className='use-margin-bottom' key={index}>
              <Form.Item
                style={{ width: '20em' }}
                label={columns[key as keyof typeof columns]}
                hidden={key === 'id'}
              >
                <Input
                  onChange={({ target: { value } }) => {
                    setSpecificInputValue(key, value)
                  }}
                  value={(inputValues && inputValues[key as keyof typeof inputValues]) || ''}
                />
              </Form.Item>
            </div>
          ))}
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
                      handleDelete(inputValues.id)
                    }}
                  >
                    {getExpression('delete')}
                  </Button>
                  <Button
                    className='gradient-bkg use-margin-left'
                    onClick={() => {
                      setId(undefined)
                      const keys = Object.keys(columns)
                      const tmp = {} as any
                      keys.forEach(key => {
                        tmp[key as keyof typeof keys] = key === 'id' ? undefined : ''
                      })
                      setInputValues(tmp)
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
