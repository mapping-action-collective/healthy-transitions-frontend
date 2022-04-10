import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  savedCards: []
}

export const savedCardSlice = createSlice({
  name: 'saved-card-slice', 
  initialState,
  reducers: {
    toggleSavedCards: (state, action) => {
      const { id } = action
      state.savedCards.includes(id) ? 
        state.savedCards.filter(e => e !== action.id) : 
        state.savedCards = [...state.savedCards, id]
    },
    clearSavedCards: (state) => state = initialState
  }
})

export const { toggleSavedCards, clearSavedCards } = savedCardSlice.actions

export default savedCardSlice.reducer