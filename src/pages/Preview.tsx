import { LanguageContext } from '../contexts/LanguageContext'
import { Typography } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const query = {
  getData: gql`
    query getData($language: String, $orderBy: String) {
      getLogin {
        error
        data {
          name
        }
        message
      }
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
      allEducationRanges(language: $language, orderBy: $orderBy) {
        error
        data {
          title
          description
          degree
          started
          finished
        }
        message
      }
      getIntroduction(language: $language) {
        error
        data {
          content
        }
        message
      }
      allJobRanges(language: $language, orderBy: $orderBy) {
        error
        data {
          id
          title
          description
          position
          skills
          platform
          started
          finished
        }
        message
      }
      allPatents(language: $language, orderBy: $orderBy) {
        error
        data {
          number
          title
          link
        }
        message
      }
      allResidencyRanges(language: $language, orderBy: $orderBy) {
        error
        data {
          title
          description
          started
          finished
        }
        message
      }
    }
  `,
}

export type EducationRow = {
  title: string
  description: string
  degree: string
  started: string
  finished: string
}

export type ResidencyRow = {
  title: string
  description: string
  started: string
  finished: string
}

export type PatentRow = {
  number: string
  title: string
  link: string
}

export type JobRow = {
  id: number
  title: string
  description: string
  position: string
  skills: string
  platform: string
  started: string
  finished: string
}

export type menuItem = { name: string; link: string }

export type ArticleRow = { id: number; title: string; content: string; links: string }

type TCV = {
  user: string | null
  introduction: string | null
  menu: menuItem[] | null
  article: ArticleRow[] | null
  education: EducationRow[] | null
  residency: ResidencyRow[] | null
  patent: PatentRow[] | null
  job: JobRow[] | null
}

const Preview = () => {
  const navigate = useNavigate()
  const { Link, Paragraph, Title } = Typography
  const { getExpression, getLanguage } = useContext(LanguageContext)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const name = useLocation().pathname.substring(1)
  const initCV: TCV = {
    user: null,
    introduction: null,
    menu: null,
    article: null,
    education: null,
    residency: null,
    patent: null,
    job: null,
  }

  const menuItems = [
    { link: 'article', name: 'header.projects' },
    { link: 'education', name: 'header.education' },
    { link: 'residency', name: 'header.residency' },
    { link: 'patent', name: 'header.patents' },
    { link: 'job', name: 'header.professional.experience' },
  ]

  const [cv, setCv] = useState<TCV>(initCV)

  const { loading, refetch: refetchUserData } = useQuery(query.getData, {
    variables: { login: name, language: getLanguage(), orderBy: 'id' },
    onCompleted: data => {
      const tmp: TCV = initCV
      if (data.getLogin.message === 'login not found') {
        navigate('/')
      } else tmp.user = data.getLogin.data.name
      if (!data.getIntroduction.error) tmp.introduction = data.getIntroduction.data.content
      if (!data.allEducationRanges.error) tmp.education = data.allEducationRanges.data
      if (!data.allResidencyRanges.error) tmp.residency = data.allResidencyRanges.data
      if (!data.allPatents.error) tmp.patent = data.allPatents.data
      if (!data.allJobRanges.error) tmp.job = data.allJobRanges.data
      if (!data.allArticles.error) tmp.article = data.allArticles.data
      tmp.menu = []
      menuItems.forEach(item => {
        if ((tmp[item.link as keyof typeof tmp]?.length || 0) > 0) tmp.menu.push(item)
      })
      if (tmp.menu.length < 2) tmp.menu = null
      setCv(tmp)
    },
  })

  useEffect(() => {
    refetchUserData()
  }, [name, refetchUserData])

  return (
    <div className='preview'>
      <div>
        {name && loading ? (
          <p>{getExpression('loading')}</p>
        ) : (
          <>
            {cv.user && <Title level={2}>{cv.user}</Title>}
            {cv.introduction && <ReactMarkdown>{cv.introduction}</ReactMarkdown>}
            {cv && (
              <div className='menu'>
                {cv.menu?.map((elm, index) => (
                  <a href={'#' + elm.link} key={index}>
                    {getExpression(elm.name)}
                  </a>
                ))}
              </div>
            )}
            {cv.article?.length > 0 && (
              <Title level={4} className='section' id='article'>
                {getExpression('header.projects')}
              </Title>
            )}
            {cv.article?.map((item, index) => (
              <Paragraph key={index}>
                <Title level={4}>
                  {(item.links && (
                    <Link href={item.links} target='_blank'>
                      {item.title}
                    </Link>
                  )) ||
                    item.title}
                </Title>
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </Paragraph>
            ))}
            {cv.education?.length > 0 && (
              <Title level={4} className='section' id='education'>
                {getExpression('header.education')}
              </Title>
            )}
            {cv.education?.map((item, index) => (
              <Paragraph key={index}>
                <Title level={5} className='cv-property'>
                  <span>
                    {item.started} - {item.finished}
                  </span>
                  <span>{item.title}</span>
                  <span>{item.degree}</span>
                </Title>
                <ReactMarkdown>{item.description}</ReactMarkdown>
              </Paragraph>
            ))}
            {cv.residency && cv.residency.length > 0 && (
              <Title level={4} className='section' id='residency'>
                {getExpression('header.residency')}
              </Title>
            )}
            {cv.residency?.map((item, index) => (
              <Paragraph key={index}>
                <Title level={5} className='cv-property'>
                  <span>
                    {item.started} - {item.finished}
                  </span>
                  <span>{item.title}</span>
                </Title>
                <ReactMarkdown>{item.description}</ReactMarkdown>
              </Paragraph>
            ))}
            {cv.patent?.length > 0 && (
              <Title level={4} className='section' id='patent'>
                {getExpression('header.patents')}
              </Title>
            )}
            {cv.patent?.map((item, index) => (
              <Paragraph key={index}>
                {((elm, link) =>
                  link ? (
                    <a href={link} target='_blank' rel='noreferrer'>
                      {elm}
                    </a>
                  ) : (
                    { elm }
                  ))(<span>{item.number}</span>, item.link)}
                <span>{item.title}</span>
              </Paragraph>
            ))}
            {cv.job?.length > 0 && (
              <Title level={4} className='section' id='job'>
                {getExpression('header.professional.experience')}
              </Title>
            )}
            {cv.job?.map((item, index) => (
              <Paragraph key={index}>
                <Title level={5} className='cv-property'>
                  <span>
                    {item.started} - {item.finished}
                  </span>
                  <span>{item.title}</span>
                </Title>
                <ReactMarkdown>
                  {`>${item['description' as keyof typeof item]}  
            
            \n${['position', 'skills', 'platform']
              .map(key => `${getExpression(key)}: **${item[key as keyof typeof item]}**`)
              .join('  \n ')}`}
                </ReactMarkdown>
              </Paragraph>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Preview
