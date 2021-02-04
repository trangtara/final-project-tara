import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Button from '../components/common/buttons/Button'
import { sendQrcode } from '../reducers/attendant'
import { checkinUpdate } from '../reducers/checkin'
import { deleteAttendant } from '../reducers/attendant'
import { qrCodeGenerator } from '../reducers/attendant'
import { logout } from '../reducers/user'

// import CheckinUpdate from '../components/CheckinUpdate'
import '../styling/pageWrapper.css'
import '../styling/checkin.css'
import '../styling/form.css'
import '../styling/table.css'

const AttendantList = () => {
  const [allAttendants, setAllAttendants] = useState([])

  const dispatch = useDispatch()

  const allAttendant_URL = 'http://localhost:8080/api/attendants'

  // const allAttendant_URL = `https://event-check-in-app.herokuapp.com/api/attendants`

  useEffect(() => {
    fetch(allAttendant_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not find attendant')
      }
      return res.json()
    })
    .then((json) => {
      setAllAttendants(json)
    })
    .catch((err) => {
      console.log('ERROR', err)
    })
  }, [])


  const handleGenerateQrcode = (attendantId) => {
    dispatch(qrCodeGenerator(attendantId))
  }

  const handleSendQrcode = (attendantId) => {
    dispatch(sendQrcode(attendantId))
  }

  const handleCheckin = (attendantId) => {
    dispatch(checkinUpdate(attendantId))
  }

  const handleDelete = (attendantId) => {
    dispatch(deleteAttendant(attendantId))
  }
  
  return (
    <div className="main-container">
      <Link className="nav-link" to="/">
        <Button
          type="button"
          onClick={() => dispatch(logout())}
          text="Logout"
          />
      </Link>
      <table className="table">
        <tbody>
          <tr>
            <th className="table-header">Attendant Id</th>
            <th className="table-header">Attendant Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Department</th>
            <th className="table-header">QRcode</th>
            <th className="table-header">QRcode sent</th>
            <th className="table-header">Checkin status</th>
            <th className="table-header">Generate QR code</th>
            <th className="table-header">Sent QR code</th>
            <th className="table-header">Manual checkin</th>
            <th className="table-header">Delete</th>
          </tr>
          {allAttendants.map((attendant) => (
            <tr key={attendant._id}>
              <td className="table-cell">{attendant._id}</td>
              <td className="table-cell">{attendant.attendantName}</td>
              <td className="table-cell">{attendant.attendantEmail}</td>
              <td className="table-cell">{attendant.department}</td>
              <td className="table-cell">
                {attendant.qrCode 
                  ? <img className="qrcode-image"src={attendant.qrCode} alt="qrCode"/>
                  : <p className="qrcode-image">N/A</p>
                }
              </td>
              <td className="table-cell">
                {(attendant.isEmailSent.emailSent)
                  ? "Yes"
                  : "Not Yet"
                }
              </td>
              <td className="table-cell">
                {(attendant.checkin.checkinStatus)
                  ? "Yes"
                  : "Not Yet"
                }
              </td>
              <td className="table-cell">
                <Button 
                  type="button"
                  onClick={() => handleGenerateQrcode(attendant._id)}
                  text="Generate QR code"
                />
              </td>
              <td className="table-cell">
                <Button 
                  type="button"
                  onClick={() => handleSendQrcode(attendant._id)}
                  text="Send QR code"
                />
              </td>
              <td className="table-cell">
                <Button 
                  type="button"
                  onClick={() => handleCheckin(attendant._id)}
                  text="Manual checkin"
                />
              </td>
              <td className="table-cell">
                <Button 
                  type="button"
                  onClick={() => handleDelete(attendant._id)}
                  text="🗑"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default AttendantList