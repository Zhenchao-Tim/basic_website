import { createSlice, PayloadAction } from '@reduxjs/toolkit'     
import type { RootState } from '../../app/store'                   
import { IdTokenClaims } from '@azure/msal-browser'

// Define a type for the slice state
export interface AuthState {
    accessToken: string | null,
    idTokenClaims: IdTokenClaims | undefined
}

// Define the initial state using that type
const initialState: AuthState = {
    accessToken: null,
    idTokenClaims: undefined
}

export const userSlice = createSlice({
    //createSlice({name, initalstate, reducers})

  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // mix state and action together
    setAccessToken(state, action: PayloadAction<string | null>) {
        state.accessToken = action.payload;
    },
    setClaims(state, action: PayloadAction<IdTokenClaims | undefined>) {
        state.idTokenClaims = action.payload;
    }
  }
});

export const { setAccessToken, setClaims } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectClaims = (state: RootState) => state.user.idTokenClaims;
export const selectAccessToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer