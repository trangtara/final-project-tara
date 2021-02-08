import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { logout } from '../reducers/user'
import NavigationItem from './NavigationItem'

const Navigation = () => {
  const dispatch = useDispatch()
  const location = useLocation();

  return (
    <div>
      <Link className="nav-link" to="/">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </Link>
      <h2>Welcome to Admin home page</h2>
      <p className="other-option-line">* To activate checkin, login with your mobile phone</p>

      <ul className="nav nav-tabs">
        <NavigationItem path="/" currentPath={location.pathname} label="Home" />
        <NavigationItem path="/registration" currentPath={location.pathname} label="Register new attendants" />
        <NavigationItem path="/attendants" currentPath={location.pathname} label="Manage attendants" />
      </ul>
      

      {/* <Link className="nav-link" to="/registration">
        <button
          type="button"
        >
          Create new event
        </button>
      </Link>
      <Link className="nav-link" to="/registration">
        <button
          type="button"
        >
          Register new attendant
        </button>
      </Link>
      <Link className="nav-link" to="/attendants">
        <button
          type="button"
          >Manage attendant list
        </button>
      </Link>
      <Link className="nav-link" to="/">
        <button
          type="button"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      </Link> */}
    </div>
  )
}
 
export default Navigation