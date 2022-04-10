import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import savedCardReducer from './savedCardSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    savedCards: savedCardReducer
  }
})