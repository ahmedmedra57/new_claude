/**
 * Redux Slice Factory for System Switches
 *
 * Generates Redux slices for ESS, TES, and TGS systems to eliminate
 * the 3,316 lines of duplication across essSwitchSlice.js, tesSwitchSlice.js,
 * and tgsSwitchSlice.js.
 *
 * Each system has nearly identical logic but different:
 * - Slice names (essSwitch, tesSwitch, tgsSwitch)
 * - State property names (flatEssSwitch, flatTgsSwitch, flatTesSwitch)
 * - Location configurations
 *
 * This factory eliminates ~2,300 lines of duplicate code.
 */

import { createSlice } from '@reduxjs/toolkit';
import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';

/**
 * SSR Initial State (same for all systems)
 */
const ssrInitialState = {
  select: 'tc-01',
  buttonStatus: 'on',
  switchName: null,
  description: [null, null, null],
  index: 1,
  isSettingOpen: false,
  openPasswordBox: false,
};

/**
 * Creates the initial state for a machine
 * @param {string} machineType - System type (ess, tes, tgs)
 * @returns {object} - Initial machine state
 */
const createMachineInitialState = (machineType) => ({
  machineType,
  deviceMac: null,
  deviceStatus: null,
  [`is${machineType.charAt(0).toUpperCase()}${machineType.slice(1)}SwitchActivated`]: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,

  devicesConflicts: machineType === 'tes' ? {
    systemTarget: '',
    currentSwitch: '',
    DesiredSwitch: '',
    commandTarget: '',
    extraData: null,
  } : undefined,

  isOff: false,
  freezeBy: null,
  isTGSActive: machineType === 'tes',
  isExpanded: false,

  openMachineController: false,
  isFaults: false,
  isGp: true,
  isReactiveByTgs: machineType === 'tes',
  isEbp: false,
  atsSelection: [],
  isWifi: false,
  thermocouple: false,
  heaterThermocoupleMap: [],

  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,

  instantHeat: { inputTemp: 0, isReady: false, isActivated: false, isF: null },
  snowSensor: {
    isReady: false,
    isActivated: false,
    defaultTemp: 350,
    isF: null,
  },

  optionalConstantTemp: {
    inputTemp: 0,
    apply: false,
    isActivated: false,
    isReady: false,
    isF: null,
  },

  heatingScheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: null,
      isF: null,
      id: null,
    },
  ],

  heatingSchedule: {
    isReady: false,
    isActivated: false,
    disable: false,
  },

  heatingSystem: '#10 Switch Turnout',
  heatingSystemAbbr: '',
  usageHours: machineType === 'tes' ? 50 : 75,
  energyConsump: machineType === 'tes' ? 700 : 300,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },

  windFactor: { isReady: false, isActivated: false },
  ats: machineType !== 'tes' ? { isActivated: false } : undefined,

  mobileSelectedProgram: {
    instantHeat: false,
    snowSensor: false,
    windFactor: false,
    optionalConstantTemp: false,
    ats: false,
    shutOff: false,
    heatingSchedule: false,
  },

  ssrState: {
    ssr1: { ...ssrInitialState, specs: [] },
    ssr2: { ...ssrInitialState, currentCurrent: 0, specs: [], buttonStatus: 'flt' },
    ssr3: { ...ssrInitialState, specs: [] },
    ssr4: { ...ssrInitialState, specs: [], currentCurrent: [10.65] },
    ssr5: { ...ssrInitialState, specs: [] },
    ssr6: { ...ssrInitialState, specs: [] },
    ssr7: { ...ssrInitialState, specs: [], buttonStatus: 'off' },
    ssr8: { ...ssrInitialState, specs: [] },
  },

  // graphs
  heaterGraphData: [],
  enclosureGraphData: [],
  outsideGraphData: [],
  gasGraphData: [],
  snowGraphData: [],
  windGraphData: [],

  graphDateData: {
    heaterGraphData: [],
    enclosureGraphData: [],
    outsideGraphData: [],
    gasGraphData: [],
    snowGraphData: [],
    windGraphData: [],
    energyGasConsumptionGraphData: [],
    dataConsumptionGraphData: [],
    intervalUnit: '',
  },
});

/**
 * System location configurations
 */
