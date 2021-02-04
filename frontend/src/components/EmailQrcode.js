import React from 'react'
import { useDispatch } from 'react-redux'

import { sendQrcode } from '../reducers/attendant'
import EmailResults from './EmailResults';
import Button from '../components/common/buttons/Button'

const EmailQrcode = ({ attendantId }) => {
  const dispatch = useDispatch();
  
  const handleEmailQrcode = () => {
    dispatch(sendQrcode(attendantId))
  }
  return (
    <div>
      <Button
        type="button"
        onClick={() => handleEmailQrcode()}
        text="Send QR code to attendant"
      />
      <EmailResults />
    </div>
  )
}
 
export default EmailQrcode;