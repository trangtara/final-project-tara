import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import SignupForm from '../components/SignupForm'

const SignUp = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  return (
    <div>
      <h1>Sign Up</h1>
      <SignupForm/>
      {accessToken && <Redirect to="/login"/>}
    </div>
  )
}
 
export default SignUp