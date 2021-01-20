import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import LoginForm from '../components/LoginForm'


const Login = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      {accessToken && <Redirect to="/registration" />}
    </div>
  )
}
 
export default Login;