const SYSTEM_LOCATIONS = {
  ess: {
    'bet-east': ['01', '02', '03', '04', '05'],
    'bet-west': ['01', '02', '03', '04', '05'],
    's.coast': ['01', '02', '03', '04', '05'],
    'n-Mountain': ['01', '02', '03'],
  },
  tes: {
    'bet-north': ['01', '02', '03', '04'],
    'bet-south': ['01', '02', '03'],
    'n.coast': ['01', '02', '03', '04', '05'],
  },
  tgs: {
    bet: ['01', '02', '03', '04'],
    coast: ['01', '02', '03', '04', '05'],
    mountain: ['01', '02', '03'],
  },
};

/**
 * Creates initial state structure for a system
 * @param {string} systemType - System type (ess, tes, tgs)
 * @returns {object} - Initial state with all locations and machines
 */
const createSystemInitialState = (systemType) => {
  const machineState = createMachineInitialState(systemType);
  const locations = SYSTEM_LOCATIONS[systemType];
  const state = {};

  Object.entries(locations).forEach(([location, machines]) => {
    state[location] = {};
    machines.forEach((machine) => {
      state[location][machine] = { ...machineState };
    });
  });

  const systemKey = `${systemType}Switch`;
  const flatKey = `flat${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}Switch`;

  state[systemKey] = {};
  state[flatKey] = {};

  return state;
};

/**
 * Creates reducers for a system slice
 * @param {string} systemType - System type (ess, tes, tgs)
 * @param {object} initialState - Machine initial state
 * @returns {object} - Reducer functions
 */
