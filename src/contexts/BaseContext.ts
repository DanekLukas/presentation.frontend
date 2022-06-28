import { createContext } from 'react'

type State = {
  baseRows: {}
  loadJmData: (spec: string, data: any) => Promise<boolean>
  baseval: {} | undefined
  setLoadDataRef: ((spec: (spec: string, inputData: {}) => Promise<any>) => void) | undefined
  dataChanged: boolean
}

export const BaseContext = createContext<State>({
  baseRows: {},
  loadJmData: async () => false,
  baseval: undefined,
  setLoadDataRef: undefined,
  dataChanged: false,
})
