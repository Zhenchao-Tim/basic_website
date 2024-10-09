import { configureStore } from '@reduxjs/toolkit'

// import your slices
import userReducer from '../features/user/userSlice'

// configure and create the redux store
export const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// stander format
export type RootState = ReturnType<typeof store.getState>  //types for the store itself
export type AppDispatch = typeof store.dispatch // type for dispatch
