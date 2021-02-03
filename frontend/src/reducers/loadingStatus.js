import { createSlice } from '@reduxjs/toolkit'

export const loadingStatus = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    }
  }
})