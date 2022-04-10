import { createSlice } from '@reduxjs/toolkit'
import { filterListings, getKeywordCount, getCostCount, getCityCount, titleCaseKey } from '../../utils'

const initialState = {
  listings: [],
  filters: {
    age: '',
    location: '',
    tag: '', 
    cost: '', 
    category: '', 
    search: ''
  },
  meta: {
    ageCount: {},
    cityCount: {},
    keywordCount: {},
    costCount: {}
  }
}

const calculateNextResults = (state) => {
  const { listings, filters, hidden } = state
  return filterListings(listings, filters, hidden)
}

export const resultsSlice = createSlice({
  name: 'results', 
  initialState,
  reducers: {
    getListings: (state) => {
      // const { listings, filters, hidden } = state
      // state.listings = calculateNextResults(listings, filters, hidden)
      state.listings = calculateNextResults(state)
    },
    setAge: (state, action) => {
      state.age = action.payload.filters.age
      const { listings, filters, hidden } = state
      state.listings = calculateNextResults(listings, filters, hidden)
    },
    setLocation: (state, action) => {
      state.location = action.payload.filters.location
      const { listings, filters, hidden } = state
      state.listings = calculateNextResults(listings, filters, hidden)
    },
    setTag: (state, action) => {
      state.tag = action.payload.filters.tag
      const { listings, filters, hidden } = state
      state.listings = calculateNextResults(listings, filters, hidden)
    },
    setSearch: (state, action) => {
      state.search = action.payload.filters.search
      const { listings, filters, hidden } = state
      state.listings = calculateNextResults(listings, filters, hidden)
    },
    setCategory: (state, action) => {
      state.category = action.payload.filters.category
      const { listings, filters, hidden } = state
      state.listings = calculateNextResults(listings, filters, hidden)
    }
  }
})

export const { setAge, setLocation, setTag, setCost, setSearch, setCategory } = resultsSlice.actions

export default resultsSlice.reducer