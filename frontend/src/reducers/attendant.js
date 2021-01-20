import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  attendant: {
    attendantName: localStorage.attendantName || null,
    department: localStorage.department || null,
    attendantEmail: localStorage.attendantEmail || null,
    errorMessage: null
  }
}

export const attendant = createSlice({
  name: 'attendant',
  initialState: initialState,
  reducers: {
    setAttendantName: (state, action) => {
      const { attendantName } = action.payload
      state.attendant.attendantName = attendantName
      localStorage.setItem('attedantName', attendantName)
    },
    setDepartment: (state, action) => {
      const { department } = action.payload
      state.attendant.department = department
      localStorage.setItem('department', department)
    },
    setAttendantEmail: (state, action) => {
      const { attendantEmail } = action.payload
      state.attendant.attendantEmail = attendantEmail
      localStorage.setItem('attendantEmail', attendantEmail)
    },
    setErrorMessage: (state, action) => {
      const { errorMessage } = action.payload
      state.attendant.errorMessage = errorMessage
    }
  }
})
export const registration = (attendantName, department, attendantEmail) => {
  const REGISTER_URL = 'http://localhost:8080/api/users'
  return (dispatch, getState) => {
    console.log(getState(), "getState")
    const accessToken = getState().user.login.accessToken
    const userId = getState().user.login.userId
    console.log(accessToken, "REGaccessToken")
    
    // const userId = getState().user.login.userId
    fetch(`${REGISTER_URL}/${userId}/registration`,
    {
      method: 'POST',
      header: { Authorization: accessToken},
      body: JSON.stringify({ attendantName, department, attendantEmail})
    })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error ('Could not register new attendant')
    })
    .then((json) => {
      console.log(json, "json")
      dispatch (attendant.actions.setAttendantName({
          attendantName: json.attendantName
        })
      )
      dispatch (attendant.actions.setDepartment({
        department: json.department
      }))
      dispatch (attendant.actions.setAttendantEmail({attendantEmail: json.attendantName}))
      dispatch (attendant.actions.setErrorMessage({ errorMessage: null}))
    })
    .catch((err) => {
      dispatch(attendant.actions.setErrorMessage({ errorMessage: err }))
    })
  }
}