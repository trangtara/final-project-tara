import { createSlice } from '@reduxjs/toolkit'
import { loadingStatus } from './loadingStatus'

// const API_URL = 'https://event-check-in-app.herokuapp.com/api'
const API_URL = 'http://localhost:8080/api'
const API_REGISTER_URL = `${API_URL}/registration`
const API_SENDQRCODE_URL = `${API_URL}/sendqrcode`
const API_DELETEATTENDANT_URL = `${API_URL}/delete`
const API_ALLATTENDANTS_URL = `${API_URL}/attendants`
const API_CHECKIN_URL =`${API_URL}/checkin`

const initialState = {
  all: [],
  currentAttandantId: null,
  notices: [],
}

export const attendants = createSlice({
  name: 'attendants',
  initialState: initialState,
  reducers: {
    // Add a newly created attendant to state
    addAttendant: (state, action) => {
      const { attendant } = action.payload
      console.log("addNewAttendant", attendant)

      // Validate payload
      if (!attendant || !attendant._id) {
        throw new Error('Attendant model is required')
      }

      // Set newly created attandant, use this object to display successful registration data in UI
      state.currentAttandantId = attendant._id

      // Add attendant to all
      state.all = [...state.all, attendant]
    },
    
    // Remove an attendant based on id
    removeAttendantById: (state, action) => {
      const { attendantId } = action.payload
      console.log("removeById", attendantId, action.payload, "action payload")

      // Validate payload
      if (typeof attendantId !== 'string') {
        throw new Error('attendantId must be of type "string"')
      }

      // Remove attendant from all
      state.all = state.all.filter((item) => item._id !== attendantId)
    },

    // Set a notice to display in UI
    addNotice: (state, action) => {
      const { message, type, location } = action.payload
      console.log("addNotice", message, type, location)
      
      // Validate existance and value of type
      const allowedTypes = ['success', 'warning', 'error'];
      if (!allowedTypes.includes(type)) {
        throw new Error(`Allowed types for notice: ${allowedTypes.join(', ')}`)
      }

      // Validate existance and type of message
      if (typeof message !== 'string') {
        throw new Error('Notice message must be of type "string"')
      }

      // Set notice
      state.notices = [...state.notices, { message, type, location }]
    },

    // Replace all attendants in state
    // Use this when fetching fresh data from backend
    replaceAll: (state, action) => {
      const { attendants } = action.payload
      // Validate payload
      if (!Array.isArray(attendants)) {
        throw new Error('attendants must be of type "array"')
      }

      // Set all
      state.all = attendants
    },

    // Reset the notice whenever you perform a new action, to hide messages from previous actions
    resetNotices: (state) => {
      state.notices = []
    },

    // Reset the "new" attendant in state when initiating a new registration, to hide the data of
    // the previous successful registration in the UI
    resetNew: (state) => {
      state.currentAttandantId = null
    },

    // Update an attendant by passing an id and the props to update 
    updateAttendant: (state, action) => {
      const { updatedAttendant } = action.payload
      console.log('updatedAttendant', updatedAttendant)

      // Validate payload
      if (!updatedAttendant || !updatedAttendant._id) {
        throw new Error('updateAttendant requires an object with an _id and properties to update')
      }

      const attendantIndex = state.all.findIndex((item) => item._id === updatedAttendant._id);

      if (typeof attendantIndex !== 'number') {
        throw new Error('attendant could not be found in state')
      }

      state.all = state.all.map((item, index) => {
        return index === attendantIndex ? updatedAttendant : item;
      })
    }
  }
})

// Add new attendant from registration form
export const addNewAttendant = ({ name, department, email }) => {
  
  return (dispatch, getState) => {
    // Reset state
    dispatch(attendants.actions.resetNotices())
    dispatch(attendants.actions.resetNew())
    dispatch(loadingStatus.actions.setLoading(true))
    // Get accessToken for authorization
    const accessToken = getState().user.login.accessToken
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      },
      body: JSON.stringify({
        department,
        attendantName: name,
        attendantEmail: email
      })
    }

    // // Create the new attendant
    fetch(API_REGISTER_URL, params)
      .then((res) => {
        console.log('res', res);
        if (res.ok) {
          return res.json()
        }
        // @TODO: Use error message from backend
        throw new Error("Could not register new attendant")
      })
      .then((json) => {
        dispatch(attendants.actions.addAttendant({ attendant: json }))
        dispatch(attendants.actions.addNotice({
          type: 'success',
          message: `Successfully inserted attendant with email: ${json.attendantEmail}`,
          location: 'registration'
        }))
        dispatch(loadingStatus.actions.setLoading(false))
      })
      .catch((err) => {
        dispatch(attendants.actions.addNotice({
          // @TODO: If the attendant could not be created because the email
          // is already registered, the "type" should be "warning"
          type: 'error',
          message: err.message,
          location: 'registration'
        }))
      })
  }
}

