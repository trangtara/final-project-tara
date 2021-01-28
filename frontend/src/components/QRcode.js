import React from 'react'

const QrCode = ({ qrcode }) => {
  return (
    <div>
      <p>QR code</p>
      <img src={qrcode} alt="QR code for checkin" />
    </div>
    )
}
 
export default QrCode

