import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  login: {
    accessToken: localStorage.accessToken || null,
    userId: localStorage.userId || 0,
    notices: []
  }
}

const API_URL = process.env.REACT_APP_API_URL
const API_SIGNUP_URL = `${API_URL}/signup`
const API_LOGIN_URL = `${API_URL}/login`

export const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      const { accessToken } = action.payload
      state.login.accessToken = accessToken
      localStorage.setItem('accessToken', accessToken)
    },
    setUserId: (state, action) => {
      const { userId } = action.payload
      state.login.userId = userId
      localStorage.setItem('userId', userId)
    },
    addNotice: (state, action) => {
      const { message, type, location } = action.payload

      // Validate existance and value of type
      const allowedTypes = ['success', 'warning', 'error']
      if (!allowedTypes.includes(type)) {
        throw new Error(`Allowed types for notice: ${allowedTypes.join(', ')}`)
      }

      // Validate existance and type of message
      if (typeof message !== 'string') {
        throw new Error('Notice message must be of type "string"')
      }

      state.login.notices = [...state.login.notices, { message, type, location}]
    },
    resetNotices: (state) => {
      state.login.notices = []
    },
  }
})

//sign up new user
export const signup = (name, email, password) => {
  return (dispatch) => {
    fetch(API_SIGNUP_URL, {
      method: 'POST',
      body: JSON.stringify({ name, email, password}),
      headers: { 'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not sign up new user. Email aleady exist')
      }
    })
    .then ((json) => {
      if(json && json.errorMessage === 'string') {
        throw new Error(json.errorMessage)
      }
      dispatch (
        user.actions.setAccessToken({
          accessToken: json.accessToken
        })
      )
      dispatch(user.actions.setUserId({ userId: json.userId}))
      dispatch(user.actions.addNotice({
        type: 'success',
        message:'Successfully sign up new member',
        location: 'signup'
      }))

    })
    .catch((err) => {
      dispatch(user.actions.addNotice({
        type: 'error',
        message: err.message,
        location: 'signup'
      }))
    })
  }
}

//login user
export const login = (email, password) => {
  return (dispatch) => {
    fetch (API_LOGIN_URL, {
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
      dispatch(user.actions.addNotice({
        type: 'success',
        message:'Successfully login',
        location: 'login'
      }))
    })
    .catch((err) => {
      dispatch (logout())
      dispatch(user.actions.addNotice({
        type: 'error',
        message: err.message,
        location: 'login'
      }))
    })
  }
}

//logout user
export const logout = () => {
  return (dispatch) => {
    dispatch(user.actions.resetNotices())
    dispatch(user.actions.setUserId ({ userId: 0}))
    dispatch(user.actions.setAccessToken({
      accessToken: null
    }))
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
  }
}
