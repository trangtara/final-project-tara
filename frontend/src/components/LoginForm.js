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
    <div>
      <form onSubmit={(event) => handleLogin(event)}>
        <h3>Login your account</h3>
        <div className="form-floating mb-3">
          <input 
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input 
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)} 
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        {/* <div className="input-container">
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
        </div> */}
        <button
          className="btn btn-primary btn-sm"
          type="submit"
          //what is the difference between handleLogin() and handleLogin
        >Login</button>
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