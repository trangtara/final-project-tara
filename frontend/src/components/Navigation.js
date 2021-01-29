import React from 'react'
import { Link } from 'react-router-dom'

import '../styling/pageWrapper.css'
import '../styling/form.css'

const Navigation = () => {
  return (
    <div>
      <h2 className="page-title">Welcome to Admin home page</h2>
      <p className="second-title">Choose what you want to do next</p>
      <Link className="nav-link" to="/registration">
      <button
      className="button"
      type="button">
        Register new attendant
      </button>
      </Link>
      <Link className="nav-link" to="/statistic">
      <button
      className="button"
      type="button">
      Manage registration
      </button>
      </Link>
      <p>* To activate checkin, login with your mobile phone</p>
    </div>
  )
}
 
export default Navigation