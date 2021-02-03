import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoadingIndicator from '../components/LoadingIndicator'

import LoginForm from '../components/LoginForm'


const Login = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div className="main-container">
      <LoadingIndicator />
      <LoginForm />
      {accessToken && <Redirect to="/navigation" />}
    </div>
  )
}
 
export default Login