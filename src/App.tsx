import './App.less'
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { Global, css } from '@emotion/react'
import { onError } from '@apollo/client/link/error'
import AppRouter from './AppRouter'
import LanguageProvider from './contexts/LanguageProvider'
import MessageProvider from './contexts/MessageProvider'
import React, { useRef } from 'react'
import UserProvider from './contexts/UserProvider'

export type Msg = Record<number, string>

const App = () => {
  const fn = useRef<(message: string, timeout?: number) => void>()
  const httpLink = new HttpLink({
    uri: `${window.location.protocol}//${window.location.hostname}/graphql/`,
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      if (fn.current) {
        fn.current(networkError.message)
      }
    }
  })

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, httpLink]),
  })
  return (
    <>
      <Global
        styles={css`
          @page {
            size: auto;
            margin: 1em;
          }
          body {
            padding: 1rem;
          }
          button,
          input,
          textarea {
            border-radius: 0.3rem !important;
            border-width: 1px !important;
          }
        `}
      />
      <MessageProvider fn={fn}>
        <ApolloProvider client={apolloClient}>
          <LanguageProvider>
            <UserProvider>
              <AppRouter />
            </UserProvider>
          </LanguageProvider>
        </ApolloProvider>
      </MessageProvider>
    </>
  )
}

export default App