export const sendQrcode = (attendantId) => {
  console.log(attendantId, "attendantId in sendqrCode thunk")
    return(dispatch, getState) => {
      dispatch(loadingStatus.actions.setLoading(true))
      const accessToken = getState().user.login.accessToken
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify({ attendantId })
      }
      fetch(API_SENDQRCODE_URL, params)
      .then((res) => {
        if(res.ok) {
          return res.json()
        }
        throw new Error (`Email already sent to ${attendantId}`)
      })
      .then((json) => {
        console.log('Successfully send qrcode', json)
        dispatch(attendants.actions.updateAttendant({ updatedAttendant: json }))
        dispatch(attendants.actions.addNotice({
          type: 'success',
          message: `Successfully send qrcode to ${json.attendantEmail}`,
          location: 'qrcode'
        }))
        dispatch(loadingStatus.actions.setLoading(false))
  
      })
      .catch((err) => {
        dispatch(attendants.actions.addNotice({
          type: 'error',
          message: err.message,
          location: 'qrcode'
        }))
      })
    }
  }

  export const deleteAttendant = (attendantId) => {
    return(dispatch, getState) => {
      dispatch(loadingStatus.actions.setLoading(true))
      const accessToken = getState().user.login.accessToken
      const params = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify({ attendantId })
      }
      fetch(API_DELETEATTENDANT_URL, params)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Could not find the attendant')
      })
      .then((json) => {
        dispatch(attendants.actions.removeAttendantById({attendantId: json._id}))
        dispatch(loadingStatus.actions.setLoading(false))
      })
      .catch((err) => {
        console.log(err, "delete erro")
        // dispatch(attendants.actions.addNotice({
        //   type: 'error',
        //   message: err.message,
        //   location: 'qrcode'
        // }))
      })
    }
  }

  export const fetchAllAttendants = () => {
    return(dispatch, getState) => {
      dispatch(loadingStatus.actions.setLoading(true))
      const accessToken = getState().user.login.accessToken
      const params = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        }
      }
      fetch(API_ALLATTENDANTS_URL, params)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch the attendant list')
        }
        return res.json()
      })
      .then((json) => {
        dispatch(attendants.actions.replaceAll({  
          attendants: json
        }))
        dispatch(loadingStatus.actions.setLoading(false))
      })
      .catch((err) => {
        console.log(err, "error when fetching all attendants")
        dispatch(attendants.actions.addNotice({
          type: 'error',
          message: err.message,
          location: 'list'
        }))
      })
    }
  }

  export const checkinAttendant = (attendantId) => {
    console.log(attendantId, "checkin attendantId")
    return(dispatch, getState) => {
      dispatch(attendants.actions.resetNotices())
      dispatch(loadingStatus.actions.setLoading(true))
      const URL = `${API_CHECKIN_URL}/${attendantId}`
      console.log(URL, "url of checkin")
      const params = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'}
      }
      fetch(URL, params)
      .then((res) => {
        console.log(res, "response of checkin")
        if (!res.ok) {
          throw new Error('Attendant already checkin')
        }
        return res.json()
      })
      .then((json) => {
        console.log(json, "JSON CHECKIN")
        dispatch(attendants.actions.updateAttendant({ updatedAttendant: json }))
        dispatch(attendants.actions.addNotice({
          type: 'success',
          message: `Successfully check in the attendant with email ${json.attendantEmail}`,
          location: 'list'
        }))
        dispatch(loadingStatus.actions.setLoading(false))
      })
      .catch((err) => {
        console.log(err, "errors at checkin thunk")
        dispatch(attendants.actions.addNotice({
          type: 'error',
          message: `${err.message}`,
          location: 'list'
        }))
      })

    }
  }

  export const closeResultDisplay = () => {
    return (dispatch) => {
      console.log("resetnew")
      dispatch(attendants.actions.resetNew())
      dispatch(attendants.actions.resetNotices())
    }
  }

  export const closeCheckin = () => {
    return(dispatch) => {
      console.log("what is here")
      dispatch(attendants.actions.resetNotices())
    }
  }
