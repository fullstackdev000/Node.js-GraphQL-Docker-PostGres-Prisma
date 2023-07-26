import '#veewme/lib/validationConfig'
// TODO use only ApolloProvider from @apollo/react-hooks ?
// https://github.com/apollographql/apollo-client/issues/2042#issuecomment-509041949
import apolloClient from '#veewme/web/common/apolloClient'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { hot } from 'react-hot-loader'
import { Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import history from '../common/history'
import { CustomToast, CustomToastContainer } from '../common/toast'
import Main from './layout/main'

import { ThemeProvider } from '../common/styled-components'
import theme from '../common/theme'

const AppContainer = () => (
  <Router history={history}>
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <ToastProvider components={{ Toast: CustomToast, ToastContainer: CustomToastContainer }}>
            <Main />
          </ToastProvider>
        </ThemeProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  </Router>
)

export default hot(module)(AppContainer)
