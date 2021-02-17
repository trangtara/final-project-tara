import React, { useState }  from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { confirmation } from '../reducers/attendants'


const Confirmation = () => {
  const { attendantId } = useParams()
  const dispatch = useDispatch()
  
  const notices = useSelector((store) => store.attendants.notices)
  const [ clearDisplay, setClearDisplay ] = useState(false)
  
  const handleConfirmation = ({ attendantId, isComing }) => {
    dispatch(confirmation({ isComing, attendantId }))
    setClearDisplay(true)
  }

  return (
    <div>
      {!clearDisplay &&
        <div className="mt-5 row justify-content-center">
          <div className="col-8">
            <p className="fs-6 text-center">Please confirm your participation to the event</p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button
                className="mx-3 btn btn-primary me-md-2"
                type="button"
                onClick={() => handleConfirmation({isComing: true, attendantId: attendantId})}
              >
                Confirm
              </button>
              <button
                className="mx-3 btn btn-secondary"
                type="button"
                onClick={() => handleConfirmation({isComing: false, attendantId: attendantId})}
              >
                Sorry, I will not come
              </button>
            </div>
          </div>
        </div>
      }
      {clearDisplay &&
      <>
        {notices.length > 0 &&
          <>
            {notices[0].type === 'success' &&
            <div className="mt-5 row justify-content-center">
              <div className="col-8 align-self-start">
                <p className="text-success text-center fs-4 fw-bold">Your confirmation is successfully updated!</p>
                <p>If you change your mind, you can reopen the link in the email and update your confirmation</p>
              </div>
            </div>
            }
            {notices[0].type === 'error' &&
            <p className="text-danger fs-4 fw-bold">Fail to update your response. Please try again later or contact the admin</p>}
          </>
        }
      </>
      }
    </div>
  )
}

export default Confirmation