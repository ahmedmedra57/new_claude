import { createStore } from './storeUtils';
import { isNumber, reduce } from 'lodash';
import { convertCelsiusToFahrenheit } from '../../helpers/helpers';

const ssrInitialState = {
  select: 'tc-01',
  buttonStatus: 'on',
  switchName: null,
  description: [null, null, null],
  index: 1,
  isSettingOpen: false,
  openPasswordBox: false,
};

const initialState = {
  machineType: 'ess',
  deviceMac: null,
  deviceStatus: null,
  isEssSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,
  isOff: false,
  freezeBy: null,
  isExpanded: false,
  openMachineController: false,
  isFaults: false,
  isGp: true,
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
  snowSensor: { isReady: false, isActivated: false, defaultTemp: 350, isF: null },
  optionalConstantTemp: { inputTemp: 0, apply: false, isActivated: false, isReady: false, isF: null },
  heatingScheduleList: [{ start: { date: null, time: null }, end: { date: null, time: null }, inputTemp: null, isF: null, id: null }],
  heatingSchedule: { isReady: false, isActivated: false, disable: false },
  heatingSystem: '#10 Switch Turnout',
  heatingSystemAbbr: '',
  usageHours: 75,
  energyConsump: 300,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },
  windFactor: { isReady: false, isActivated: false },
  ats: { isActivated: false },
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
};

