import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

import { deleteAttendant, sendQrcode, fetchAllAttendants, checkinAttendant } from '../reducers/attendants'


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
                {attendant.isEmailSent.emailSent
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="25" fill="#000fff" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
                  </svg>
                  : "Not Yet"
                }
              </td>
              <td>
                {attendant.checkin.checkinStatus
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="25" fill="#000fff" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/></svg>
                  : "Not Yet"
                }
              </td>
              <td>
              <DropdownButton 
              id="dropdown-item-button"
              title="Action">
                <Dropdown.Item
                  as="button"
                  className="btn btn-primary btn-sm" 
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to email the Qr code to this attendant?') &&handleSendQrcode({ attendantId: attendant._id })}
                >
                {!attendant.isEmailSent.emailSent
                  ? "Send QRcode"
                  : "Resend QRcode"
                }
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  className="btn btn-primary btn-sm" 
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to check in this attendant?') && handleCheckin({ attendantId: attendant._id })}
                >
                  {attendant.checkin.checkinStatus
                    ? "Re-checkin"
                    : "Checkin"
                  }
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to remove this attendant out of the database') &&handleDelete({ attendantId: attendant._id })}
                >
                  Delete
                </Dropdown.Item>
              </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default AttendantList