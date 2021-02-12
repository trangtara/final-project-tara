import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkinAttendant, closeCheckin } from '../reducers/attendants'
import Alert from '../components/common/Alert'

import '../styling/checkin.css'

const Checkin = () => {
  const { attendantId } = useParams()
  const [ attendantName, setAttendantName ] = useState('')
  const [ department, setDepartment ] = useState('')
  const [ errorMessage, setErrorMessage] = useState('')

  console.log(attendantName, "attendantName")
  console.log(department, "department")

  const dispatch = useDispatch()

  
  const notices = useSelector((store) => store.attendants.notices)
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  const ATTENDANTDATA = `${REACT_APP_API_URL}/attendant/${attendantId}`

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
      setErrorMessage(err.message)
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
    <div>
      {!attendantName && !department &&
      <p className="row py-3">Use your phone camera to scan QRcodes of attendants to checkin</p>
      }
      {errorMessage &&
      <p>{errorMessage}</p>
      }
      {!errorMessage &&
        <div className="col">
          <p className="row">
            Name: {attendantName}
          </p>
          <p className="row">
            Department: {department}
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
        <>
          <Alert type={notices[0].type} message={notices[0].message} />
          <button
            type="button" 
            className="btn btn-secondary"
            onClick={() => handleCloseCheckin()}
            >
            Close
          </button>
        </>
      }
    </div>
  )
}
 
export default Checkin