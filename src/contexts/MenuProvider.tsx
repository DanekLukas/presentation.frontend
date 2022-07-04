import { MenuContext } from './MenuContext'
import React, { useState } from 'react'

type Props = {
  children: React.ReactNode
}

export type menuItem = { name: string; link: string }

const MenuProvider = ({ children }: Props) => {
  const [menu, setMenu] = useState<Array<menuItem>>([])

  const addItem = (item: menuItem) => {
    if (!menu?.map(elm => elm.link).includes(item.link)) {
      const tmp = [...menu]
      tmp.push(item)
      setMenu(tmp)
    }
  }

  const removeItem = (item: menuItem) => {
    if (!menu) return
    const tmp: menuItem[] = []
    menu.forEach(elm => {
      if (elm.link !== item.link) tmp.push(elm)
    })
    setMenu(tmp)
  }

  return (
    <MenuContext.Provider
      value={{
        menu,
        addItem,
        removeItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export default MenuProvider
