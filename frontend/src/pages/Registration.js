import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RegistrationForm from '../components/RegistrationForm'

const Registration = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)
  //const errorMessage = useSelector((store) => store.attendant.attendant.errorMessage)
  return (
    <div className="main-container">
      {accessToken &&
        <div>
          <RegistrationForm/>
        </div>
      }
      {!accessToken && <Redirect to="/" />}
    </div>
    )
}
 
export default Registration