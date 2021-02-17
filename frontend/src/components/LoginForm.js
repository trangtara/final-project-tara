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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-8 col-lg-8">
          <form onSubmit={(event) => handleLogin(event)}>
            <h2 className="text-center text-primary">Login your account</h2>
            <div className="mt-5">
              <div className="form-floating mb-3">
                <input 
                  type="email"
                  className="border-1 border-secondary rounded form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label htmlFor="floatingInput" className="text-secondary">Email address</label>
              </div>
              <div className="form-floating">
                <input 
                  type="password"
                  className="border-1 border-secondary rounded form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)} 
                />
                <label htmlFor="floatingPassword" className="text-secondary">Password</label>
              </div>
            </div>
            <button
              className="btn mt-3 btn-primary"
              type="submit"
            >
              Login
            </button>
          </form>
          {notices && notices.map((notice) => (
            <div className="mt-3" key={notice.location}>
              {notice.location === 'login' && 
              <Alert 
              type={notice.type}
              message={notice.message}
              />
              }
            </div>
            ))
          }
          <div className="row justify-content-center">
            <p className="col-sm col-md-auto">Do not have an account yet?</p>
            <Link 
            to="/signup"
            className="col-sm col-md-auto text-decoration-none fw-bold">
                Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
    )
}
 
export default LoginForm