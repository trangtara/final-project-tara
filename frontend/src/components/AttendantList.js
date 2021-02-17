import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

import { fetchAllAttendants } from '../reducers/attendants'
import AttendantListItem from './AttendantListItem'

const ISCOMING_FILTER_VALUE = [
  { value: 'all', label: 'Show all' },
  { value: 'coming', label: 'Coming' },
  { value: 'notComing', label: 'Not Coming' },
]

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
  const [isComingFilter, setIsComingFilter] = useState(ISCOMING_FILTER_VALUE[0].value)
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

    if (isComingFilter === 'coming') {
      filtered = filtered.filter((item) => {
        return item.isComing.isComing === true
      })
    } else if (isComingFilter === 'notComing') {
      filtered = filtered.filter((item) => {
        return item.isComing.isComing === false
      })
    }

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
      filtered = filtered.filter((item) => {
        return item.isEmailSent.emailSent === false
      })
    }
    
    setFilteredAttendants(filtered)
  
  }, [isComingFilter, checkInFilter, allAttendants, sendQrcodeFilter])

  return (
    <div className="row mt-5">
      <div className="container-sm">
        <Form className="row gy-2 gx-3 align-items-center justify-content-end">
        <Form.Group className="col-md-4">
            <Form.Label className="me-3 fw-bold text-primary">Filter by Coming</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setIsComingFilter(e.target.value)}>
              {ISCOMING_FILTER_VALUE.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label className="me-3 fw-bold text-primary">Filter by Checkin</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setCheckinFilter(e.target.value)}>
              {CHECK_IN_FILTER_VALUES.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label className="me-3 fw-bold text-primary">Filter by send QRcode</Form.Label>
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
        <p className="col-auto mt-5 mb-1 bg-info ms-3 rounded fw-bold">Total attendants: {filteredAttendants.length}</p>
      <Table responsive striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Attendant Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>QRcode</th>
            <th>isComing</th>
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
              key={attendant._id}
              index={index}
            />
          ))}
        </tbody>
      </Table>
      {filteredAttendants.length === 0 &&
      <p className="text-center mt-3 fst-italic" >You have no attendants in the list</p>
      }
    </div>
  )
}
 
export default AttendantList