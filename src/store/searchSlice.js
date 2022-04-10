import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  age: '',
  location: '',
  tag: '', 
  cost: '',
  search: '',
  category: ''
}

export const searchSlice = createSlice({
  name: 'search', 
  initialState,
  reducers: {
    setAge: (state, action) => state.age = action.payload,
    setLocation: (state, action) => state.location = action.payload,
    setTag: (state, action) => state.tag = action.payload,
    setCost: (state, action) => state.cost = action.payload,
    setSearch: (state, action) => state.search = action.payload,
    setCategory: (state, action) => state.category = action.payload,
  }
})

export const { setAge, setLocation, setTag, setCost, setSearch, setCategory } = searchSlice.actions

export default searchSlice.reducer