const useEssSwitchStore = createStore('essSwitch', (set) => ({
  'bet-east': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  'bet-west': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  's.coast': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  'n-Mountain': { '01': initialState, '02': initialState, '03': initialState },
  essSwitch: {},
  flatEssSwitch: {},

  selectIndividualMachine: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].isSelected = true;
  }),
  essSpecificLocationSelectMachine: (specificLocation, machine) => set((state) => {
    state.flatEssSwitch[specificLocation][machine].isSelected = true;
  }),
  unselectIndividualMachine: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].isSelected = false;
  }),
  essSpecificLocationUnselectMachine: (specificLocation, machine) => set((state) => {
    state.flatEssSwitch[specificLocation][machine].isSelected = false;
  }),
  setInstantHeatReady: (location, machine, isF, temp) => set((state) => {
    state.flatEssSwitch[location][machine].instantHeat.inputTemp = temp;
    state.flatEssSwitch[location][machine].instantHeat.isF = isF;
    state.flatEssSwitch[location][machine].instantHeat.isReady = true;
  }),
  setInstantHeatOff: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].instantHeat.isActivated = false;
    state.flatEssSwitch[location][machine].instantHeat.isReady = false;
  }),
  resetInstantHeat: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].instantHeat = { ...initialState.instantHeat };
  }),
  setSnowSensor: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].snowSensor.isReady = true;
  }),
  setSnowSensorOff: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].snowSensor.isReady = false;
  }),
  resetSnowSensor: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].snowSensor = { ...initialState.snowSensor };
  }),
  setOptionalConstantTempReady: (location, machine, temp, isF) => set((state) => {
    state.flatEssSwitch[location][machine].optionalConstantTemp.inputTemp = temp;
    state.flatEssSwitch[location][machine].optionalConstantTemp.isF = isF;
    state.flatEssSwitch[location][machine].optionalConstantTemp.isReady = true;
  }),
  setMachineOptionalConstantTempOff: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].optionalConstantTemp.isActivated = false;
    state.flatEssSwitch[location][machine].optionalConstantTemp.isReady = false;
  }),
  resetOptionalConstantTemp: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].optionalConstantTemp = { ...initialState.optionalConstantTemp };
  }),
  setWindFactor: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].windFactor.isReady = true;
  }),
  setWindFactorOff: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].windFactor.isReady = false;
  }),
  resetWindFactor: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].windFactor = { ...initialState.windFactor };
  }),
  addHeatingSchedule: (location, machine, start, end, inputTemp, isF, id) => set((state) => {
    const schedule = state.flatEssSwitch[location][machine].heatingScheduleList;
    const existingIndex = schedule.findIndex((s) => s.id === id);
    if (existingIndex !== -1) {
      schedule[existingIndex] = { start, end, inputTemp, isF, id };
    } else {
      schedule.push({ start, end, inputTemp, isF, id });
    }
  }),
  setReadyHeatingSchedule: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].heatingSchedule.isReady = true;
  }),
  clearHeatingSchedule: (location, machine, id) => set((state) => {
    const schedule = state.flatEssSwitch[location][machine].heatingScheduleList;
    const index = schedule.findIndex((s) => s.id === id);
    if (index !== -1) schedule.splice(index, 1);
  }),
  resetHeatingSchedule: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].heatingSchedule = { ...initialState.heatingSchedule };
    state.flatEssSwitch[location][machine].heatingScheduleList = [...initialState.heatingScheduleList];
  }),
  setShutOff: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].isOff = true;
  }),
  resetMachinesState: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine] = { ...initialState };
  }),
  setSelector: (location, machine, value) => set((state) => {
    state.flatEssSwitch[location][machine].selector = value;
  }),
  toggleSSR: (location, machine, ssrKey) => set((state) => {
    const ssr = state.flatEssSwitch[location][machine].ssrState[ssrKey];
    ssr.buttonStatus = ssr.buttonStatus === 'on' ? 'off' : 'on';
  }),
  expandSSRDetail: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].isExpanded = !state.flatEssSwitch[location][machine].isExpanded;
  }),
  changeSSRDetail: (location, machine, ssrKey, detail) => set((state) => {
    Object.assign(state.flatEssSwitch[location][machine].ssrState[ssrKey], detail);
  }),
  setOpenMachineController: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].openMachineController = !state.flatEssSwitch[location][machine].openMachineController;
  }),
  setOpenSetting: (location, machine, ssrKey) => set((state) => {
    state.flatEssSwitch[location][machine].ssrState[ssrKey].isSettingOpen = !state.flatEssSwitch[location][machine].ssrState[ssrKey].isSettingOpen;
  }),
  setOpenPasswordBox: (location, machine, ssrKey) => set((state) => {
    state.flatEssSwitch[location][machine].ssrState[ssrKey].openPasswordBox = !state.flatEssSwitch[location][machine].ssrState[ssrKey].openPasswordBox;
  }),
  setAtsSelection: (location, machine, selection) => set((state) => {
    state.flatEssSwitch[location][machine].atsSelection = selection;
  }),
  unselectAllProgram: (location, machine) => set((state) => {
    state.flatEssSwitch[location][machine].mobileSelectedProgram = { ...initialState.mobileSelectedProgram };
  }),
  selectProgram: (location, machine, program) => set((state) => {
    state.flatEssSwitch[location][machine].mobileSelectedProgram[program] = !state.flatEssSwitch[location][machine].mobileSelectedProgram[program];
  }),
  setEssSwitch: (data) => set((state) => {
    state.essSwitch = reduce(data, (result, location) => {
      if (location.specific_location) {
        result[location.zone_id] = location.specific_location.reduce((acc, specificLocation) => {
          acc[specificLocation.zone_id] = specificLocation.devices.reduce((devices, device) => {
            devices[device.device_mac] = { ...initialState, deviceMac: device.device_mac };
            return devices;
          }, {});
          return acc;
        }, {});
      } else {
        result[location.zone_id] = location.devices.reduce((devices, device) => {
          devices[device.device_mac] = { ...initialState, deviceMac: device.device_mac };
          return devices;
        }, {});
      }
      return result;
    }, {});
    state.flatEssSwitch = reduce(data, (result, location) => {
      if (location.specific_location) {
        location.specific_location.forEach((specificLocation) => {
          result[specificLocation.zone_id] = specificLocation.devices.reduce((devices, device) => {
            devices[device.device_mac] = { ...initialState, deviceMac: device.device_mac };
            return devices;
          }, {});
        });
      } else {
        result[location.zone_id] = location.devices.reduce((devices, device) => {
          devices[device.device_mac] = { ...initialState, deviceMac: device.device_mac };
          return devices;
        }, {});
      }
      return result;
    }, {});
  }),
  setEssSwitchSocket: (socketData) => set((state) => {
    const { location, machine, data } = socketData;
    if (state.flatEssSwitch[location]?.[machine]) {
      Object.assign(state.flatEssSwitch[location][machine], data);
    }
  }),
  setEssSSRState: (location, machine, ssrState) => set((state) => {
    state.flatEssSwitch[location][machine].ssrState = ssrState;
  }),
  setEssSSRStateSocket: (location, machine, ssrKey, ssrData) => set((state) => {
    Object.assign(state.flatEssSwitch[location][machine].ssrState[ssrKey], ssrData);
  }),
  setEssGraph: (location, machine, graphType, data) => set((state) => {
    state.flatEssSwitch[location][machine][graphType] = data;
  }),
  setEssGraphDate: (location, machine, graphDateData) => set((state) => {
    state.flatEssSwitch[location][machine].graphDateData = graphDateData;
  }),
}));

export default useEssSwitchStore;
