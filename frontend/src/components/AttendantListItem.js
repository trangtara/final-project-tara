import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Spinner from 'react-bootstrap/Spinner'

import { 
  deleteAttendant,
  sendQrcode,
  checkinAttendant 
} from '../reducers/attendants'

const AttendantListItem = (props) => {
  const {
    attendant,
    invitesInProgress,
    checkinsInProgress,
    index
  } = props;
  
  const dispatch = useDispatch()
  const [isSendingInvite, setIsSendingInvite] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  useEffect(() => {
    const isSending = invitesInProgress.includes(attendant._id)
    setIsSendingInvite(isSending)
  }, [invitesInProgress, attendant])

  useEffect(() => {
    const checkingIn = checkinsInProgress.includes(attendant._id)
    setIsCheckingIn(checkingIn)
  }, [checkinsInProgress, attendant])


  const handleSendQrcode = () => {
    dispatch(sendQrcode(attendant._id))
  }

  const handleCheckin = () => {
    dispatch(checkinAttendant(attendant._id))
  }

  const handleDelete = () => {
    dispatch(deleteAttendant(attendant._id))
  }

  return (
    <tr>
      <td>{index + 1}</td>
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
        {isSendingInvite ? <Spinner animation="border" size="sm" role="status" />
          : attendant.isEmailSent.emailSent ?
          <svg xmlns="http://www.w3.org/2000/svg" width="25" fill="#000fff" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
          </svg>
          : "Not Yet"
        }
      </td>
      <td>
        {isCheckingIn ? <Spinner animation="border" size="sm" role="status" />
          : attendant.checkin.checkinStatus ?
          <svg xmlns="http://www.w3.org/2000/svg" width="25" fill="#000fff" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
          </svg>
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
          onClick={() => window.confirm('Are you sure you want to email the Qr code to this attendant?') && handleSendQrcode()}
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
          onClick={() => window.confirm('Are you sure you want to check in this attendant?') && handleCheckin()}
        >
          {attendant.checkin.checkinStatus
            ? "UN-checkin"
            : "Checkin"
          }
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          className="btn btn-danger btn-sm"
          type="button"
          onClick={() => window.confirm('Are you sure you want to remove this attendant out of the database') && handleDelete()}
        >
          Delete
        </Dropdown.Item>
      </DropdownButton>
      </td>
    </tr>
  )
}
 
export default AttendantListItem