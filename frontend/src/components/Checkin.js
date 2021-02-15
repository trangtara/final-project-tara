import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { checkinCheckOutAttendant, closeWindow } from '../reducers/attendants'
import Alert from '../components/common/Alert'

import '../styling/checkin.css'

const Checkin = () => {
  const { attendantId } = useParams()
  const [ attendantName, setAttendantName ] = useState('')
  const [ department, setDepartment ] = useState('')
  const [isCheckin, setIsCheckin] = useState(false)
  const [ errorMessage, setErrorMessage] = useState('')
  const [clearInfoMessage, setClearInfoMessage] = useState(false)

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
      setIsCheckin(json.checkin.checkinStatus)
    })
    .catch((err) => {
      setErrorMessage(err.message)
    })
  }, [ATTENDANTDATA, errorMessage])
  
  const handleCheckinCheckout = () => {
    dispatch(checkinCheckOutAttendant(attendantId))
  }

  const handleCloseCheckin = () => {
    setDepartment(null)
    setAttendantName(null)
    dispatch(closeWindow())
    setClearInfoMessage(true)
  }
  
  return (
    <div className="mt-3">
      {!attendantName && !department &&
      <p className="row py-3 text-primary fw-bold">Use your phone camera to scan QRcodes of attendants to checkin</p>
      }
      {errorMessage &&
      <p className="row ps-2 text-warning bg-dark">{errorMessage}</p>
      }
      {!errorMessage &&
        <div className="col">
          <p>
            Name: <span className="text-primary ps-3 fs-5 text-uppercase">{attendantName}</span>
          </p>
          <p>
            Department: <span className="text-primary ps-3 fs-5 text-uppercase">{department}</span>
          </p>
          {!isCheckin && !clearInfoMessage &&
            <>
              <p className="row bg-info py-2 ps-2 fw-bold">Do you want to check IN this attendant? </p>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => handleCheckinCheckout()}>
                  CHECK-IN
              </button>
            </>
          }
          {isCheckin && !clearInfoMessage &&
            <>
              <p className="row bg-info py-2 ps-2 fw-bold">Already check in. Do you want to check OUT this attendant?</p>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => handleCheckinCheckout()}>
                  CHECK-OUT
              </button>
            </>
          }
        </div>
      }
      {notices.length > 0 && 
      <>
          <div className="row mt-3">
            <Alert type={notices[0].type} message={notices[0].message} />
          </div>
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