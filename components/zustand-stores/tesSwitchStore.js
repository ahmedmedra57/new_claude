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
  isTesSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,
  devicesConflicts: {
    systemTarget: '',
    currentSwitch: '',
    DesiredSwitch: '',
    commandTarget: '',
    extraData: null,
  },
  isOff: false,
  freezeBy: null,
  isTGSActive: false,
  isExpanded: false,
  openMachineController: false,
  isFaults: false,
  isGp: true,
  isReactiveByTgs: false,
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
  usageHours: 50,
  energyConsump: 700,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },
  windFactor: { isReady: false, isActivated: false },
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

const useTesSwitchStore = createStore('tesSwitch', (set) => ({
  'bet-north': { '01': initialState, '02': initialState, '03': initialState, '04': initialState },
  'bet-south': { '01': initialState, '02': initialState, '03': initialState },
  'n.coast': { '01': initialState, '02': initialState, '03': initialState, '04': initialState },
  tesSwitch: {},
  flatTesSwitch: {},

  selectIndividualMachine: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTesSwitch[location][specificLocation][machine].isSelected = true;
    } else {
      state.flatTesSwitch[location][machine].isSelected = true;
    }
  }),
  tesSpecificLocationSelectMachine: (specificLocation, machine) => set((state) => {
    state.flatTesSwitch[specificLocation][machine].isSelected = true;
  }),
  unselectIndividualMachine: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTesSwitch[location][specificLocation][machine].isSelected = false;
    } else {
      state.flatTesSwitch[location][machine].isSelected = false;
    }
  }),
  tesSpecificLocationUnselectMachine: (location, specificLocation, machine) => set((state) => {
    state.flatTesSwitch[location][specificLocation][machine].isSelected = false;
  }),
  setInstantHeat: (location, machine, temp, isF) => set((state) => {
    state.flatTesSwitch[location][machine].instantHeat.inputTemp = temp;
    state.flatTesSwitch[location][machine].instantHeat.isF = isF;
    state.flatTesSwitch[location][machine].instantHeat.isReady = true;
  }),
  setInstantHeatIsReady: (location, specificLocation, machine, temp, isF) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.instantHeat.inputTemp = temp;
    target.instantHeat.isF = isF;
    target.instantHeat.isReady = true;
  }),
  setInstantHeatOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.instantHeat.isActivated = false;
    target.instantHeat.isReady = false;
  }),
  resetInstantHeat: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTesSwitch[location][specificLocation][machine].instantHeat = { ...initialState.instantHeat };
    } else {
      state.flatTesSwitch[location][machine].instantHeat = { ...initialState.instantHeat };
    }
  }),
  setSnowSensor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.snowSensor.isReady = true;
  }),
  setSnowSensorOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.snowSensor.isReady = false;
  }),
  resetSnowSensor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.snowSensor = { ...initialState.snowSensor };
  }),
  setOptionalConstantTempReady: (location, specificLocation, machine, temp, isF) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.optionalConstantTemp.inputTemp = temp;
    target.optionalConstantTemp.isF = isF;
    target.optionalConstantTemp.isReady = true;
  }),
  setMachineOptionalConstantTempOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.optionalConstantTemp.isActivated = false;
    target.optionalConstantTemp.isReady = false;
  }),
  resetOptionalConstantTemp: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.optionalConstantTemp = { ...initialState.optionalConstantTemp };
  }),
  setWindFactor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.windFactor.isReady = true;
  }),
  setWindFactorOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.windFactor.isReady = false;
  }),
  resetWindFactor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.windFactor = { ...initialState.windFactor };
  }),
  addHeatingSchedule: (location, specificLocation, machine, start, end, inputTemp, isF, id) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    const existingIndex = target.heatingScheduleList.findIndex((s) => s.id === id);
    if (existingIndex !== -1) {
      target.heatingScheduleList[existingIndex] = { start, end, inputTemp, isF, id };
    } else {
      target.heatingScheduleList.push({ start, end, inputTemp, isF, id });
    }
  }),
  setReadyHeatingSchedule: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.heatingSchedule.isReady = true;
  }),
  clearHeatingSchedule: (location, specificLocation, machine, id) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    const index = target.heatingScheduleList.findIndex((s) => s.id === id);
    if (index !== -1) target.heatingScheduleList.splice(index, 1);
  }),
  resetHeatingSchedule: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.heatingSchedule = { ...initialState.heatingSchedule };
    target.heatingScheduleList = [...initialState.heatingScheduleList];
  }),
  setShutOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.isOff = true;
  }),
  resetMachinesState: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTesSwitch[location][specificLocation][machine] = { ...initialState };
    } else {
      state.flatTesSwitch[location][machine] = { ...initialState };
    }
  }),
  toggleSSR: (location, specificLocation, machine, ssrKey) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    const ssr = target.ssrState[ssrKey];
    ssr.buttonStatus = ssr.buttonStatus === 'on' ? 'off' : 'on';
  }),
  expandSSRDetail: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.isExpanded = !target.isExpanded;
  }),
  changeSSRDetail: (location, specificLocation, machine, ssrKey, detail) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    Object.assign(target.ssrState[ssrKey], detail);
  }),
  setOpenMachineController: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.openMachineController = !target.openMachineController;
  }),
  setOpenSetting: (location, specificLocation, machine, ssrKey) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.ssrState[ssrKey].isSettingOpen = !target.ssrState[ssrKey].isSettingOpen;
  }),
  setOpenPasswordBox: (location, specificLocation, machine, ssrKey) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.ssrState[ssrKey].openPasswordBox = !target.ssrState[ssrKey].openPasswordBox;
  }),
  setAtsSelection: (location, specificLocation, machine, selection) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.atsSelection = selection;
  }),
  unselectAllProgram: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.mobileSelectedProgram = { ...initialState.mobileSelectedProgram };
  }),
  selectProgram: (location, specificLocation, machine, program) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.mobileSelectedProgram[program] = !target.mobileSelectedProgram[program];
  }),
  setTesSwitch: (data) => set((state) => {
    state.tesSwitch = reduce(data, (result, location) => {
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
    state.flatTesSwitch = reduce(data, (result, location) => {
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
  setTesSwitchSocket: (socketData) => set((state) => {
    const { location, machine, data } = socketData;
    if (state.flatTesSwitch[location]?.[machine]) {
      Object.assign(state.flatTesSwitch[location][machine], data);
    }
  }),
  setTesSSRState: (location, specificLocation, machine, ssrState) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    target.ssrState = ssrState;
  }),
  setTesSSRStateSocket: (location, specificLocation, machine, ssrKey, ssrData) => set((state) => {
    const target = specificLocation
      ? state.flatTesSwitch[location][specificLocation][machine]
      : state.flatTesSwitch[location][machine];
    Object.assign(target.ssrState[ssrKey], ssrData);
  }),
  setTesGraph: (location, machine, graphType, data) => set((state) => {
    state.flatTesSwitch[location][machine][graphType] = data;
  }),
  setTesGraphDate: (location, machine, graphDateData) => set((state) => {
    state.flatTesSwitch[location][machine].graphDateData = graphDateData;
  }),
}));

export default useTesSwitchStore;
