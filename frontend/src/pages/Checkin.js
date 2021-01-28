import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkinUpdate } from '../reducers/checkin'
import CheckinUpdate from '../components/CheckinUpdate'

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
    dispatch(checkinUpdate(attendantId))
  }
  
  return (
    <div>
      <h2>Check-in information</h2>
      <p>Name: {attendantName}</p>
      <p>Department: {department}</p>
      <button
      type="submit"
      onClick={handleCheckin}>
        CHECK-IN
      </button>
      <CheckinUpdate />
    </div>
  )
}
 
export default Checkin