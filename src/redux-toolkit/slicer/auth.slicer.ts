import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Authtentication } from "../../interfaces/redux/redux.interface";

const initialState: Authtentication = {
    value: ""
}

export const AuthtenticationSlice = createSlice({
    name: 'authToken',
    initialState,
    reducers: {
        saveToken: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { saveToken } = AuthtenticationSlice.actions;
export default AuthtenticationSlice.reducer;