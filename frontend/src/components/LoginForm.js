import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { login } from '../reducers/user'
import '../styling/form.css'
import '../styling/pageWrapper.css'


const LoginForm = () => {
  const dispatch = useDispatch()
  const errorMessage = useSelector((store) => store.user.login.errorMessage)
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    dispatch(login(email, password))
  }
  return (
    <div className="main-content">
      <h2 className="form-title">Login your account</h2>
      <form className="form">
        <div className="input-container">
          <label className="label" htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
        className="button"
        type="submit"
        //what is the difference between handleLogin() and handleLogin
        onClick={handleLogin}>
          Login
        </button>
      </form>
      <div className="other-option">
        <p>Do not have an account yet?</p>
        <Link 
        to="/signup"
        className="nav-link">
            Signup
        </Link>
      </div>
      {errorMessage && <p className="fail-result-status">{`${errorMessage}`}</p>}
    </div>
    )
}
 
export default LoginForm