import { createSlice } from '@reduxjs/toolkit';

const initialState = { editButton: false, applyButton: false };

const messageBoxesSlice = createSlice({
  name: 'messageBoxes',
  initialState,
  reducers: {
    handleEditMessageBox: (state, action) => {
      state.editButton = action.payload;
    },
    handleApplyMessageBox: (state, action) => {
      state.applyButton = action.payload;
    },
  },
});

export default messageBoxesSlice;
export const selectMessageBoxes = (state) => state.messageBoxes;
export const { handleEditMessageBox, handleApplyMessageBox } =
  messageBoxesSlice.actions;
