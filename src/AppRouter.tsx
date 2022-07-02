import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
import Article from './Pages/Article'
import Articles from './Pages/Articles'
import ChangePassword from './Pages/ChangePassword'
import Education from './Pages/Education'
import ForgottenPassword from './Pages/ForgottenPassword'
import Header from './Pages/Header'
import Introduction from './Pages/Introduction'
import Jobs from './Pages/Jobs'
import Login from './Pages/Login'
import Patent from './Pages/Patent'
import React, { useContext, useEffect, useState } from 'react'
import Registration from './Pages/Registration'
import Residency from './Pages/Residency'
import SetPassword from './Pages/SetPassword'
import User from './Pages/User'

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
                path='/user'
                element={
                  <>
                    <Header />
                    <User />
                  </>
                }
              />
              <Route
                path='/jobs'
                element={
                  <>
                    <Header />
                    <Jobs />
                  </>
                }
              />
              <Route
                path='/education'
                element={
                  <>
                    <Header />
                    <Education />
                  </>
                }
              />
              <Route
                path='/residency'
                element={
                  <>
                    <Header />
                    <Residency />
                  </>
                }
              />
              <Route
                path='/patent'
                element={
                  <>
                    <Header />
                    <Patent />
                  </>
                }
              />
              <Route
                path='/introduction'
                element={
                  <>
                    <Header />
                    <Introduction />
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
