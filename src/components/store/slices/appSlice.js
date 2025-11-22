import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
};

const appSlice = createSlice({
    name: "appInfo",
    initialState,
    reducers: {
        handleIsLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export default appSlice;
export const selectAppInfo = (state) => state.appInfo;
export const { handleIsLoading } = appSlice.actions;