import { configureStore } from '@reduxjs/toolkit'

// import your slices
import userReducer from '../features/user/userSlice'
// you may have another slice

// configure and create the redux store
export const store = configureStore({
  reducer: {
    user: userReducer
    // add more slice if you need, like:
    // posts: postsReducer,
    // comments: commentsReducer,
  }
})

// stander format
export type RootState = ReturnType<typeof store.getState>  //types for the store itself
export type AppDispatch = typeof store.dispatch // type for dispatch
