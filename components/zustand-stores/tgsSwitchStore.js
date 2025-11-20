import { createStore } from './storeUtils';
import clone from 'lodash/clone';
import isNumber from 'lodash/isNumber';
import reduce from 'lodash/reduce';
import { convertCelsiusToFahrenheit } from '../../helpers/helpers';

const initialState = {
  machineType: 'tgs',
  deviceMac: null,
  deviceStatus: null,
  isTgsSwitchActivated: false,
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
  isTESActive: false,
  isExpanded: false,
  openMachineController: false,
  isFaults: false,
  isGp: true,
  isEbp: false,
  atsSelection: [],
  isWifi: false,
  thermocouple: false,
  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,
  heatingSystemAbbr: '',
  usageHours: 650,
  energyConsump: 1200,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },
  instantHeat: { inputTemp: 0, isReady: false, isActivated: false, isF: null },
  fanOnly: false,
  snowSensor: { isReady: false, isActivated: false, defaultTemp: 350, isF: null },
  optionalConstantTemp: { inputTemp: 0, apply: false, isActivated: false, isReady: false, isF: null },
  heatingScheduleList: [{ start: { date: null, time: null }, end: { date: null, time: null }, inputTemp: null, isF: null, id: null }],
  heatingSchedule: { isReady: false, isActivated: false, disable: false },
  windFactor: { isReady: false, isActivated: false },
  mobileSelectedProgram: {
    instantHeat: false,
    snowSensor: false,
    windFactor: false,
    fanOnly: false,
    ats: false,
    shutOff: false,
    heatingSchedule: false,
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

const useTgsSwitchStore = createStore('tgsSwitch', (set) => ({
  'mtl-east': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  'mtl-west': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  'mtl-south': { '01': initialState, '02': initialState, '03': initialState, '04': initialState, '05': initialState },
  tgsSwitch: {},
  flatTgsSwitch: {},

  selectIndividualMachine: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTgsSwitch[location][specificLocation][machine].isSelected = true;
    } else {
      state.flatTgsSwitch[location][machine].isSelected = true;
    }
  }),
  tgsSpecificLocationSelectMachine: (specificLocation, machine) => set((state) => {
    state.flatTgsSwitch[specificLocation][machine].isSelected = true;
  }),
  unselectIndividualMachine: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTgsSwitch[location][specificLocation][machine].isSelected = false;
    } else {
      state.flatTgsSwitch[location][machine].isSelected = false;
    }
  }),
  tgsSpecificLocationUnselectMachine: (location, specificLocation, machine) => set((state) => {
    state.flatTgsSwitch[location][specificLocation][machine].isSelected = false;
  }),
  setInstantHeat: (location, machine, temp, isF) => set((state) => {
    state.flatTgsSwitch[location][machine].instantHeat.inputTemp = temp;
    state.flatTgsSwitch[location][machine].instantHeat.isF = isF;
    state.flatTgsSwitch[location][machine].instantHeat.isReady = true;
  }),
  setInstantHeatIsReady: (location, specificLocation, machine, temp, isF) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.instantHeat.inputTemp = temp;
    target.instantHeat.isF = isF;
    target.instantHeat.isReady = true;
  }),
  setInstantHeatOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.instantHeat.isActivated = false;
    target.instantHeat.isReady = false;
  }),
  resetInstantHeat: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTgsSwitch[location][specificLocation][machine].instantHeat = { ...initialState.instantHeat };
    } else {
      state.flatTgsSwitch[location][machine].instantHeat = { ...initialState.instantHeat };
    }
  }),
  setSnowSensor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.snowSensor.isReady = true;
  }),
  setSnowSensorOff: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTgsSwitch[location][specificLocation][machine].snowSensor.isReady = false;
    } else {
      state.flatTgsSwitch[location][machine].snowSensor.isReady = false;
    }
  }),
  resetSnowSensor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.snowSensor = { ...initialState.snowSensor };
  }),
  setWindFactor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.windFactor.isReady = true;
  }),
  setWindFactorOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.windFactor.isReady = false;
  }),
  resetWindFactor: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.windFactor = { ...initialState.windFactor };
  }),
  setFanOnly: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.fanOnly = true;
  }),
  setFanOnlyOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.fanOnly = false;
  }),
  addHeatingSchedule: (location, specificLocation, machine, start, end, inputTemp, isF, id) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    const existingIndex = target.heatingScheduleList.findIndex((s) => s.id === id);
    if (existingIndex !== -1) {
      target.heatingScheduleList[existingIndex] = { start, end, inputTemp, isF, id };
    } else {
      target.heatingScheduleList.push({ start, end, inputTemp, isF, id });
    }
  }),
  setReadyHeatingSchedule: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.heatingSchedule.isReady = true;
  }),
  clearHeatingSchedule: (location, specificLocation, machine, id) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    const index = target.heatingScheduleList.findIndex((s) => s.id === id);
    if (index !== -1) target.heatingScheduleList.splice(index, 1);
  }),
  resetHeatingSchedule: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.heatingSchedule = { ...initialState.heatingSchedule };
    target.heatingScheduleList = [...initialState.heatingScheduleList];
  }),
  setShutOff: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.isOff = true;
  }),
  resetMachinesState: (location, specificLocation, machine) => set((state) => {
    if (specificLocation) {
      state.flatTgsSwitch[location][specificLocation][machine] = { ...initialState };
    } else {
      state.flatTgsSwitch[location][machine] = { ...initialState };
    }
  }),
  expandDetail: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.isExpanded = !target.isExpanded;
  }),
  setOpenMachineController: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.openMachineController = !target.openMachineController;
  }),
  setAtsSelection: (location, specificLocation, machine, selection) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.atsSelection = selection;
  }),
  unselectAllProgram: (location, specificLocation, machine) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.mobileSelectedProgram = { ...initialState.mobileSelectedProgram };
  }),
  selectProgram: (location, specificLocation, machine, program) => set((state) => {
    const target = specificLocation
      ? state.flatTgsSwitch[location][specificLocation][machine]
      : state.flatTgsSwitch[location][machine];
    target.mobileSelectedProgram[program] = !target.mobileSelectedProgram[program];
  }),
  setTgsSwitch: (data) => set((state) => {
    state.tgsSwitch = reduce(data, (result, location) => {
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
    state.flatTgsSwitch = reduce(data, (result, location) => {
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
  setTgsSwitchSocket: (socketData) => set((state) => {
    const { location, machine, data } = socketData;
    if (state.flatTgsSwitch[location]?.[machine]) {
      Object.assign(state.flatTgsSwitch[location][machine], data);
    }
  }),
  setTgsGraph: (location, machine, graphType, data) => set((state) => {
    state.flatTgsSwitch[location][machine][graphType] = data;
  }),
  setTgsGraphDate: (location, machine, graphDateData) => set((state) => {
    state.flatTgsSwitch[location][machine].graphDateData = graphDateData;
  }),
}));

export default useTgsSwitchStore;
