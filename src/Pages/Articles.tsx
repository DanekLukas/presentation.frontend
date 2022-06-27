import { Button, Form, Input, Table } from 'antd'
import { LanguageContext } from '../Contexts/LanguageContext'
import { gql, useMutation, useQuery } from '@apollo/client'
import { setMessage } from '../components/Message/messageActionCreators'
import { useDispatch } from 'react-redux'
import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'

type ArticleRow = { id: number; title: string; content: string; links: string }

const query = {
  getArticles: gql`
    query Articles($orderBy: String) {
      allArticlesCut(orderBy: $orderBy) {
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
  getArticle: gql`
    query Article($id: Int) {
      article(id: $id) {
        editId: id
        editTitle: title
        editContent: content
        editLinks: links
      }
    }
  `,
}

const mutation = {
  enterArticle: gql`
    mutation EnterArticle($title: String, $content: String, $links: String) {
      EnterArticle(title: $title, content: $content, links: $links) {
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
  updateArticle: gql`
    mutation updateArticle($id: Int, $title: String, $content: String, $links: String) {
      UpdateArticle(id: $id, title: $title, content: $content, links: $links) {
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
  deleteArticle: gql`
    mutation deleteArticle($id: Int) {
      DeleteArticle(id: $id) {
        error
        data
        message
      }
    }
  `,
}

const Articles = () => {
  const dispatch = useDispatch()
  const { getExpression } = useContext(LanguageContext)
  const [editId, setEditId] = useState<number | undefined>()
  const [editTitle, setEditTitle] = useState<string>('')
  const [editContent, setEditContent] = useState<string>('')
  const [editLinks, setEditLinks] = useState<string>('')
  const [keptData, setKeptData] = useState<Array<ArticleRow>>([])
  const [tableOrderBy, setTableOrderBy] = useState('id')

  const { refetch: refetchArticleData } = useQuery(query.getArticles, {
    skip: true,
    onCompleted: allArticlesData => {
      if (allArticlesData.allArticlesCut.error) {
        dispatch(setMessage(allArticlesData.allArticles.message))
        return
      }
      const datas: Array<ArticleRow> = []
      Object.keys(allArticlesData.allArticlesCut.data).forEach(key =>
        datas.push({
          ...allArticlesData.allArticlesCut.data[key],
          ...{ action: '', key: `articles_${allArticlesData.allArticlesCut.data[key].id}` },
        })
      )
      setKeptData(datas)
    },
  })

  const refetchArticleDataCall = () => {
    refetchArticleData({ orderBy: tableOrderBy })
  }

  const processReturnData = <T extends object>(inputData: {
    error: number
    data: T
    message: string
  }) => {
    if (inputData.error === 0) {
      return inputData.data
    }
    dispatch(setMessage(inputData.message))
  }

  const [enterArticle] = useMutation(mutation.enterArticle, {
    onError: error => {
      console.error(error)
    },
    onCompleted: enterData => {
      const got: ArticleRow = processReturnData(enterData.EnterArticle)
      if (got?.id > 0) {
        setEditId(got.id)
        refetchArticleDataCall()
      }
    },
  })

  const [updateArticle] = useMutation(mutation.updateArticle, {
    onError: error => {
      console.error(error)
    },
    onCompleted: articleData => {
      processReturnData(articleData.UpdateArticle)
      refetchArticleDataCall()
    },
  })

  const [deleteArticle] = useMutation(mutation.deleteArticle, {
    onError: error => {
      console.error(error)
    },
    onCompleted: articleData => {
      processReturnData(articleData.DeleteArticle)
      refetchArticleDataCall()
    },
  })

  const { refetch: refetchEdit } = useQuery(query.getArticle, {
    skip: true,
    onCompleted: editData => {
      if (!editData || !editData.article) {
        return
      }
      setEditId(editData.article.editId)
      setEditTitle(editData.article.editTitle)
      setEditContent(editData.article.editContent)
      setEditLinks(editData.article.editLinks)
    },
  })

  const onFinish = () => {
    if (editId) {
      updateArticle({
        variables: {
          id: editId,
          title: editTitle,
          content: editContent,
          links: editLinks,
        },
      })
    } else {
      enterArticle({
        variables: {
          title: editTitle,
          content: editContent,
          links: editLinks,
        },
      })
    }
  }

  const handleDelete = (id: number) => {
    if (id === editId) {
      resetEdit()
    }
    deleteArticle({
      variables: {
        id,
      },
    })
  }

  const handleEdit = (id: number) => {
    refetchEdit({ id: id })
  }

  const columns = [
    {
      title: getExpression('title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: getExpression('content'),
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: getExpression('links'),
      dataIndex: 'links',
      key: 'links',
    },
    {
      title: getExpression('action'),
      dataIndex: 'action',
      key: 'id',
      render: (text: string, record: ArticleRow) => (
        <>
          <button onClick={() => handleDelete(record.id)}>{getExpression('delete')}</button>
          <button onClick={() => handleEdit(record.id)}>{getExpression('edit')}</button>
        </>
      ),
    },
  ]

  const onFinishFailed = () => {
    return
  }

  const resetEdit = () => {
    setEditId(undefined)
    setEditTitle('')
    setEditContent('')
    setEditLinks('')
  }

  useEffect(() => {
    refetchArticleData({ orderBy: tableOrderBy })
  }, [refetchArticleData, tableOrderBy])

  return (
    <>
      <Table columns={columns} dataSource={keptData} />
      <FormStyled
        name='basic'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label={getExpression('title')}
          rules={[
            {
              required: true,
              message: getExpression('enterInputTitle'),
            },
          ]}
        >
          <Input onChange={e => setEditTitle(e.target.value)} value={editTitle} />
        </Form.Item>

        <Form.Item
          label={getExpression('content')}
          rules={[
            {
              required: true,
              message: getExpression('enterContent'),
            },
          ]}
        >
          <Input.TextArea onChange={e => setEditContent(e.target.value)} value={editContent} />
        </Form.Item>

        <Form.Item
          label={getExpression('links')}
          rules={[
            {
              required: true,
              message: getExpression('enterInputLinks'),
            },
          ]}
        >
          <Input onChange={e => setEditLinks(e.target.value)} value={editLinks} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {getExpression('submit')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType='reset' onClick={resetEdit}>
            {getExpression('new')}
          </Button>
        </Form.Item>
      </FormStyled>
    </>
  )
}

const FormStyled = styled(Form)`
  padding: 2rem;

  & > div {
    width: calc(100%-10rem);
    display: flex;
    flex-direction: row;
  }

  & > div > div > label {
    display: block;
    width: 5rem;
    text-align: right;
    transform: translateY(3px);
  }

  & > div > div > label::first-letter {
    text-transform: uppercase;
  }

  input,
  textarea {
    width: 100%;
  }

  button {
    transform: translateX(5rem);
  }
`

export default Articles
