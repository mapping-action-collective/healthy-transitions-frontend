import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedCards: [], 
  savedCardsVisible: false
}

export const savedCardSlice = createSlice({
  name: 'saved-cards',
  initialState,
  reducers: {
    clearSavedCards: (state) => state.savedCards = [],
    toggleSavedVisibility: (state) => Object.assign(state, {savedCardsVisible: !state.savedCardsVisible}),
    toggleSavedValues: (state, action) => {
      const { id } = action.payload
      state.savedCards.includes(id) ? 
        state.savedCards = state.savedCards.filter(e => e !== id) :
        state.savedCards = [...state.savedCards, id]
    }  
  } 
})

export const { clearSavedCards, toggleSavedVisibility, toggleSavedValues } = savedCardSlice.actions 

export default savedCardSlice.reducer