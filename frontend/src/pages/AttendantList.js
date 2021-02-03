import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { sendQrcode } from '../reducers/attendant'
import { checkinUpdate } from '../reducers/checkin'
import { deleteAttendant } from '../reducers/attendant'

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
      <h2 className="page-title">List of all attendants</h2>
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
                <button 
                  className="action-button"
                  type="button"
                  onClick={() => handleSendQrcode(attendant._id)}>
                    Send QR code
                </button>
              </td>
              <td className="table-cell">
                <button 
                  className="action-button" 
                  type="button"
                  onClick={() => handleCheckin(attendant._id)}>
                    Manual checkin
                </button>
              </td>
              <td className="table-cell">
                <button 
                  className="action-button"
                  type="button"
                  onClick={() => handleDelete(attendant._id)}>
                    🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default AttendantList