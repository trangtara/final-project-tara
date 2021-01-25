import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { checkin } from '../reducers/attendant'

const Checkin = () => {
  const dispatch = useDispatch()

  const checkinName = useSelector((store) => store.attendant.attendant.attendantName)
  console.log(checkinName, "checkinName")
  const checkinDept = useSelector((store) => store.attendant.attendant.department)
  console.log(checkinDept, "checkinDept")

  const handleCheckin = () => {
    dispatch(checkin())
  }
  return (
    <div>
      <h2>Check-in information</h2>
      <p>Name: {checkinName} </p>
      <p>Department: {checkinDept}</p>
      <button
      type="submit"
      onClick={handleCheckin}>
        CHECK-IN
      </button>
    </div>
  )
}
 
export default Checkin