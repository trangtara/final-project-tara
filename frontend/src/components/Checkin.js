import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkinAttendant, closeCheckin } from '../reducers/attendants'
import Alert from '../components/common/Alert'

import '../styling/pageWrapper.css'
import '../styling/checkin.css'
import '../styling/form.css'

const Checkin = () => {
  const { attendantId } = useParams()
  const [ attendantName, setAttendantName ] = useState('')
  const [ department, setDepartment ] = useState('')
  const [ errorMessage, setErrorMessage] = useState('')

  console.log(attendantName, "attendantName")
  console.log(department, "department")

  const dispatch = useDispatch()

  
  const ATTENDANTDATA = `http://localhost:8080/api/attendant/${attendantId}`
  // const attendant = useSelector((store) => store.attendants.all.find((item) => item._id === attendantId))
  const notices = useSelector((store) => store.attendants.notices)
  console.log(notices, "notices")

  // const checkinStatus = attendant.checkin.checkinStatus

  // const ATTENDANTDATA = `https://event-check-in-app.herokuapp.com/api/attendant/${attendantId}`

  useEffect(() => {
    fetch(ATTENDANTDATA)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not find attendant')
      }
      return res.json()
    })
    .then((json) => {
      setAttendantName(json.attendantName)
      setDepartment(json.department)
    })
    .catch((err) => {
      console.log('ERROR', err)
      setErrorMessage(err.message)
      console.log(errorMessage, "errorMessage")
    })
  }, [ATTENDANTDATA, errorMessage])
  
  const handleCheckin = () => {
    dispatch(checkinAttendant(attendantId))
  }

  const handleCloseCheckin = () => {
    setDepartment(null)
    setAttendantName(null)
    dispatch(closeCheckin())
  }
  
  return (
    <div className="container">
      { notices.length === 0 && !attendantName && !department &&
      <p>Use your phone camera to scan QRcodes of attendants to checkin</p>}
      {errorMessage &&
      <p>{errorMessage}</p>}
      {!errorMessage &&
        <div className="checkin-details-container">
          <p className="checkin-details">
            <span className="checkin-details-title">Name:</span>{attendantName}
          </p>
          <p className="checkin-details">
            <span className="checkin-details-title">Department:</span>{department}
          </p>
          <button
            type="button"
            className="btn btn-primary mr-3"
            onClick={() => handleCheckin()}>
              CHECK-IN
          </button>
        </div>
      }
      {notices.length > 0 && 
        notices[0].type === 'error' &&
        <Alert type={notices[0].type} message={notices[0].message} />
      }
      {notices.length > 0 &&
        notices[0].type === 'success' &&
        <Alert type={notices[0].type} message={notices[0].message} />
      }
      {notices.length > 0 &&
      <button
        type="button" 
        className="btn btn-secondary"
        onClick={() => handleCloseCheckin()}
      >
        Close
      </button>}
    </div>
  )
}
 
export default Checkin