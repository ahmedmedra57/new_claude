import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  addElementToBankInfo: [],
};

const addElementToBankAndSystemIdentificationSlice = createSlice({
  name: 'addElementToBankAndSystemIdentification',
  initialState,
  reducers: {
    handleAddElementToBank: (state, action) => {
      state.addElementToBankInfo.push(action.payload);
    },
  },
});
export default addElementToBankAndSystemIdentificationSlice;
export const SelectAddElementToBankAndSystemIdentification = (state) =>
  state.addElementToBankAndSystemIdentification;
export const { handleAddElementToBank } =
  addElementToBankAndSystemIdentificationSlice.actions;
