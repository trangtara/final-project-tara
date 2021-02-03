import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RegistrationForm from '../components/RegistrationForm'
import LoadingIndicator from '../components/LoadingIndicator'

const Registration = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  //const errorMessage = useSelector((store) => store.attendant.attendant.errorMessage)
  return (
    <div className="main-container">
      {accessToken &&
        <div>
          <LoadingIndicator />
          <RegistrationForm/>
        </div>
      }
      {!accessToken && <Redirect to="/" />}
    </div>
    )
}
 
export default Registration