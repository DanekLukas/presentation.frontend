import { LanguageContext } from '../contexts/LanguageContext'
import { MenuContext } from '../contexts/MenuContext'
import { menuItem } from '../contexts/MenuProvider'
import Article from './Article'
import Education from './Education'
import Introduction from './Introduction'
import Job from './Job'
import Patent from './Patent'
import React, {
  FunctionComponentElement,
  JSXElementConstructor,
  ReactElement,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Residency from './Residency'
import User from './User'

type Props = {
  name?: string
}

const Homepage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const name = ''
  const srt = useCallback(
    (a: menuItem, b: menuItem): number => {
      return names.indexOf(a.link) - names.indexOf(b.link)
    },
    // eslint-disable-next-line
    []
  )

  const Menu = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { menu } = useContext(MenuContext)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getExpression } = useContext(LanguageContext)
    if (menu.length < 2) return null
    return (
      <div className='menu'>
        {menu?.sort(srt).map((elm, index) => (
          <a href={'#' + elm.link} key={index}>
            {getExpression(elm.name)}
          </a>
        ))}
      </div>
    )
  }, [srt])

  const containers = useMemo(
    () => [User, Introduction, Menu, Education, Residency, Patent, Job, Article],
    [Menu]
  )
  //next line after product compilation does not work
  // const names = containers.map(elm => elm.name.toLowerCase())
  const names = useMemo(
    () => ['user', 'introduction', 'menu', 'education', 'residency', 'patent', 'job', 'article'],
    []
  )

  const [login, setLogin] = useState(name)
  const [elms, setElms] =
    useState<
      Array<
        | FunctionComponentElement<Props>[]
        | ReactElement<{ name: string }, string | JSXElementConstructor<any>>
      >
    >()

  useEffect(() => {
    setLogin(name)
  }, [login, name])

  useEffect(() => {
    const prepareElms = () => {
      const elems = containers.map((elm, index) => createElement(elm, { name: login, key: index }))
      setElms(elems)
    }
    if (!elms) {
      prepareElms()
    }
  }, [login, elms, containers])

  return (
    <div className='preview'>
      <div>{elms?.map(elm => elm)}</div>
    </div>
  )
}

export default Homepage
