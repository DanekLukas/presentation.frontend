import './App.less'
import * as React from 'react'
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { Global, css } from '@emotion/react'
import { onError } from '@apollo/client/link/error'
import AppRouter from './AppRouter'
import LanguageProvider from './contexts/LanguageProvider'
import MessageProvider from './contexts/MessageProvider'
import UserProvider from './contexts/UserProvider'

const httpLink = new HttpLink({
  uri: `${window.location.protocol}//${window.location.hostname}/graphql/`,
})

export let networkErrorMessage = false
export const setNetworkErrorMessageFalse = () => {
  networkErrorMessage = false
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // console.log(graphQLErrors)
  }

  if (networkError) {
    networkErrorMessage = !networkErrorMessage
    // console.log(networkError)
  }
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, httpLink]),
})

const App = () => {
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
      <ApolloProvider client={apolloClient}>
        <MessageProvider>
          <LanguageProvider>
            <UserProvider>
              <AppRouter />
            </UserProvider>
          </LanguageProvider>
        </MessageProvider>
      </ApolloProvider>
    </>
  )
}

export default App
