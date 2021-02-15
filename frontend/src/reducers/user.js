import { createSlice } from '@reduxjs/toolkit'
import { loadingStatus } from './loadingStatus'

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

export const signup = (name, email, password) => {
  return (dispatch) => {
    dispatch(loadingStatus.actions.setLoading(true))
    fetch(API_SIGNUP_URL, {
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
      dispatch(user.actions.addNotice({
        type: 'success',
        message:'Successfully sign up new member',
        location: 'signup'
      }))
      dispatch(loadingStatus.actions.setLoading(false))

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

export const login = (email, password) => {
  return (dispatch) => {
    dispatch(loadingStatus.actions.setLoading(true))

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
      dispatch(loadingStatus.actions.setLoading(false))

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
