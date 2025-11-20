import { createStore } from './storeUtils';
import { PERMISSIONS, ROLES } from '../../constants';
import { checkUserPermissions } from '../../helpers/helpers';

const useUserStore = createStore('userInfo', (set) => ({
  isLoading: false,
  hasError: false,
  isEssSwitch: true,
  isTesSwitch: true,
  isTgsSwitch: true,
  isHpSwitch: true,
  isAteSwitch: false,
  permissions: {},
  isAdministrator: false,
  isPasswordBoxOpen: false,
  adminPassword: '',
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

  setAccessAdministrator: (isAdministrator) => set({ isAdministrator }),
  resetAccessAdministrator: () => set({ isAdministrator: false }),
  setPasswordPropagation: (isPasswordBoxOpen) => set({ isPasswordBoxOpen }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setAllUsers: (allUsers) => set({ allUsers }),
  setUserInfo: (user) => set({ user }),

  // Handle async user profile loading
  setUserProfilePending: () => set({ isLoading: true, hasError: false }),
  setUserProfileSuccess: (userData) => set((state) => {
    const role = userData.user_role;
    const permissions = checkUserPermissions(role);
    state.permissions = permissions;
    state.isAdministrator = role === ROLES.Administrator;
    state.isAteSwitch = permissions[PERMISSIONS.ATE_CONTROL];
    state.isEssSwitch = permissions[PERMISSIONS.ESS_CONTROL];
    state.isTesSwitch = permissions[PERMISSIONS.TES_CONTROL];
    state.isTgsSwitch = permissions[PERMISSIONS.TGS_CONTROL];
    state.isHpSwitch = permissions[PERMISSIONS.HP_CONTROL];
    state.user = userData;
    state.isLoading = false;
    state.hasError = false;
  }),
  setUserProfileError: () => set({ hasError: true, isLoading: false }),
}));

export default useUserStore;
