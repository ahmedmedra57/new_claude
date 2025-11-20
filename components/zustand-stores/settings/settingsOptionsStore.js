import { createStore } from '../storeUtils';

const initialSettings = {
  isUserProfileSelected: true,
  isUnitsSelected: false,
  isWindFactorSelected: false,
  isSnowSensorSelected: false,
  isForceAndCommandsSelected: false,
  isAdminSelected: false,
  isInterfaceModeSelected: false,
};

const useSettingsOptionsStore = createStore('settingsOptions', (set) => ({
  allSettingsOptions: { ...initialSettings },

  selectSetting: (settingKey) => set((state) => {
    state.allSettingsOptions[settingKey] = true;
  }),

  resetSettings: () => set({
    allSettingsOptions: Object.keys(initialSettings).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {})
  }),

  setInitialSettings: () => set({ allSettingsOptions: { ...initialSettings } }),
}));

export default useSettingsOptionsStore;
