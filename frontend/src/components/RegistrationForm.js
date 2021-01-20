import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import {  registration } from '../reducers/attendant'
import { logout } from '../reducers/user'


const RegistrationForm = () => {
  const [attendantName, setAttendantName] = useState('')
  const [department, setDepartment] = useState('')
  const [attendantEmail, setAttendantEmail] = useState('')
  const dispatch = useDispatch()

  const handleRegister = (event) => {
    event.preventDefault()
    dispatch(registration(attendantName, department, attendantEmail))
  }
  return (
    <div>
      <form>
        <h2>Please fill in the information of the event attendant. Input with a * are mandatory</h2>
        <label>
        Full name of attendant
          <input
            required
            type="text"
            value={attendantName}
            onChange={(event) => setAttendantName(event.target.value)}/>
        </label>
        <label>
        Department of attendant
          <input
          type="text"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}/>
        </label>
        <label>
        Email of attendant
          <input
          required
          type="email"
          value={attendantEmail}
          onChange={(event) => setAttendantEmail(event.target.value)}/>
        </label>
        <button
          type="submit"
          onChange={handleRegister}>
          Register
        </button>
        <button
        type="button"
        onClick={(event) => dispatch(logout())}
        >
          Log Out
        </button>
      </form>
    </div>
    );
}
 
export default RegistrationForm;