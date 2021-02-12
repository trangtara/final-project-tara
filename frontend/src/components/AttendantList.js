import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import { fetchAllAttendants } from '../reducers/attendants'
import AttendantListItem from './AttendantListItem'

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
  const invitesInProgress = useSelector((store) => store.attendants.invitesInProgress)
  const checkinsInProgress = useSelector((store) => store.attendants.checkinsInProgress)

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

  return (
    <div className="row">
      <div className="container-sm">
        <Form className="row gy-2 gx-3 align-items-center justify-content-end">
          <Form.Group className="col-md-4">
            <Form.Label className="me-3">Filter by Checkin</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setCheckinFilter(e.target.value)}>
              {CHECK_IN_FILTER_VALUES.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label className="me-3">Filter by send QRcode</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setSendQrcodeFilter(e.target.value)}>
              {SEND_QRCODE_FILTER_VALUE.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          </Form>
        </div>
        <p>Amount of attendants: {filteredAttendants.length}</p>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
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
          {filteredAttendants && filteredAttendants.map((attendant, index) => (
            <AttendantListItem
              attendant={attendant}
              invitesInProgress={invitesInProgress}
              checkinsInProgress={checkinsInProgress}
              // deletionsInProgress={deletionsInProgress}
              key={attendant._id}
              index={index}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
 
export default AttendantList