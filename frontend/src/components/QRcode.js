import React from 'react'

const QrCode = ({ qrcode, attendantName }) => {
  return (
    <div className="qrcode-container">
      <p className="result-details">QR code for attendant <span className="result-details-title">{attendantName}</span></p>
      <img src={qrcode} alt="QR code for checkin" />
    </div>
    )
}
 
export default QrCode

