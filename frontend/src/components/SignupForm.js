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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-8 col-lg-8">
          <form
            onSubmit={(event) => handleSignup(event)}>
            <h2 className="text-center text-primary">Sign up new User</h2>
            <div className="mt-5">
              <div className="form-floating mb-3 form-group">
                <input
                type="text"
                className="border-1 border-secondary rounded form-control"
                id="floatingNameInput"
                placeholder="userName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                />
                <label 
                  htmlFor="floatingNameInput"
                  className="text-secondary"
                >
                  User Name
                </label>
                <small id="floatingNameInput" className="form-text text-muted fst-italic">Name must be between 2-40 characters.</small>
              </div>
              <p className="text-danger fst-italic">
                {showValidations && nameError}
              </p>
              <div className="form-floating mb-3 form-group">
                <input
                  required 
                  type="email"
                  className="border-1 border-secondary rounded form-control"
                  id="floatingEmailInput"
                  placeholder="name@example.com"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <label 
                  htmlFor="floatingEmailInput"
                  className="text-secondary"
                >User Email
                </label>
                <small id="floatingEmailInput" className="form-text text-muted fst-italic">i.e name@example.com</small>
              </div>
              <p className="text-danger fst-italic">
                {showValidations && emailError}
              </p>
              <div className="form-floating mb-3 form-group">
                <input
                className="border-1 border-secondary rounded form-control"
                type="password"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />
                <label 
                  htmlFor="floatingPassword" 
                  className="text-secondary"
                >
                  Password
                </label>
                <small id="floatingPassword" className="form-text text-muted fst-italic">Password must has more than 5 characters</small>
              </div>
              <p className="text-danger fst-italic">
                {showValidations && passwordError}
              </p>
            </div>
            <button
            className="btn btn-primary"
            type= "submit">
              Sign up
            </button>
          </form>
          {notices && notices.map((notice) => (
            <div className="mt-3" key={notice.location}>
              {notice.location === 'signup' && 
              <Alert 
              type={notice.type}
              message={notice.message}
              />
            }
            </div>
          ))}
          <div className="row justify-content-center">
            <p className="col-sm col-md-auto">Already has an account?</p>
            <Link 
              className="col-sm col-md-auto fw-bold text-decoration-none"
              to="/login">
                Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignupForm
