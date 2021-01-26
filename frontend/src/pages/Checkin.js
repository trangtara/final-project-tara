import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkin } from '../reducers/attendant'

const Checkin = () => {
  const { attendantId } = useParams()
  const dispatch = useDispatch()

  fetch(`https://event-check-in-app.herokuapp.com/api/attendant/${attendantId}`)
  .then((res) => {
    console.log('res', res);
    if (res.ok) {
      return res.json()
    }
    throw new Error('Could not find attendant')
  })
  .then((json) => {
    console.log('JSON', json);
    return json;
  })
  .catch((err) => {
    console.log('ERROR', err)
  })
  
  const handleCheckin = () => {
    dispatch(checkin())
  }

  return (
    <div>
      <h2>Check-in information</h2>
      <p>Name: </p>
      <p>Department:</p>
      <button
      type="submit"
      onClick={handleCheckin}>
        CHECK-IN
      </button>
    </div>
  )
}
 
export default Checkin