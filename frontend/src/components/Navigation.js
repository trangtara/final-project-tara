import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { logout } from '../reducers/user'
import Button from '../components/common/buttons/Button'


import '../styling/pageWrapper.css'
import '../styling/form.css'

const Navigation = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <h2 className="page-title">Welcome to Admin home page</h2>
      <p className="second-title">Choose what you want to do next</p>
      <Link className="nav-link" to="/registration">
      <Button
        type="button"
        text="Register new attendant"
      />
      </Link>
      <Link className="nav-link" to="/attendants">
      <Button
        type="button"
        text="Manage attendant list"
      />
      </Link>
      <Link className="nav-link" to="/">
        <Button
          type="button"
          onClick={() => dispatch(logout())}
          text="Logout"
        />
      </Link>
      <p className="other-option-line">* To activate checkin, login with your mobile phone</p>
    </div>
  )
}
 
export default Navigation