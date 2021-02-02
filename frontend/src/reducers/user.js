import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  login: {
    // accessToken: localStorage.accessToken || null,
    // userId: localStorage.userId || 0,
    // errorMessage: null
    accessToken: null,
    userId: 0,
    errorMessage: null
  }
}

export const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload
      state.login.accessToken = accessToken
      // localStorage.setItem('accessToken', accessToken)
    },
    setUserId: (state, action) => {
      const { userId } = action.payload
      state.login.userId = userId
      // localStorage.setItem('userId', userId)
    },
    setErrorMessage: (state, action) => {
      const { errorMessage } = action.payload
      state.login.errorMessage = errorMessage
    }
  }
})

export const signup = (name, email, password) => {
  // const SIGNUP_URL = 'https://event-check-in-app.herokuapp.com/api/signup'
  const SIGNUP_URL = 'http://localhost:8080/api/signup'
  return (dispatch) => {
    fetch(SIGNUP_URL, {
      method: 'POST',
      body: JSON.stringify({ name, email, password}),
      headers: { 'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not create new account. Email already exist.')
      }
      return res.json()
    })
    .then ((json) => {
      dispatch (
        user.actions.setAccessToken({
          accessToken: json.accessToken
        })
      )
      dispatch(user.actions.setUserId({ userId: json.userId}))
      dispatch(user.actions.setErrorMessage({ errorMessage: null}))
    })
    .catch((err) => {
      dispatch(user.actions.setErrorMessage({ errorMessage: err }))
    })
  }
}

export const login = (email, password) => {
  // const LOGIN_URL = 'https://event-check-in-app.herokuapp.com/api/login'
  const LOGIN_URL = 'http://localhost:8080/api/login'
  return (dispatch) => {
    fetch (LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Unable to login. Please make sure username and password are correct')
    })
    .then((json) => {
      dispatch (
        user.actions.setAccessToken({
          accessToken: json.accessToken
        })
      )
      dispatch (
        user.actions.setUserId({ userId: json.userId })
      )
      dispatch (
        user.actions.setErrorMessage({ errorMessage: null })
      )
    })
    .catch((err) => {
      console.log(err, "Error object")
      dispatch (logout())
      dispatch (
        user.actions.setErrorMessage({
          errorMessage: err
        })
      )
    })
  }
}

export const logout = () => {
  return (dispatch) => {
    dispatch(user.actions.setErrorMessage({
      errorMessage: null
    }))
    dispatch(user.actions.setUserId ({ userId: 0}))
    dispatch(user.actions.setAccessToken({
      accessToken: null
    }))
    // localStorage.removeItem('accessToken')
    // localStorage.removeItem('userId')
  }
}
