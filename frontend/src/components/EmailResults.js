import React from 'react'
import { useSelector } from 'react-redux'

const EmailResults = () => {
  const successfulSendQrCode = useSelector((store) => store.attendant.attendant.successfulSendQrCode)

  const errorMessage = useSelector((store) => store.attendant.attendant.errorMessage)

  return (
    <div>
      { errorMessage &&
      <p>FAIL to send email</p>
      }
      {successfulSendQrCode &&
      <p>SUCCESSfully send email</p>}
    </div>
   )
}
 
export default EmailResults