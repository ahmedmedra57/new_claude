import { createSlice } from '@reduxjs/toolkit';
import { getUserProfileDataService } from '../../../services/userProfile.service';
import { PERMISSIONS, ROLES } from '../../../constants';
import { checkUserPermissions } from '../../../helpers/helpers';

const userSlice = createSlice({
  name: 'userInfo',
  initialState: {
    isLoading: false,
    hasError: false,
    //
    isEssSwitch: true,
    isTesSwitch: true,
    isTgsSwitch: true,
    isHpSwitch: true,
    isAteSwitch: false,
    permissions: {},

    // ---- admin info ----
    isAdministrator: false,
    isPasswordBoxOpen: false,
    adminPassword: '',
    // ---- admin info ----
    user: {
      firstname: '',
      lastname: '',
      title: '',
      gender: '',
      phone: null,
      cell_phone: null,
      fax: null,
      email: null,
      company_name: null,
      company_location: null,
      avatar: null,
      password: '',
      user_id: '',
      temperature_unit: 'c',
    },
    accessToken: '',
    allUsers: [],
  },
  reducers: {
    handleAccessAdministrator: (state, action) => {
      state.isAdministrator = action.payload;
    },
    handleResetAccessAdministrator: (state) => {
      state.isAdministrator = false;
    },
    handlePasswordPropagation: (state, action) => {
      state.isPasswordBoxOpen = action.payload;
    },
    handleAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    handleAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    addUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileDataService.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getUserProfileDataService.fulfilled, (state, action) => {
        const role = action.payload.user_role;
        state.permissions = checkUserPermissions(role);
        state.isAdministrator = role === ROLES.Administrator;
        state.isAteSwitch = state.permissions[PERMISSIONS.ATE_CONTROL];
        state.isEssSwitch = state.permissions[PERMISSIONS.ESS_CONTROL];
        state.isTesSwitch = state.permissions[PERMISSIONS.TES_CONTROL];
        state.isTgsSwitch = state.permissions[PERMISSIONS.TGS_CONTROL];
        state.isHpSwitch = state.permissions[PERMISSIONS.HP_CONTROL];
        state.user = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getUserProfileDataService.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
      });
  },
});

export default userSlice;
export const selectUserInfo = (state) => state.userInfo;
export const selectUserPermissions = (state) => state.userInfo.permissions;
export const selectLoadingState = (state) => state.userInfo.isLoading;
export const selectErrorState = (state) => state.userInfo.hasError;
export const {
  handleAccessAdministrator,
  handlePasswordPropagation,
  handleResetAccessAdministrator,
  handleAccessToken,
  handleAllUsers,
  addUserInfo,
} = userSlice.actions;
