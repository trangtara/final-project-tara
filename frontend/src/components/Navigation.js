import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <div>
      <h2>Welcome to Admin home page</h2>
      <p>Choose what you want to do next</p>
      <Link to="/registration">
      <button
      type="button">
        Register new attendant
      </button>
      </Link>
      <Link to="/checkin/:attendantId">
      <button
      type="button">
      Activate checkin
      </button>
      </Link>
    </div>
  )
}
 
export default Navigation