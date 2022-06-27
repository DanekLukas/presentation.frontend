import './App.less'
import * as React from 'react'
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { Global, css } from '@emotion/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import AppRouter from './AppRouter'
import LanguageProvider from './Contexts/LanguageProvider'
import UserProvider from './Contexts/UserProvider'
import rootReducer from './components/rootReducer'

const httpLink = new HttpLink({
  uri: `${window.location.protocol}//${window.location.hostname}/graphql/`,
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
})

const App = () => {
  const store = createStore(rootReducer)
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
        <Provider store={store}>
          <LanguageProvider>
            <UserProvider>
              <AppRouter />
            </UserProvider>
          </LanguageProvider>
        </Provider>
      </ApolloProvider>
    </>
  )
}

export default App
