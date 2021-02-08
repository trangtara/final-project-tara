import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { deleteAttendant, sendQrcode, fetchAllAttendants, checkinAttendant } from '../reducers/attendants'
import { logout } from '../reducers/user'


const AttendantList = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllAttendants())
  }, [])

  const allAttendants = useSelector((store) => store.attendants.all)

  const handleSendQrcode = ({ attendantId }) => {
    dispatch(sendQrcode(attendantId))
  }

  const handleCheckin = ({ attendantId }) => {
    dispatch(checkinAttendant(attendantId))
  }

  const handleDelete = ({ attendantId }) => {
    console.log(attendantId, "attendantId of handle delete")
    dispatch(deleteAttendant(attendantId))
  }
  
  return (
    <div className="row">
      <Link className="nav-link" to="/">
        <button
          className="btn btn-primary btn-sm"
          type="button"
          onClick={() => dispatch(logout())}
        >Logout</button>
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Attendant Id</th>
            <th>Attendant Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>QRcode</th>
            <th>QRcode sent</th>
            <th>Checkin status</th>
            <th>Actions</th>
            {/* <th>Generate QR code</th>
            <th>Sent QR code</th>
            <th>Manual checkin</th>
            <th>Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {allAttendants && allAttendants.map((attendant) => (
            <tr key={attendant._id}>
              <td>{attendant._id}</td>
              <td>{attendant.attendantName}</td>
              <td>{attendant.attendantEmail}</td>
              <td>{attendant.department}</td>
              <td>
                {attendant.qrCode 
                  ? <img className="qrcode-image"src={attendant.qrCode} alt="qrCode"/>
                  : <p className="qrcode-image">N/A</p>
                }
              </td>
              <td>
                {(attendant.isEmailSent.emailSent)
                  ? "Yes"
                  : "Not Yet"
                }
              </td>
              <td>
                {(attendant.checkin.checkinStatus)
                  ? "Yes"
                  : "Not Yet"
                }
              </td>
              <td>
                <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-sm" 
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to email the Qr code to this attendant?') &&handleSendQrcode({ attendantId: attendant._id })}
                  >
                    Send QR code
                </button>
                <button
                  className="btn btn-primary btn-sm" 
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to check in this attendant?') && handleCheckin({ attendantId: attendant._id })}
                  >
                  Check in
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to remove this attendant out of the database') &&handleDelete({ attendantId: attendant._id })}
                >🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default AttendantList