import { configureStore } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

import addressSlice from './slices/dummyAddress';
import essDataConsumptionSlice from './slices/essDataConsumptionSlice';
import essSwitchSlice from './slices/essSwitchSlice';
import globalOverviewSlice from './slices/globalOverviewSlice';
import hpDataConsumptionSlice from './slices/hpDataConsumptionSlice';
import hpElectricSwitchSlice from './slices/hpElectricSwitchSlice';
import hpGasSwitchSlice from './slices/hpGasSwitchSlice';
import masterControlSelectBySwitchSlice from './slices/masterControlBySwitchSelectSlice';
import masterControlSelectSlice from './slices/masterControlSelectSlice';
import mCCommandSlice from './slices/mCCommandSlice';
import mCSlice from './slices/mCSlice';
import messageBoxesSlice from './slices/messageBoxesSlice';
import reportStatusSlice from './slices/reportStatusSlice';
import selectedMachinesSlice from './slices/selectedMachinesSlice';
import ssrDescriptionSlice from './slices/ssrDescriptionSlice';
import telemetryChartDataSlice from './slices/telemetryChartDataSlice';
import telemetrySlice from './slices/telemetrySlice';
import tesDataConsumptionSlice from './slices/tesDataConsumptionSlice';
import tesSwitchSlice from './slices/tesSwitchSlice';
import tgsDataConsumptionSlice from './slices/tgsDataConsumptionSlice';
import tgsSwitchSlice from './slices/tgsSwitchSlice';
import masterControlSelectByLocationSlice from './slices/masterControlSelectByLocationSlice';
import snowSensorSlice from './slices/settings/snowSensorSlice';
import unitsSlice from './slices/settings/unitsSlice';
import windFactorSlice from './slices/settings/windFactorSlice';
import interfaceModeSlice from './slices/settings/interfaceModeSlice';
import settingsOptionsSlice from './slices/settings/settingsOptionsSlice';
import adminSlice from './slices/settings/admin/adminSlice';
import EditCancelApplyButtonsSlice from './slices/settings/editCancelApplyButtonsSlice';
import faultsSlice from './slices/FaultsSlice';
import addElementToBankAndSystemIdentificationSlice from './slices/settings/admin/addElementToBankAndSystemIdentification';
import MCIsExpandedSlice from './slices/MCIsExpandedSlice';
import userSlice from './slices/userSlice';
import forceCommandAndAdminSelectSlice from './slices/settings/force&CommandAndAdminSelectSlice';
import forceAndCommandsSlice from './slices/settings/forceAndCommandsSlice';
import sysIdentificationSlice from './slices/settings/admin/sysIdentificationSlice';
import mobileSelectProgramSlice from './slices/mobileSelectProgramSlice';
import mobileMasterControlSlice from './slices/mobileMasterControlSlice';
import appSlice from './slices/appSlice';
import locationsSlice from './slices/locationsSlice';

const store = configureStore({
  reducer: {
    essSwitch: essSwitchSlice.reducer,
    tesSwitch: tesSwitchSlice.reducer,
    tgsSwitch: tgsSwitchSlice.reducer,
    masterControlSelect: masterControlSelectSlice.reducer,
    mC: mCSlice.reducer,
    mCCommand: mCCommandSlice.reducer,
    selectedMachines: selectedMachinesSlice.reducer,
    messageBoxes: messageBoxesSlice.reducer,
    globalOverview: globalOverviewSlice.reducer,
    telemetry: telemetrySlice.reducer,
    masterControlSelectBySwitch: masterControlSelectBySwitchSlice.reducer,
    masterControlSelectByLocation: masterControlSelectByLocationSlice.reducer,
    hpElectricSwitch: hpElectricSwitchSlice.reducer,
    hpGasSwitch: hpGasSwitchSlice.reducer,
    essDataConsumption: essDataConsumptionSlice.reducer,
    tgsDataConsumption: tgsDataConsumptionSlice.reducer,
    tesDataConsumption: tesDataConsumptionSlice.reducer,
    hpDataConsumption: hpDataConsumptionSlice.reducer,
    telemetryChartData: telemetryChartDataSlice.reducer,
    address: addressSlice.reducer,
    ssrDescription: ssrDescriptionSlice.reducer,
    reportStatus: reportStatusSlice.reducer,

    admin: adminSlice.reducer,
    forceAndCommands: forceAndCommandsSlice.reducer,
    snowSensor: snowSensorSlice.reducer,
    units: unitsSlice.reducer,
    windFactor: windFactorSlice.reducer,
    interfaceMode: interfaceModeSlice.reducer,
    settingsOptions: settingsOptionsSlice.reducer,
    editCancelApplyButtons: EditCancelApplyButtonsSlice.reducer,
    faultsState: faultsSlice.reducer,
    forceCommandAndAdminSelect: forceCommandAndAdminSelectSlice.reducer,
    addElementToBankAndSystemIdentification:
      addElementToBankAndSystemIdentificationSlice.reducer,
    isExpanded: MCIsExpandedSlice.reducer,
    userInfo: userSlice.reducer,
    sysIdentification: sysIdentificationSlice.reducer,
    selectedProgram: mobileSelectProgramSlice.reducer,
    mobileMasterControl: mobileMasterControlSlice.reducer,
    appInfo: appSlice.reducer,
    locations: locationsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        warnAfter: 128,
      },
    }),
});

export default store;
