import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { LanguageContext } from '../contexts/LanguageContext'
import { Typography } from 'antd'
import React, { useContext } from 'react'

const { Link } = Typography

const Language = () => {
  const { getLanguages, setLanguage, getLanguageTypes, getExpression } = useContext(LanguageContext)

  const menu = (
    <Menu>
      {getLanguageTypes().map((key, index) => (
        <Menu.Item
          onClick={() => {
            setLanguage(key)
          }}
          key={`language_${index}`}
        >
          {getLanguages()[key]}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <Link className='ant-dropdown-link'>
        {getExpression('language')}
        <DownOutlined />
      </Link>
    </Dropdown>
  )
}

export default Language
