import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {  registration, qrCodeGenerator } from '../reducers/attendant'
import { logout } from '../reducers/user'
import QrCode from '../components/QRcode'


const RegistrationForm = () => {
  const [attendantName, setAttendantName] = useState('')
  const [department, setDepartment] = useState('')
  const [attendantEmail, setAttendantEmail] = useState('')
  const dispatch = useDispatch()
  const errorMessage = useSelector((store) => store.attendant.attendant.errorMessage)
  const successfulRegistration = useSelector((store) => store.attendant.attendant.successfulRegistration)
  const qrCode = useSelector((store) => store.attendant.attendant.qrCode)

  const handleRegister = (event) => {
    event.preventDefault()
    dispatch(registration(attendantName, department, attendantEmail))
  }
  //What to do with the []
  useEffect(() => {
    if (successfulRegistration) {
      dispatch(qrCodeGenerator())
    }
  })

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
          onClick={handleRegister}>
          Register to get Qr code
        </button>
        <button
        type="button"
        onClick={() => dispatch(logout())}
        >
          Log Out
        </button>
      </form>
      {errorMessage &&
        <p>FAIL: {errorMessage}</p>
      }
      {successfulRegistration &&
      <>
        <p>SUCCESSfully inserted:</p>
        <p>Attendant's name: {successfulRegistration.attendantName}</p>
        <p>Attendant's email: {successfulRegistration.attendantEmail}</p>
        <p>Attendant's department: {successfulRegistration.department}</p>
        {qrCode &&
          <QrCode qrcode={qrCode} />
        }
      </>
        
      }
    </div>
    )
}
 
export default RegistrationForm