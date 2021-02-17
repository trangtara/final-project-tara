import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Checkin from '../components/Checkin'

const CheckinPage = () => {
  const accessToken = useSelector((store) => store.user.login.accessToken)

  return (
    <div className="container mt-5 bg-secondary bg-gradient">
      <div className="row justify-content-center border p-5 border-2 rounded">
        <h2 className="mb-2 text-center text-white">Check-in information</h2>
        <Checkin />
      </div>
      {!accessToken && <Redirect to="/" />}
    </div>
   )
}
 
export default CheckinPage