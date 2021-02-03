import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {  registration, qrCodeGenerator } from '../reducers/attendant'
import { logout } from '../reducers/user'
import QrCode from '../components/QRcode'
import '../styling/form.css'
import '../styling/results.css'
import EmailQrcode from './EmailQrcode'

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
      <h1 className="page-title">Register new attendant</h1>
      <form 
      className="form"
      onSubmit={(event) => handleRegister(event)}>
        <h2 className="form-title">Please fill in the information of the event attendant. Input with a * are mandatory</h2>
        <div className="input-container">
          <label className="label">Full name of attendant *</label>
          <input
            className="input"
            required
            type="text"
            value={attendantName}
            onChange={(event) => setAttendantName(event.target.value)}
            />
          <label className="label">Email of attendant *</label>
          <input
          className="input"
          required
          type="email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          value={attendantEmail}
          onChange={(event) => setAttendantEmail(event.target.value)}
          />
          <label className="label">Department of attendant</label>
          <input
          className="input"
          type="text"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          />
        </div>
        <div className="other-option">
          <button
              className="button"
              type="submit"
            >
              Register to get Qr code
          </button>
          <button
            className="logout-button"
            type="button"
            onClick={() => dispatch(logout())}
            >
              Log Out
          </button>
        </div>
      </form>
      {errorMessage &&
        <p className="fail-result-status">FAIL: {errorMessage}</p>
      }
      {successfulRegistration &&
        <div className="result-container">
          <p className="result-status">Attendant's data SUCCESSfully inserted</p>
          <div className="result-elements">
            <div className="result-details-container">
              <p className="result-details">
                <span className="result-details-title">Attendant's name: </span>
                {successfulRegistration.attendantName}</p>

              <p className="result-details">
                <span className="result-details-title"> Attendant's email: </span>
                {successfulRegistration.attendantEmail}
              </p>

              <p className="result-details">
                <span className="result-details-title">Attendant's department: </span>
                {successfulRegistration.department}
              </p>
            </div>
              <QrCode 
                qrcode={qrCode}
                attendantName={successfulRegistration.attendantName}
              />
              <EmailQrcode 
                attendantId={successfulRegistration._id}
                attendantName={successfulRegistration.attendantName}
              />
          </div>
        </div>
      }
    </div>
  )
}

export default RegistrationForm