const createReducers = (systemType, initialState) => {
  const flatKey = `flat${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}Switch`;
  const systemKey = `${systemType}Switch`;

  return {
    handleSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].isSelected = true;
    },

    [`${systemType}SpecificLocationSelectMachinesHandler`]: (state, action) => {
      state[flatKey][action.payload.specificLocation][action.payload.machine].isSelected = true;
    },

    handleUnSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].isSelected = false;
    },

    [`${systemType}SpecificLocationUnselectMachinesHandler`]: (state, action) => {
      state[flatKey][action.payload.specificLocation][action.payload.machine].isSelected = false;
    },

    handleInstantHeatReady: (state, action) => {
      const { location, machine, isF, temp } = action.payload;
      state[flatKey][location][machine].instantHeat.inputTemp = temp;
      state[flatKey][location][machine].instantHeat.isF = isF;
      state[flatKey][location][machine].instantHeat.isReady = true;
    },

    handleInstantHeatOff: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].instantHeat.isActivated = false;
      state[flatKey][location][machine].instantHeat.isReady = false;
    },

    handleInstantHeatReset: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].instantHeat = { ...initialState.instantHeat };
    },

    handleSnowSensor: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].snowSensor.isReady = true;
    },

    handleSnowSensorOff: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].snowSensor.isReady = false;
    },

    handleSnowSensorReset: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].snowSensor = { ...initialState.snowSensor };
    },

    handleOptionalConstantTempReady: (state, action) => {
      const { location, machine, temp, isF } = action.payload;
      state[flatKey][location][machine].optionalConstantTemp.inputTemp = temp;
      state[flatKey][location][machine].optionalConstantTemp.isF = isF;
      state[flatKey][location][machine].optionalConstantTemp.isReady = true;
    },

    handleMachineOptionalConstantTempOff: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].optionalConstantTemp.isActivated = false;
      state[flatKey][location][machine].optionalConstantTemp.isReady = false;
    },

    handleOptionalConstantTempReset: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].optionalConstantTemp = {
        ...initialState.optionalConstantTemp,
      };
    },

    handleWindFactor: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].windFactor.isReady = true;
    },

    handleWindFactorOff: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].windFactor.isReady = false;
    },

    handleWindFactorReset: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].windFactor = { ...initialState.windFactor };
    },

    handleAddHeatingSchedule: (state, action) => {
      const { location, machine, index, start, end, inputTemp, isF, id } = action.payload;
      state[flatKey][location][machine].heatingScheduleList[index] = {
        start,
        end,
        inputTemp,
        isF,
        id,
      };
      state[flatKey][location][machine].heatingScheduleList[index + 1] = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
        id: null,
      };
    },

    handleReadyHeatingSchedule: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].heatingSchedule.isReady = true;
    },

    handleClearHeatingSchedule: (state, action) => {
      const { location, machine, index } = action.payload;
      state[flatKey][location][machine].heatingScheduleList.splice(index, 1);

      if (state[flatKey][location][machine].heatingScheduleList.length === 0) {
        state[flatKey][location][machine].heatingScheduleList = [
          {
            start: { date: null, time: null },
            end: { date: null, time: null },
            inputTemp: null,
            isF: null,
            id: null,
          },
        ];
        state[flatKey][location][machine].heatingSchedule.isReady = false;
      }
    },

    handleHeatingScheduleReset: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].heatingScheduleList = [
        {
          start: { date: null, time: null },
          end: { date: null, time: null },
          inputTemp: null,
          isF: null,
          id: null,
        },
      ];
      state[flatKey][location][machine].heatingSchedule.isReady = false;
    },

    handleShutOff: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].isOff = true;
    },

    handleAtsSelection: (state, action) => {
      const { location, machine, atsSelection } = action.payload;
      state[flatKey][location][machine].atsSelection = atsSelection;
    },

    handleOpenMachineController: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].openMachineController =
        !state[flatKey][location][machine].openMachineController;
    },

    handleSelector: (state, action) => {
      const { location, machine } = action.payload;
      const currentState = state[flatKey][location][machine].isExpanded;
      state[flatKey][location][machine].isExpanded = !currentState;
    },

    handleOpenSetting: (state, action) => {
      const { name, index } = action.payload;
      state[flatKey][action.payload.location][action.payload.machine].ssrState[
        name
      ].isSettingOpen = !state[flatKey][action.payload.location][action.payload.machine].ssrState[
        name
      ].isSettingOpen;
    },

    handleOpenPasswordBox: (state, action) => {
      const { name } = action.payload;
      state[flatKey][action.payload.location][action.payload.machine].ssrState[
        name
      ].openPasswordBox =
        !state[flatKey][action.payload.location][action.payload.machine].ssrState[name]
          .openPasswordBox;
    },

    handleExpandSSRDetail: (state, action) => {
      const { location, machine } = action.payload;
      state[flatKey][location][machine].isExpanded = !state[flatKey][location][machine].isExpanded;
    },

    handleToggleSSR: (state, action) => {
      const { location, machine, ssrName, status } = action.payload;
      state[flatKey][location][machine].ssrState[ssrName].buttonStatus = status;
    },

    handleChangeSSRDetail: (state, action) => {
      const { location, machine, name, select } = action.payload;
      state[flatKey][location][machine].ssrState[name].select = select;
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}Switch`]: (state, action) => {
      state[systemKey] = action.payload;
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}SwitchSocket`]: (
      state,
      action
    ) => {
      const machines = action.payload;
      if (Object.keys(machines).length > 0) {
        state[flatKey] = machines;
      }
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}SSRState`]: (
      state,
      action
    ) => {
      const { location, machine, ssrState } = action.payload;
      state[flatKey][location][machine].ssrState = ssrState;
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}SSRStateSocket`]: (
      state,
      action
    ) => {
      const { location, machine, name, ssrData } = action.payload;
      state[flatKey][location][machine].ssrState[name] = ssrData;
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}Graph`]: (state, action) => {
      const { location, machine, graphType, graphData } = action.payload;
      state[flatKey][location][machine][graphType] = graphData;
    },

    [`handle${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}GraphDate`]: (
      state,
      action
    ) => {
      const { location, machine, graphDateData } = action.payload;
      state[flatKey][location][machine].graphDateData = graphDateData;
    },
  };
};

/**
 * Creates a Redux slice for a system (ESS, TES, or TGS)
 * @param {string} systemType - System type ('ess', 'tes', 'tgs')
 * @returns {object} - Redux slice
 */
export const createSystemSlice = (systemType) => {
  const machineInitialState = createMachineInitialState(systemType);
  const initialState = createSystemInitialState(systemType);
  const reducers = createReducers(systemType, machineInitialState);

  return createSlice({
    name: `${systemType}Switch`,
    initialState,
    reducers,
  });
};

/**
 * Creates selector for a system's switch state
 * @param {string} systemType - System type ('ess', 'tes', 'tgs')
 * @returns {function} - Selector function
 */
export const createSystemSelector = (systemType) => {
  const systemKey = `${systemType}Switch`;
  const flatKey = `flat${systemType.charAt(0).toUpperCase()}${systemType.slice(1)}Switch`;

  return (state) => ({
    [`${systemType}Switch`]: state[systemKey][systemKey],
    [flatKey]: state[systemKey][flatKey],
  });
};
