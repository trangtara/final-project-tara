import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Checkin from '../components/Checkin'

const CheckinPage = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)

  return (
    <div className="container bg-light bg-gradient">
      <div className="row justify-content-md-center border border-secondary p-5 border-2 rounded">
        <h2 className="row mb-2">Check-in information</h2>
        <Checkin />
      </div>
      {!accessToken && <Redirect to="/" />}
    </div>
   )
}
 
export default CheckinPage