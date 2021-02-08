import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import LoginForm from '../components/LoginForm'


const Login = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div className="container">
      <LoginForm />
      {accessToken && <Redirect to="/" />}
    </div>
  )
}
 
export default Login