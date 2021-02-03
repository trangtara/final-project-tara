import React from 'react'
import { useDispatch } from 'react-redux'

import { sendQrcode } from '../reducers/attendant'
import EmailResults from './EmailResults';

const EmailQrcode = ({ attendantId }) => {
  const dispatch = useDispatch();
  
  const handleEmailQrcode = () => {
    dispatch(sendQrcode(attendantId))
  }
  return (
    <div>
      <button
        type="button"
        className="button"
        onClick={() => handleEmailQrcode()}>
        Send QR code to attendant
      </button>
      <EmailResults />
    </div>
  )
}
 
export default EmailQrcode;