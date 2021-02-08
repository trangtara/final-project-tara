import { createSlice } from '@reduxjs/toolkit'
import { loadingStatus } from './loadingStatus'


const initialState = {

}

export const allAttendants = createSlice({
  name: 'allAttendants',
  initialState,
  reducers: {

  }
})

export const attendantList = () => {
  const allAttendant_URL = 'http://localhost:8080/api/attendants'

  // const allAttendant_URL = `https://event-check-in-app.herokuapp.com/api/attendants`
  return(dispatch, getState) => {
    dispatch(loadingStatus.actions.setLoading(true))
    const accessToken = getState().user.login.accessToken

    fetch( allAttendant_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken
      }
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Could not fetch the attendant list')
      }
      return res.json()
    })
    .then((json) => {
      dispatch(allAttendants.actions.setAllAttendants({ data: json }))
      dispatch(loadingStatus.actions.setLoading(false))
    })
    .catch((err) => {
      console.log('ERROR', err)
      dispatch(allAttendants.actions.setErrorMessage({ errorMessage: err.message}))
    })
  }
}