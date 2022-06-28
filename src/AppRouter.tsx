import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
import Article from './Pages/Article'
import Articles from './Pages/Articles'
import ArticlesBase from './Pages/ArticlesBase'
import ChangePassword from './Pages/ChangePassword'
import ForgottenPassword from './Pages/ForgottenPassword'
import Header from './Pages/Header'
import Login from './Pages/Login'
import React, { useContext, useEffect, useState } from 'react'
import Registration from './Pages/Registration'
import SetPassword from './Pages/SetPassword'

const AppRouter = () => {
  const { email, inRole } = useContext(UserContext)
  const [isLoggedIn, setIsLoggedIn] = useState(email !== '')
  const [isAdmin, setIsAdmin] = useState(inRole('ROLE_ADMIN'))
  useEffect(() => {
    setIsAdmin(inRole('ROLE_ADMIN'))
    setIsLoggedIn(email !== '')
  }, [email, inRole])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Header />
                <Article />
              </>
            }
          />
          {isLoggedIn && isAdmin && (
            <>
              <Route
                path='/articles'
                element={
                  <>
                    <Header />
                    <Articles />
                  </>
                }
              />
              <Route
                path='/base'
                element={
                  <>
                    <Header />
                    <ArticlesBase />
                  </>
                }
              />
            </>
          )}
          {isLoggedIn && (
            <Route
              path='/change_password'
              element={
                <>
                  <Header />
                  <ChangePassword />
                </>
              }
            />
          )}
          {!isLoggedIn && (
            <>
              <Route
                path='/reset_password'
                element={
                  <>
                    <Header />
                    <ForgottenPassword />
                  </>
                }
              />
              <Route
                path='/login'
                element={
                  <>
                    <Header />
                    <Login />
                  </>
                }
              />
              <Route
                path='/registration'
                element={
                  <>
                    <Header />
                    <Registration />
                  </>
                }
              />
              <Route path='/set-password' element={<SetPasswordElement />} />
            </>
          )}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const useQuery = () => {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const SetPasswordElement = () => {
  const query = useQuery()

  return (
    <>
      <Header />
      <SetPassword token={query.get('token')} />
    </>
  )
}

export default AppRouter
