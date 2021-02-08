// import { createSlice } from '@reduxjs/toolkit'
// import { loadingStatus } from './loadingStatus'

// const initialState = {
//   attendant: {
//     attendantId: null ,
//     successfulRegistration: null,
//     errorMessage: null,
//     qrCode: null,
//     successfulSendQrCode: null,
//     successfulDeleteAttendant: null
//   }
// }

// export const attendant = createSlice({
//   name: 'attendant',
//   initialState: initialState,
//   reducers: {
//     setSuccessfulRegistration: (state, action) => {
//       const { data } = action.payload
//       console.log( data, "successful registration data")
//       state.attendant.successfulRegistration = data
//     },
//     setErrorMessage: (state, action) => {
//       const { errorMessage } = action.payload
//       state.attendant.errorMessage = errorMessage
//     },
//     setAttendantId: (state, action) => {
//       const { attendantId } = action.payload
//       state.attendant.attendantId = attendantId
//     },
//     setQrCode: (state, action) => {
//       const { qrCode } = action.payload
//       console.log(qrCode, "qrcode action payload")
//       state.attendant.qrCode = qrCode
//     },
//     setSuccessfulSendQrcode: (state, action) => {
//       const { data } = action.payload
//       console.log(action.payload, "action payload of SendQrcode")
//       state.attendant.successfulSendQrCode = data
//       state.attendants = state.attendants.filter((item) => item._id !== data._id)
//     },
//     setSuccessfulDeleteAttendant: (state, action) => {
//       const { data } = action.payload
//       console.log(action.payload, "payload of deleted attendant")
//       state.attendant.successfulDeleteAttendant = data
//       state.attendants = state.attendants.filter((item) => item._id !== data._id)
//     },
//     setAllAttendants: (state, action) => {
//       const { data } = action.payload
//       console.log(data, "all attendant payload")

//       // const currentAttentant = state.attendants.find((item) => item._id === attendantId);

//       // if (currentAttentant) {
//       //   currentAttentant.qrCode = qrCode;

//       //   console.log('UPDATED ATTENdant', currentAttentant);

//       //   const allExceptCurrent = state.attendants.filter((item) => item._id !== currentAttentant._id);
//       //   state.attendants = [...allExceptCurrent, currentAttentant];
//       //   console.log('NEW ATTENTATS', state.attendants);
//       // }

//       // state.attendants = data
//     }

  
//   }
// })

// export const registration = (attendantName, department, attendantEmail) => {
//   // const REGISTER_URL = 'https://event-check-in-app.herokuapp.com/api'
//   const REGISTER_URL = 'http://localhost:8080/api'
//   return (dispatch, getState) => {
//     dispatch(loadingStatus.actions.setLoading(true))

//     const accessToken = getState().user.login.accessToken

//     const params = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': accessToken
//       },
//       body: JSON.stringify({ attendantName, department, attendantEmail})
//     }

//     fetch(`${REGISTER_URL}/registration`, params)
//     .then((res) => {
//       if (res.ok) {
//         return res.json()
//       }
//       throw new Error("Could not register new attendant. Attendant's email already exist")
//     })
//     .then((json) => {

//       dispatch (attendant.actions.setSuccessfulRegistration({ data: json }))

//       dispatch(attendant.actions.setAttendantId({attendantId: json._id}))

//       dispatch (attendant.actions.setErrorMessage({ errorMessage: null }))
//       dispatch(loadingStatus.actions.setLoading(false))

//     })
//     .catch((err) => {
//       dispatch(attendant.actions.setSuccessfulRegistration({ data: null }))
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: err.message }))
//     })
//   }
// }

// export const qrCodeGenerator = (attendantId) => {
//   console.log('qrCodeGenerator start', attendantId)
//   // const CHECKIN_URL = 'https://event-check-in-app.herokuapp.com/api'
//   const CHECKIN_URL = 'http://localhost:8080/api'

//   return (dispatch, getState) => {
//     console.log("generateqr code, log under return")
//     dispatch(loadingStatus.actions.setLoading(true))

//     // const attendantId = getState().attendant.attendant.attendantId
//     const accessToken = getState().user.login.accessToken
    
//     fetch(`${CHECKIN_URL}/${attendantId}/qrcode`, {
//       method: 'GET',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Authorization': accessToken
//       }
//     })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error ('Could not get the qrcode')
//       }
//       return res.json()
//     })
//     .then((json) => {
//       dispatch(attendant.actions.setQrCode({
//         qrCode: json
//       }))
//       dispatch(loadingStatus.actions.setLoading(false))
//     })
//     .catch((err) => {
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: err}))
//     })
//   }
// }

// export const sendQrcode = (attendantId) => {

//   // const SENDQRCODE_URL = 'https://event-check-in-app.herokuapp.com/api/sendqrcode'
//   const SENDQRCODE_URL = 'http://localhost:8080/api/sendqrcode'
//   return(dispatch, getState) => {
//     dispatch(loadingStatus.actions.setLoading(true))
//     const accessToken = getState().user.login.accessToken
//     fetch(SENDQRCODE_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': accessToken
//       },
//       body: JSON.stringify({ attendantId })
//     })
//     .then((res) => {
//       if(res.ok) {
//         return res.json()
//       }
//       throw new Error (`Email already sent to ${attendantId}`)
//     })
//     .then((json) => {
//       console.log(json, 'json of sendingqrCode')
//       dispatch(attendant.actions.setSuccessfulSendQrcode({ data: json}))
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: null}))
//       //dispatch(attendant.actions.setAllAttendants({ data: json }))
//       dispatch(loadingStatus.actions.setLoading(false))

//     })
//     .catch((err) => {
//       console.log(err, "sendQRcode-Errors??? What is it??")
//       dispatch(attendant.actions.setSuccessfulSendQrcode({ data: null}))
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: err.message}))
//     })
//   }
// }

// export const deleteAttendant = (attendantId) => {
//   console.log(attendantId, "attendantId")
  
//   // const DELETEATTENDANT_URL = 'https://event-check-in-app.herokuapp.com/api/delete'

//   const DELETEATTENDANT_URL = 'http://localhost:8080/api/delete'

//   return(dispatch, getState) => {
//     dispatch(loadingStatus.actions.setLoading(true))
//     const accessToken = getState().user.login.accessToken
    
//     fetch(DELETEATTENDANT_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': accessToken
//       },
//       body: JSON.stringify({ attendantId })
//     })
//     .then((res) => {
//       if (res.ok) {
//         return res.json()
//       }
//       throw new Error('Could not find the attendant')
//     })
//     .then((json) => {
//       dispatch(attendant.actions.setSuccessfulDeleteAttendant({ data: json}))
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: null}))
//       //dispatch(attendant.actions.setAllAttendants({ data: json }))
//       dispatch(loadingStatus.actions.setLoading(false))
//     })
//     .catch((err) => {
//       console.log(err, "ERRORs")
//       dispatch(attendant.actions.setSuccessfulDeleteAttendant({ data: null}))
//       dispatch(attendant.actions.setErrorMessage({ errorMessage: err.message}))
//     })
//   }
// }









