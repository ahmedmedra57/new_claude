import { createSlice } from '@reduxjs/toolkit';

const initialState = { interfaceMode: false };

const interfaceModeSlice = createSlice({
  name: 'interfaceMode',
  initialState,
  reducers: {
    setInterfaceMode: (state, action) => {
      state.interfaceMode = action.payload;
    },
  },
});

export default interfaceModeSlice;
export const selectInterfaceMode = (state) => state.interfaceMode;
export const { setInterfaceMode } = interfaceModeSlice.actions;
