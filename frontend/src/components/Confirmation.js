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
      <>
        <p>Please confirm your participation to the event</p>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleConfirmation({isComing: true, attendantId: attendantId})}
        >
          Confirm
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleConfirmation({isComing: false, attendantId: attendantId})}
        >
          Sorry, I will not come
        </button>
      </>
      }
      {clearDisplay &&
      <>
        {notices.length > 0 &&
          <>
            {notices[0].type === 'success' &&
            <>
              <p>Your confirmation is successfully updated</p>
              <p>If you change your mind, you can reopen the confirm link in the email and change your confirmatioin</p>
            </>
            }
            {notices[0].type === 'error' &&
            <p>Fail to update your response. Please try again later or contact the admin</p>}
          </>
        }
      </>
      }
    </div>
  )
}

export default Confirmation