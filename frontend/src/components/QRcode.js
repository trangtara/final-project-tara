import React from 'react'

const QrCode = ({ qrcode, attendantName }) => {
  return (
    <div>
      <p>QR code for attendant {attendantName}</p>
      <img src={qrcode} alt="QR code for checkin" />
    </div>
    )
}
 
export default QrCode

