import React from 'react'

const QrCode = ({ qrcode }) => {
  console.log( "qrCode got rendered in the component", qrcode)
  return (
    <div>
      <p>QR code</p>
      <img src={qrcode} alt="QR code for checkin" />
    </div>
    )
}
 
export default QrCode

