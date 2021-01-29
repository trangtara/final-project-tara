import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkin: {
    errorMessage: '',
    successfulCheckin: ''
  }
}

export const checkin = createSlice({
  name: 'checkin',
  initialState: initialState,
  reducers: {
    setSuccessfulCheckin: (state, action) => {
      const { checkinData } = action.payload
      console.log(action.payload, "SUCCESS ACTION PAYLOAD")
      state.checkin.successfulCheckin = checkinData
    },
    setErrorMessage: (state, action) => {
      const { errorMessage } = action.payload
      console.log(action.payload, " ERROR ACTION PAYLOAD")
      state.checkin.errorMessage = errorMessage
    }
  }
})

export const checkinUpdate = (attendantId) => {
console.log(attendantId, "attendantId")
  // const CHECKIN_URL = `https://event-check-in-app.herokuapp.com/api/checkin/${attendantId}`

  const CHECKIN_URL = `http://localhost:8080/api/checkin/${attendantId}`
  console.log(CHECKIN_URL, "CHECKIN_URL")
  return (dispatch) => {
    console.log('are we here?');
    fetch (CHECKIN_URL, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json'}
    })
    .then((res) => {
      console.log( res, "RESPONSE CHECKIN")
      if (!res.ok) {
        throw new Error ('Could not find the attendant')
      }
      return res.json()
    })
    .then((json) => {
      console.log(json, "JSON CHECKIN")
      dispatch(checkin.actions.setErrorMessage({ errorMessage: null}))
      dispatch(checkin.actions.setSuccessfulCheckin({checkinData: json}))
    })
    .catch((err) => {
      console.log(err, "CHECKIN ERRORS")
      dispatch(checkin.actions.setErrorMessage({ errorMessage: err}))
      dispatch(checkin.actions.setSuccessfulCheckin({ checkinData: null }))
    })
  }
}