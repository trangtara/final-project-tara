import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { signup } from '../reducers/user'

import '../styling/form.css'
import '../styling/pageWrapper.css'

const SignupForm = () => {
  const dispatch = useDispatch()
  const errorMessage = useSelector((store) => 
    store.user.login.errorMessage
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showValidations, setShowValidations] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  const nameIsValid = () => {
    if (!name) {
      setNameError('Name can not be blank');
      return false;
    } else if (name.length < 2) {
      setNameError('Name should be longer than 2 letters');
      return false;
    } else if (name.length > 40) {
      setNameError('Name should be less than 40 letters');
      return false;
    }
    setNameError(null);
    return true;
  };

  const passwordIsValid = () => {
    if (!password) {
      setPasswordError('Please type in your password');
      return false;
    } else if (password.length < 5) {
      setPasswordError('Password needs to be longer than 5 characters');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const emailIsValid = () => {
    if (!email) {
      setEmailError('Email can not be blank');
      return false;
    } else if (!email.includes('@')) {
      setEmailError('Email must follow email format');
      return false;
    }
    setEmailError(null);
    return true;
  };

  useEffect(() => {
    const formIsValid = nameIsValid() && passwordIsValid() && emailIsValid()
    setFormIsValid(formIsValid);
  })

  const handleSignup = (event) => {
    event.preventDefault()
    if (formIsValid) {
      dispatch(signup(name, email, password));
    } else {
      setShowValidations(true);
    }
  }
//Decide whether choosing the built-in validation or the customize validation error message
  return (
    <div>
      <form
      onSubmit={(event) => handleSignup(event)}>
      <h3>Sign up new User</h3>
        <div className="input-container">
          <div class="form-floating mb-3">
            <input
            required
            type="text"
            class="form-control"
            id="floatingInput"
            placeholder="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
            />
            <label 
            for="floatingInput"
            >User Name</label>
          </div>
          <div>
            {showValidations && nameError}
          </div>
          <div class="form-floating mb-3">
            <input
              required 
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label for="floatingInput">User Email</label>
          </div>
          <div>
            {showValidations && emailError}
          </div>
          <div className="form-floating mb-3">
            <input
            className="form-control"
            type="text"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div>
            {showValidations && passwordError}
          </div>
        </div>
        <button
        className="btn btn-primary btn-sm"
        type= "submit">
          Sign up
        </button>
      </form>
      <div className="other-option">
        <p>Already has an account?</p>
        <Link 
          className="nav-link"
          to="/login">
            Log in
        </Link>
      </div>
      {errorMessage && <p>{`${errorMessage}`}</p>}
    </div>
  )
}
export default SignupForm
