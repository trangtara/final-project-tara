import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  attendant: {
    attendantId: null ,
    successfulRegistration: null,
    errorMessage: null,
    qrCode: null,
    checkin: false
  }
}

export const attendant = createSlice({
  name: 'attendant',
  initialState: initialState,
  reducers: {
    setSuccessfulRegistration: (state, action) => {
      const { data } = action.payload
      state.attendant.successfulRegistration = data
    },
    setErrorMessage: (state, action) => {
      const { errorMessage } = action.payload
      state.attendant.errorMessage = errorMessage
    },
    setAttendantId: (state, action) => {
      const { attendantId } = action.payload
      state.attendant.attendantId = attendantId
    },
    setQrCode: (state, action) => {
      const { qrCode } = action.payload
      state.attendant.qrCode = qrCode
    },
    setCheckin: (state, action) => {
      const { checkin } = action.payload
      console.log( "ACTION PAYLOAD", action.payload)
      console.log("CHECKIN", checkin)

      state.attendant.checkin = checkin
    }
  
  }
})
export const registration = (attendantName, department, attendantEmail) => {
  const REGISTER_URL = 'http://localhost:8080/api/users'
  return (dispatch, getState) => {
    const accessToken = getState().user.login.accessToken
    const userId = getState().user.login.userId
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({ attendantName, department, attendantEmail})
    }
    fetch(`${REGISTER_URL}/${userId}/registration`, params)
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('Could not register new attendant')
    })
    .then((json) => {

      dispatch (attendant.actions.setSuccessfulRegistration({ data: json }))

      dispatch(attendant.actions.setAttendantId({attendantId: json._id}))
      console.log(json._id, "json_id")

      dispatch (attendant.actions.setErrorMessage({ errorMessage: null }))
    })
    .catch((err) => {
      dispatch(attendant.actions.setSuccessfulRegistration({ data: null }))
      dispatch(attendant.actions.setErrorMessage({ errorMessage: err.message }))
    })
  }
}

export const qrCodeGenerator = () => {
  console.log('qrCodeGenerator start')
  const CHECKIN_URL = 'http://localhost:8080/api'
  return (dispatch, getState) => {
    const attendantId = getState().attendant.attendant.attendantId
    // const accessToken = getState().user.login.accessToken
    console.log(getState(), "getState")
    console.log("ID GET FROM THE STATE", attendantId)
    
    fetch(`${CHECKIN_URL}/${attendantId}/qrcode`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => {
      console.log('qrCodeGenerator res', res)
      if (!res.ok) {
        throw new Error ('Could not get the qrcode')
      }
      return res.json()
    })
    .then((json) => {
      console.log('qrCodeGenerator json', json)
      dispatch(attendant.actions.setQrCode({
        qrCode: json
      }))
    })
    .catch((err) => {
      console.log(err, "ERROR")
      dispatch(attendant.actions.setErrorMessage({ errorMessage: err}))
    })
  }
}  

export const checkin = () => {
  return (dispatch) => {
    dispatch(attendant.actions.setCheckin({
      checkin: true
    }))
  }
}



