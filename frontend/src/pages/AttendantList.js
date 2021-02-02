import React, { useEffect, useState } from 'react'

// import CheckinUpdate from '../components/CheckinUpdate'
import '../styling/pageWrapper.css'
import '../styling/checkin.css'
import '../styling/form.css'
import '../styling/table.css'

const AttendantList = () => {
  const [allAttendants, setAllAttendants] = useState([])

  const allAttendant_URL = 'http://localhost:8080/api/attendants'

  // const allAttendant_URL = `https://event-check-in-app.herokuapp.com/api/attendants`

  useEffect(() => {
    fetch(allAttendant_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not find attendant')
      }
      return res.json()
    })
    .then((json) => {
      console.log('json',json)
      setAllAttendants(json)
    })
    .catch((err) => {
      console.log('ERROR', err)
    })
  }, [])
  
  return (
    <div className="main-container">
      <h2 className="page-title">List of all attendants</h2>
      <table className="table">
        <tbody>
          <tr>
            <th className="table-header">Attendant Id</th>
            <th className="table-header">Attendant Name</th>
            <th className="table-header">Department</th>
            <th className="table-header">Email</th>
            <th className="table-header">QRcode</th>
            <th className="table-header">Checkin status</th>
            <th className="table-header">Sent QR code</th>
            <th className="table-header">Manual checkin</th>
            <th className="table-header">Delete</th>
          </tr>
          {allAttendants.map((attendant) => (
            <tr key={attendant._id}>
              <td className="table-cell">{attendant._id}</td>
              <td className="table-cell">{attendant.attendantName}</td>
              <td className="table-cell">{attendant.attendantEmail}</td>
              <td className="table-cell">{attendant.department}</td>
              <td className="table-cell"><img className="qrcode-image"src={attendant.qrCode} alt="qrCode"/></td>
              {(attendant.checkinStatus)
              ? <td className="table-cell"> Yes</td>
              : <td className="table-cell"> Not Yet</td>
              }
              <td className="table-cell"><button className="action-button" type="button">Send QR code</button></td>
              <td className="table-cell"><button className="action-button" type="button">Manual checkin</button></td>
              <td className="table-cell"><button className="action-button" type="button">🗑</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default AttendantList