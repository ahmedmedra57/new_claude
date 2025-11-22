import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allSettingsOptions: {
    isUserProfileSelected: true,
    isUnitsSelected: false,
    isWindFactorSelected: false,
    isSnowSensorSelected: false,
    isForceAndCommandsSelected: false,
    isAdminSelected: false,
    isInterfaceModeSelected: false,
  },
};

const resetState = {
  allSettingsOptions: {
    isUserProfileSelected: false,
    isUnitsSelected: false,
    isWindFactorSelected: false,
    isSnowSensorSelected: false,
    isForceAndCommandsSelected: false,
    isAdminSelected: false,
    isInterfaceModeSelected: false,
  },
};

const settingsOptionsSlice = createSlice({
  name: 'settingsOptions',
  initialState,
  reducers: {
    handleSelectingSettings: (state, action) => {
      state.allSettingsOptions[action.payload] = true;
    },
    setResetSettingsOptions: () => resetState,
    handleSetInitialStateSettingsOptions: () => initialState,
  },
});

export default settingsOptionsSlice;
export const selectSettingsOptions = (state) => state.settingsOptions;
export const {
  handleSelectingSettings,
  setResetSettingsOptions,
  handleSetInitialStateSettingsOptions,
} = settingsOptionsSlice.actions;
