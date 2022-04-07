import { configureStore } from "@reduxjs/toolkit";
import savedCardReducer from "./savedCardSlice";

export default configureStore({
  reducer: {
    savedCards: savedCardReducer
  }
})