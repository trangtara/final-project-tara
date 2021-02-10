import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import { 
  deleteAttendant,
  sendQrcode,
  fetchAllAttendants,
  checkinAttendant 
} from '../reducers/attendants'


import LoadingIndicator from '../components/LoadingIndicator'

const CHECK_IN_FILTER_VALUES = [
  { value: 'all', label: 'Show all' },
  { value: 'only-checkin', label: 'Check-in' },
  { value: 'not-yet-checkin', label: 'Not yet' },
]

const SEND_QRCODE_FILTER_VALUE = [
  {value: 'all', label: 'Show all'},
  {value: 'sent', label: 'Already-sent'},
  {value: 'not-yet-sent', label: 'Not yet'}
]

const AttendantList = () => {
  const dispatch = useDispatch()
  const allAttendants = useSelector((store) => store.attendants.all)
  const [checkInFilter, setCheckinFilter] = useState(CHECK_IN_FILTER_VALUES[0].value)
  const [sendQrcodeFilter, setSendQrcodeFilter] = useState(SEND_QRCODE_FILTER_VALUE[0].value)
  const [filteredAttendants, setFilteredAttendants] = useState(allAttendants)

  useEffect(() => {
    dispatch(fetchAllAttendants())
  }, [dispatch])

  useEffect(() => {
    let filtered = allAttendants

    if (checkInFilter === 'only-checkin') {
      filtered = filtered.filter((item) => {
        return item.checkin.checkinStatus === true
      })
    } else if (checkInFilter === 'not-yet-checkin') {
      filtered = filtered.filter((item) => {
        return item.checkin.checkinStatus === false
      })
    }

    if (sendQrcodeFilter === 'sent') {
      filtered = filtered.filter((item) => {
        return item.isEmailSent.emailSent === true
      })
    } else if (sendQrcodeFilter === 'not-yet-sent') {
      console.log(filtered, "not yet sent")
      filtered = filtered.filter((item) => {
        return item.isEmailSent.emailSent === false
      })
    }
    
    setFilteredAttendants(filtered)
  
  }, [checkInFilter, allAttendants, sendQrcodeFilter])

  const handleSendQrcode = ({ attendantId }) => {
    dispatch(sendQrcode(attendantId))
  }

  const handleCheckin = (attendantId) => {
    console.log(attendantId, "attendantId in handleCheckin")
    dispatch(checkinAttendant(attendantId))
  }

  const handleDelete = ({ attendantId }) => {
    dispatch(deleteAttendant(attendantId))
  }

  return (
    <div className="row">
      <Form>
        <Form.Group>
          <Form.Label>Filter by Checkin</Form.Label>
          <Form.Control as="select" custom onChange={(e) => setCheckinFilter(e.target.value)}>
            {CHECK_IN_FILTER_VALUES.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Filter by send QRcode</Form.Label>
          <Form.Control as="select" custom onChange={(e) => setSendQrcodeFilter(e.target.value)}>
            {SEND_QRCODE_FILTER_VALUE.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        </Form>
        <LoadingIndicator />
      <Table responsive striped bordered hover size="sm">
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
          </tr>
        </thead>
        <tbody>
          {filteredAttendants && filteredAttendants.map((attendant) => (
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
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="25" fill="#000fff" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
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
                  onClick={() => window.confirm('Are you sure you want to email the Qr code to this attendant?') && handleSendQrcode({ attendantId: attendant._id })}
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
                    ? "UN-checkin"
                    : "Checkin"
                  }
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  className="btn btn-danger btn-sm"
                  type="button"
                  onClick={() => window.confirm('Are you sure you want to remove this attendant out of the database') && handleDelete({ attendantId: attendant._id })}
                >
                  Delete
                </Dropdown.Item>
              </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
 
export default AttendantList