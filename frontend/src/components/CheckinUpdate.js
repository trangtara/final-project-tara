import React from 'react'
import { useSelector } from 'react-redux'

const CheckinUpdate = () => {
  const errorMessage = useSelector((store) => store.checkin.checkin.errorMessage)
  console.log(errorMessage, "errorMessage")
  const successfulCheckin = useSelector((store) => store.checkin.checkin.successfulCheckin)
console.log(successfulCheckin, "successfulCheckin")
  return (
    <div>
      {errorMessage &&
      <p className="fail-result-status">Fail to checkin: {errorMessage}</p>
      }
      {successfulCheckin &&
      <>
        <p className="result-status">SUCCESSfully Checked in</p>
      </>
      }
    </div>
  )
}
 
export default CheckinUpdate