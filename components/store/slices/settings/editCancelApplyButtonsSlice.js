import { createSlice } from '@reduxjs/toolkit';

const initialState = { isEdit: false, isApply: false, isCancel: false };

const EditCancelApplyButtonsSlice = createSlice({
  name: 'editCancelApplyButtons',
  initialState,
  reducers: {
    handleResetButtons: () => initialState,
    handleClickedButton: (state, action) => {
      state[action.payload] = true;
    },
  },
});

export default EditCancelApplyButtonsSlice;
export const selectEditCancelApplyButtons = (state) =>
  state.editCancelApplyButtons;
export const { handleResetButtons, handleClickedButton } =
  EditCancelApplyButtonsSlice.actions;
