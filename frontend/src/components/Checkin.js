import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkinAttendant } from '../reducers/attendants'
// import CheckinUpdate from './CheckinUpdate'
// import Button from '../components/common/buttons/Button'
import '../styling/pageWrapper.css'
import '../styling/checkin.css'
import '../styling/form.css'

const Checkin = () => {
  const { attendantId } = useParams()
  const [ attendantName, setAttendantName ] = useState('')
  const [ department, setDepartment ] = useState('')

  const dispatch = useDispatch()

  const ATTENDANTDATA = `http://localhost:8080/api/attendant/${attendantId}`

  // const ATTENDANTDATA = `https://event-check-in-app.herokuapp.com/api/attendant/${attendantId}`

  useEffect(() => {
    fetch(ATTENDANTDATA)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Could not find attendant')
    })
    .then((json) => {
      setAttendantName(json.attendantName)
      setDepartment(json.department)
    })
    .catch((err) => {
      console.log('ERROR', err)
    })
  })
  
  const handleCheckin = () => {
    dispatch(checkinAttendant(attendantId))
  }
  
  return (
    <div className="main-container">
      
      <div className="checkin-details-container">
        <p className="checkin-details">
          <span className="checkin-details-title">Name:</span>{attendantName}
        </p>
        <p className="checkin-details">
          <span className="checkin-details-title">Department:</span>{department}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary mr-3"
        onClick={handleCheckin}>
          CHECK-IN
      </button>
      {/* <CheckinUpdate /> */}
    </div>
  )
}
 
export default Checkin