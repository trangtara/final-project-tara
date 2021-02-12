import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { logout } from '../reducers/user'
import NavigationItem from './NavigationItem'

const Navigation = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  return (
    <div>
      <div className="row justify-content-around align-items-center py-4">
        <div className="col align-self-start">
          <h2>Welcome to Admin home page</h2>
          <p className="other-option-line">* To activate checkin, login with your mobile phone</p>
        </div>
        <div className="col-auto me-auto">
          <Link to="/">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </Link>
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <NavigationItem path="/" currentPath={location.pathname} label="Home" />
        <NavigationItem path="/registration" currentPath={location.pathname} label="Register new attendants" />
        <NavigationItem path="/attendants" currentPath={location.pathname} label="Manage attendants" />
      </ul>
    </div>
  )
}
 
export default Navigation