import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeResultDisplay, addNewAttendant } from '../reducers/attendants'
import { sendQrcode } from '../reducers/attendants'
import Alert from './common/Alert'

const RegistrationForm = () => {
  const [attendantName, setAttendantName] = useState('')
  const [department, setDepartment] = useState('')
  const [attendantEmail, setAttendantEmail] = useState('')

  const dispatch = useDispatch()
  
  const notices = useSelector((store) => store.attendants.notices)
  const currentAttendantId = useSelector((store) => store.attendants.currentAttandantId)
  const currentAttendant = useSelector((store) => store.attendants.all.find((item) => item._id === currentAttendantId))

  const handleRegister = (event) => {
    event.preventDefault()
    dispatch(addNewAttendant({
      department,
      name: attendantName,
      email: attendantEmail
    }))
    setAttendantName('')
    setDepartment('')
    setAttendantEmail('')
  }

  return (
    <div>
      <form onSubmit={(event) => handleRegister(event)}>
        <h3>Register new attendant</h3>
        <p>Please fill in the information of the event attendant. Input with a * are mandatory</p>
        <div className="container">
          <div className="form-floating mb-3">
            <input
              required
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Attendant's fullname"
              value={attendantName}
              onChange={(event) => setAttendantName(event.target.value)}
            />
            <label htmlFor="floatingInput">Full name of attendant *</label>
          </div>
          <div className="form-floating mb-3">
            <input
              required 
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              value={attendantEmail}
              onChange={(event) => setAttendantEmail(event.target.value)}
            />
            <label htmlFor="floatingInput">Email of attendant *</label>
          </div>
          <div className="form-floating mb-3">
            <input
            className="form-control"
            type="text"
            id="floatingInput"
            placeholder="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            />
            <label htmlFor="floatingInput">Department</label>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            >
            Register
          </button>
        </div>
      </form>
      <div>
        {notices && notices.map((notice) => (
          <div key={notice.location}>
          {notice.location === 'registration' &&
            <Alert type={notice.type} message={notice.message} />
          }
          </div>
        ))}
        
        {currentAttendant &&
          <div className="card">
            <div className="card-header">Registered attentant</div>
            <div className="row g-0">
              <div className="col-md-3">
                <img src={currentAttendant.qrCode} alt="QR code" className="card-img-top" />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  <ul className="list-group mb-4">
                    <li className="list-group-item">Name: <b>{currentAttendant.attendantName}</b></li>
                    <li className="list-group-item">Email: <b>{currentAttendant.attendantEmail}</b></li>
                    <li className="list-group-item">Department: <b>{currentAttendant.department}</b></li>
                  </ul>
                  <h5 className="card-title">Send invite</h5>
                  <p className="card-text">
                    Do you want to send an invite with the QR-code in an email to the attentant?
                  </p>
                  {notices && notices.map((notice) => ( 
                    <div key={notice.location}>
                    {notice.location === 'qrcode' &&
                      <Alert type={notice.type} message={notice.message} />
                    }
                    </div>
                  ))}
                  {!currentAttendant.isEmailSent.emailSent &&
                  <div className="row gx-2">
                    <div className="col-md-auto">
                      <button
                        type="button"
                        className="btn btn-primary mr-3"
                        onClick={() => dispatch(sendQrcode(currentAttendant._id))}
                      >
                        Send QR code
                      </button>
                    </div>
                    <div className="col-md-auto">
                      <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => dispatch(closeResultDisplay())}>
                        Later
                      </button>
                    </div>
                  </div>
                  }
                  {currentAttendant.isEmailSent.emailSent &&
                  <button
                    type="button"
                    className="btn btn-primary mr-3"
                    onClick={() => dispatch(closeResultDisplay())}
                  >
                    Close
                  </button>
                  }

                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default RegistrationForm