import { createContext } from 'react'
import { menuItem } from './MenuProvider'

type State = {
  menu: menuItem[]
  addItem: (item: menuItem) => void
  removeItem: (item: menuItem) => void
}

export const MenuContext = createContext<State>({
  menu: [],
  addItem: () => undefined,
  removeItem: () => undefined,
})
