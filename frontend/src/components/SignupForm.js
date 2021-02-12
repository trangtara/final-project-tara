import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


import { signup } from '../reducers/user'
import Alert from '../components/common/Alert'


const SignupForm = () => {
  const dispatch = useDispatch()
  const notices = useSelector((store) => 
    store.user.login.notices
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showValidations, setShowValidations] = useState(false);

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

  const handleSignup = (event) => {
    event.preventDefault()
    if (nameIsValid() && passwordIsValid() && emailIsValid()) {
      dispatch(signup(name, email, password));
    } else {
      setShowValidations(true);
    }
  }
  return (
    <div className="row mt-5">
      <form
      onSubmit={(event) => handleSignup(event)}>
      <h3>Sign up new User</h3>
        <div className="row my-3">
          <div className="form-floating mb-3">
            <input
            type="text"
            className="form-control"
            id="floatingNameInput"
            placeholder="username"
            value={name}
            onChange={(event) => setName(event.target.value)}
            />
            <label 
            htmlFor="floatingNameInput"
            >User Name</label>
          </div>
          <div>
            {showValidations && nameError}
          </div>
          <div className="form-floating mb-3">
            <input
              required 
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="floatingInput">User Email</label>
          </div>
          <div>
            {showValidations && emailError}
          </div>
          <div className="form-floating mb-3">
            <input
            className="form-control"
            type="password"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div>
            {showValidations && passwordError}
          </div>
        </div>
        <button
        className="btn btn-primary"
        type= "submit">
          Sign up
        </button>
      </form>
      <div className="row justify-content-center">
        <p className="col-sm col-md-auto">Already has an account?</p>
        <Link 
          className="col-sm col-md-auto"
          to="/login">
            Log in
        </Link>
      </div>
      {notices && notices.map((notice) => (
        <div key={notice.location}>
          {notice.location === 'signup' && 
          <Alert 
          type={notice.type}
          message={notice.message}
          />
        }
        </div>
      ))}
    </div>
  )
}
export default SignupForm
