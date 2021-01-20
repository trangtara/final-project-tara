import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { signup } from '../reducers/user'

const SignupForm = () => {
  const dispatch = useDispatch()
  const errorMessage = useSelector((store) => 
    store.user.login.errorMessage
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = (event) => {
    event.preventDefault()
    dispatch(signup(name, email, password))
  }

  return (
    <div>
      <form>
        <label>
          Name
          <input
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          />
        </label>
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
        onClick={handleSignup}
        >
          Sign Up
        </button>
      </form>
      <Link to="/login">
        <button>Already has account?</button>
      </Link>
      {errorMessage && <p>{`${errorMessage}`}</p>}
    </div>
  )
}
export default SignupForm
