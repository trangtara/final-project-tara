import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkin } from '../reducers/attendant'

const Checkin = () => {
  const { attendantId } = useParams()

  console.log("Params AttendantId", attendantId)
  const [ attendantName, setAttendantName ] = useState('')
  const [ department, setDepartment ] = useState('')

  const dispatch = useDispatch()

  const ATTENDANTDATA = `http://localhost:8080/api/attendant/${attendantId}`
// const ATTENDANTDATA = `https://event-check-in-app.herokuapp.com/api/attendant/${attendantId}`

  fetch(ATTENDANTDATA)
  .then((res) => {
    console.log('res', res);
    if (res.ok) {
      return res.json()
    }
    throw new Error('Could not find attendant')
  })
  .then((json) => {
    console.log('JSON', json);
    setAttendantName(json.attendantName)
    setDepartment(json.department)
  })
  .catch((err) => {
    console.log('ERROR', err)
  })
  
  const handleCheckin = (attendantId) => {
    dispatch(checkin(attendantId))
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
    </div>
  )
}
 
export default Checkin