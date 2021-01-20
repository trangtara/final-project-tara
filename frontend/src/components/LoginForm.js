import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { login } from '../reducers/user'

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
      <form>
        <label>
        Email
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            />
        </label>
        <label>
        Password
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
        type="submit"
        //what is the difference between handleLogin() and handleLogin
        onClick={handleLogin}>
          Login
        </button>
      </form>
      <Link to="/signup">
        <button
        //what is the difference btw type=button and type=submit
        type="button"
        >
          Do not have an account yet?
        </button>
      </Link>
      {errorMessage && <p>{`${errorMessage}`}</p>}
    </div>
    )
}
 
export default LoginForm