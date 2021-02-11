import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


import { login } from '../reducers/user'
import Alert from '../components/common/Alert'
import '../styling/form.css'
import '../styling/pageWrapper.css'


const LoginForm = () => {
  const dispatch = useDispatch()
  const notices = useSelector((store) => store.user.login.notices)

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
        <div className="input-container">
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
        </div>
        <button
          className="btn btn-primary btn-sm"
          type="submit"
        >
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
      {notices && notices.map((notice) => (
        <div key={notice.location}>
          {notice.location === 'login' && 
          <Alert 
          type={notice.type}
          message={notice.message}
          />
          }
        </div>
        ))
      }
    </div>
    )
}
 
export default LoginForm