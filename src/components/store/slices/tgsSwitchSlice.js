import { createSlice } from '@reduxjs/toolkit';
import clone from 'lodash/clone';
import isNumber from 'lodash/isNumber';
import reduce from 'lodash/reduce';
import { convertCelsiusToFahrenheit } from '../../../helpers/helpers';

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

  // ssr detail

  isExpanded: false,
  // master control individual machine
  openMachineController: false,

  isFaults: false,
  isGp: true,
  isEbp: false,
  atsSelection: [],
  isWifi: false,
  thermocouple: false,

  currentTemp: null,
  setTemp: null,

  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,

  // telemetry
  heatingSystemAbbr: '',
  usageHours: 650,
  energyConsump: 1200,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },
  //

  instantHeat: { inputTemp: 0, isReady: false, isActivated: false, isF: null },
  fanOnly: false,
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

  windFactor: { isReady: false, isActivated: false },
  // ats: { isActivated: false },

  mobileSelectedProgram: {
    instantHeat: false,
    snowSensor: false,
    windFactor: false,
    fanOnly: false,
    ats: false,
    shutOff: false,
    heatingSchedule: false,
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
};

const tgsSwitchSlice = createSlice({
  name: 'tgsSwitch',
  initialState: {
    'mtl-east': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
    'mtl-west': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
    'mtl-south': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
    tgsSwitch: {},
    flatTgsSwitch: {},
  },
  reducers: {
    tgsHandleSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine].isSelected = true;
      } else {
        state.flatTgsSwitch[location][machine].isSelected = true;
      }
    },
    tgsSpecificLocationSelectMachinesHandler: (state, action) => {
      // // !!TEST
      // state.tgsSwitch[action.payload.location][
      //   action.payload.machine
      // ].isSelected = true;
      // // !! END
      state.flatTgsSwitch[action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    tgsHandleUnSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine].isSelected = false;
      } else {
        state.flatTgsSwitch[location][machine].isSelected = false;
      }
    },
    tgsSpecificLocationUnselectMachinesHandler: (state, action) => {
      // // !!TEST
      // state.tgsSwitch[action.payload.location][
      //   action.payload.machine
      // ].isSelected = false;
      // // !!END
      state.flatTgsSwitch[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ].isSelected = false;
    },
    tgsHandleInstantHeat: (state, action) => {
      // temperature and unit
      state.flatTgsSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.inputTemp = action.payload.temp;

      state.flatTgsSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isF = action.payload.isF;

      // turn on active button
      // state.tgsSwitch[action.payload.location][
      //   action.payload.machine
      // ].instantHeat.isActivated = true;

      // turn on ready button
      state.flatTgsSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isReady = true;
    },
    tgsHandleInstantHeatIsReady: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      if (specificLocation) {
        const instantHeatData =
          state.flatTgsSwitch[location][specificLocation][machine].instantHeat;
        //  temperature and unit
        instantHeatData.inputTemp = temp;
        instantHeatData.isF = isF;
        // turn on ready button
        instantHeatData.isReady = true;
        // // !! TEST
        // const instantHeatData = state.tgsSwitch[location][machine].instantHeat;
        // // temperature and unit
        // instantHeatData.inputTemp = temp;

        // instantHeatData.isF = isF;

        // // turn on ready button
        // instantHeatData.isReady = true;
        // // !! END
      } else {
        const instantHeatData = state.flatTgsSwitch[location][machine].instantHeat;
        // temperature and unit
        instantHeatData.inputTemp = temp;

        instantHeatData.isF = isF;

        // turn on ready button
        instantHeatData.isReady = true;
      }
    },
    tgsHandleInstantHeatOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        const instantHeatData =
          state.flatTgsSwitch[location][specificLocation][machine].instantHeat;
        instantHeatData.isActivated = false;
        instantHeatData.isReady = false;

        // // !! TEST
        // const instantHeatData = state.tgsSwitch[location][machine].instantHeat;
        // instantHeatData.isActivated = false;
        // instantHeatData.isReady = false;
        // // !! END
      } else {
        const instantHeatData = state.flatTgsSwitch[location][machine].instantHeat;
        instantHeatData.isActivated = false;
        instantHeatData.isReady = false;
        // state.tgsSwitch[location][
        //   machine
        // ].instantHeat.inputTemp = 0;
      }
    },
    tgsHandleInstantHeatReset: (state, action) => {
      if (action.payload.specificLocation) {
        state.flatTgsSwitch[action.payload.location][
          action.payload.specificLocation
        ][action.payload.machine].instantHeat = { ...initialState.instantHeat };
      } else {
        state.flatTgsSwitch[action.payload.location][
          action.payload.machine
        ].instantHeat = { ...initialState.instantHeat };
      }
    },
    tgsHandleSnowSensor: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // // !!TEST
        // state.tgsSwitch[location][machine].snowSensor.isReady = true;
        // // !!END
        // turn on ready button
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].snowSensor.isReady = true;
      } else {
        // turn on ready button
        state.flatTgsSwitch[location][machine].snowSensor.isReady = true;
      }
    },
    tgsHandleSnowSensorOff: (state, action) => {
      if (action.payload.specificLocation) {
        // // !!TEST
        // state.tgsSwitch[action.payload.location][
        //   action.payload.machine
        // ].snowSensor.isReady = false;
        // // !!END
        state.flatTgsSwitch[action.payload.location][
          action.payload.specificLocation
        ][action.payload.machine].snowSensor.isReady = false;
      } else {
        state.flatTgsSwitch[action.payload.location][
          action.payload.machine
        ].snowSensor.isReady = false;
      }
    },
    tgsHandleSnowSensorReset: (state, action) => {
      if (action.payload.specificLocation) {
        state.flatTgsSwitch[action.payload.location][
          action.payload.specificLocation
        ][action.payload.machine].snowSensor = { ...initialState.snowSensor };
      } else {
        state.flatTgsSwitch[action.payload.location][
          action.payload.machine
        ].snowSensor = { ...initialState.snowSensor };
      }
    },
    // tgsHandleOptionalConstantTemp: (state, action) => {
    //   // temperature and unit
    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.inputTemp = action.payload.temp;

    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isF = action.payload.isF;

    //   // turn on active button
    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isActivated = true;
    // },

    // tgsHandleOptionalConstantTempOff: (state, action) => {
    //   // turn on active button
    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isActivated = false;

    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.inputTemp = 0;
    // },
    tgsHandleWindFactor: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // turn on ready button
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].windFactor.isReady = true;
      } else {
        // turn on ready button
        state.flatTgsSwitch[location][machine].windFactor.isReady = true;
      }
    },
    tgsHandleWindFactorOff: (state, action) => {
      // turn off ready button
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].windFactor.isReady = false;
      } else {
        state.flatTgsSwitch[location][machine].windFactor.isReady = false;
      }
    },
    tgsHandleWindFactorReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine].windFactor = {
          ...initialState.windFactor,
        };
      } else {
        state.flatTgsSwitch[location][machine].windFactor = {
          ...initialState.windFactor,
        };
      }
    },
    tgsHandleAddHeatingSchedule: (state, action) => {
      const {
        location,
        specificLocation,
        machine,
        start,
        end,
        index,
        inputTemp,
        isF,
        id,
      } = action.payload;
      const heatingSchedule = {
        start: start,
        end: end,
        inputTemp: isF ? convertCelsiusToFahrenheit(inputTemp) : inputTemp,
        isF: isF,
        id: id,
      };
      const resetHeatingSchedule = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
        id: null,
      };
        // add a schedule (start, end, index, temp, isF)
        state.flatTgsSwitch[location][machine].heatingScheduleList[index] =
          heatingSchedule;

        // ready to make next schedule
        state.flatTgsSwitch[location][machine].heatingScheduleList[index + 1] =
          resetHeatingSchedule;
    },
    tgsHandleReadyHeatingSchedule: (state, action) => {
      const { location, machine } = action.payload;
        state.flatTgsSwitch[location][machine].heatingSchedule.isReady = action.payload.state;
    },

    tgsHandleClearHeatingSchedule: (state, action) => {
      const { location, specificLocation, machine, data } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].heatingScheduleList = data;
      } else {
        state.flatTgsSwitch[location][machine].heatingScheduleList = data;
      }
    },
    tgsHandleHeatingScheduleReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        const machineData =
          state.flatTgsSwitch[location][specificLocation][machine];
        machineData.heatingScheduleList = {
          ...initialState.heatingScheduleList,
        };
        machineData.heatingSchedule = {
          ...initialState.heatingSchedule,
        };
      } else {
        const machineData = state.flatTgsSwitch[location][machine];
        machineData.heatingScheduleList = {
          ...initialState.heatingScheduleList,
        };
        machineData.heatingSchedule = {
          ...initialState.heatingSchedule,
        };
      }
    },
    // tgsHandleAts: (state, action) => {
    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },
    // tgsHandleAtsOff: (state, action) => {
    //   state.tgsSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },

    tgsHandleShutOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        if (state.flatTgsSwitch[location][specificLocation][machine].isOff) {
          state.flatTgsSwitch[location][specificLocation][machine].isOff = false;
        } else {
          state.flatTgsSwitch[location][specificLocation][machine].isOff = true;
        }
      } else {
        if (state.flatTgsSwitch[location][machine].isOff) {
          state.flatTgsSwitch[location][machine].isOff = false;
        } else {
          state.flatTgsSwitch[location][machine].isOff = true;
        }
      }
    },
    tgsResetMachinesState: (state, action) => {
      const { location, specificLocation, machine, isF, tgsZones } =
        // action.payload;
        // const address = {};
        // let machineName = '';
        // let selectedMachineInfo = {};
        // let locationName = '';
        // tgsZones.forEach((tgsZone) => {
        //   if (tgsZone.zone_id === location) {
        //     locationName = tgsZone.zone_name;
        //     address.lat = tgsZone.latitude;
        //     address.lng = tgsZone.longitude;

        //     tgsZone.devices.forEach((machineInfo) => {
        //       if (machine === machineInfo.device_mac) {
        //         selectedMachineInfo = { machineInfo };
        //         machineName = machineInfo.device_name;
        //       }
        //     });
        //   }
        // });
        state.flatTgsSwitch[location][machine] = {
          ...initialState,
          ...state.flatTgsSwitch[location][machine],
          // address,
          // machineName,
          // locationId: [location][0],
          // locationName,
          // ...extractDataFromMachine(selectedMachineInfo.machineInfo, isF),
        };
    },
    tgsHandleFanOnly: (state, action) => {
      if (action.payload.specificLocation) {
        // // !!TEST
        // state.tgsSwitch[action.payload.scope || action.payload.location][
        //   action.payload.machine
        // ].fanOnly = action.payload.state;
        // // !!END
        state.flatTgsSwitch[action.payload.scope || action.payload.location][
          action.payload.specificLocation
        ][action.payload.machine].fanOnly = action.payload.state;
      } else {
        state.flatTgsSwitch[action.payload.scope || action.payload.location][
          action.payload.machine
        ].fanOnly = action.payload.state;
      }
    },

    // open master control individual machine
    tgsHandleOpenMachineController: (state, action) => {
      const { location, specificLocation, machine, status } = action.payload;

      if (specificLocation) {
        // // !!TEST
        // state.tgsSwitch[location][machine].openMachineController = status;
        // // !! END
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].openMachineController = status;
      } else {
        state.flatTgsSwitch[location][machine].openMachineController = status;
      }

      // state.tgsSwitch[action.payload.location][
      //   action.payload.machine
      // ].openMachineController = action.payload.status;
    },

    // TGS doesn't use SSR, but this action is needed for consistency with ESS/TES
    tgsHandleExpandSSRDetail: (state, action) => {
      const { location, machine, status } = action.payload;
      state.flatTgsSwitch[location][machine].isExpanded = status;
    },

    tgsHandleAtsSelection: (state, action) => {
      const { location, specificLocation, machine, selection } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine].atsSelection =
          selection;
      } else {
        state.flatTgsSwitch[location][machine].atsSelection = selection;
      }
    },

    // for mobile
    tgsHandleUnselectAllProgram: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const resetProgram = {
        instantHeat: false,
        snowSensor: false,
        windFactor: false,
        fanOnly: false,
        ats: false,
        shutOff: false,
        heatingSchedule: false,
      };
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].mobileSelectedProgram = resetProgram;
      } else {
        state.flatTgsSwitch[location][machine].mobileSelectedProgram = resetProgram;
      }
    },
    tgsHandleSelectProgram: (state, action) => {
      state.flatTgsSwitch[action.payload.location][
        action.payload.machine
      ].mobileSelectedProgram[action.payload.program] =
        !state.flatTgsSwitch[action.payload.location][action.payload.machine]
          .mobileSelectedProgram[action.payload.program];
    },
    handleTgsSwitch: (state, action) => {
      delete state['mtl-east'];
      delete state['mtl-west'];
      delete state['mtl-south'];
      let isF = action.payload.isF;

      const zones = action.payload.tgsZones;

      state.tgsSwitch = reduce(
        zones,
        (result, location) => {
          if (location.specific_location) {
            return {
              ...result,
              [location.zone_id]: {
                isSpecificLocation: true,
                subLocations: location.specific_location.reduce(
                  (result, specificLocation) => {
                    result[specificLocation.zone_id] = {
                      devices: reduce(
                        specificLocation.devices,
                        (result, machine) => {
                          return {
                            ...result,
                            [machine.device_mac]: {
                              ...initialState,
                              address: {
                                lat: location.latitude,
                                lng: location.longitude,
                              },
                              machineName: machine.device_name,
                              locationId: location.zone_id,
                              locationName: location.zone_name,
                              locationAddress: location.zone_address || "",
                              specificLocationName: specificLocation.specific_address || "",
                              isOff: machine.freeze,
                              ...extractDataFromMachine(machine, isF),
                            },
                          };
                        },{}
                      ),
                    };
                    return result;
                  },{}
                ),
              },
            };
          }
          return {
            ...result,
            [location.zone_id]: {
              isSpecificLocation: false,
              devices: reduce(
                location.devices,
                (result, machine) => {
                  return {
                    ...result,
                    [machine.device_mac]: {
                      ...initialState,
                      address: {
                        lat: location.latitude,
                        lng: location.longitude,
                      },
                      machineName: machine.device_name,
                      locationId: location.zone_id,
                      locationName: location.zone_name,
                      locationAddress: location.zone_address || "",
                      specificLocationName: location.specific_address || "",
                      isOff: machine.freeze,
                      ...extractDataFromMachine(machine, isF),
                    },
                  };
                },
                {}
              ),
            },
          };
        },
        {}
      );
      state.flatTgsSwitch = reduce(
        zones,
        (result, value) => {
          if (value.specific_location) {
            return {
              ...result,
              ...reduce(
                value.specific_location,
                (result, location) => ({
                  ...result,
                  [location.zone_id]: reduce(
                    location.devices,
                    (result, machine) => ({
                      ...result,
                      [machine.device_mac]: {
                        ...initialState,
                        address: {
                          lat: location.latitude,
                          lng: location.longitude,
                        },
                        machineName: machine.device_name,
                        parentLocationId: value.zone_id,
                        locationId: location.zone_id,
                        locationName: location.zone_name,
                        locationAddress: location.zone_address || "",
                        specificLocationName: location.specific_address || "",
                        isOff: machine.freeze,
                        ...extractDataFromMachine(machine, isF),
                      },
                    }),
                    {}
                  ),
                }),
                {}
              ),
            };
          }
          return {
            ...result,
            [value.zone_id]: reduce(
              value.devices,
              (result, machine) => ({
                ...result,
                [machine.device_mac]: {
                  ...initialState,
                  address: {
                    lat: value.latitude,
                    lng: value.longitude,
                  },
                  machineName: machine.device_name,
                  locationId: value.zone_id,
                  locationName: value.zone_name,
                  locationAddress: value.zone_address || "",
                  specificLocationName: value.specific_address || "",
                  isOff: machine.freeze,
                  ...extractDataFromMachine(machine, isF),
                },
              }),
              {}
            ),
          };
        },
        {}
      );
    },
    handleTgsSwitchSocket: (state, action) => {
      const data = action.payload.data;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac;
      const isF = action.payload.isF;
      state.flatTgsSwitch[location][machine] = {
        ...state.flatTgsSwitch[location][machine],
        ...extractDataFromMachine(data, isF),
      };
    },
    tgsActivateConflictMessage: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].displayConflictMessage = true;
      } else {
        state.flatTgsSwitch[location][machine].displayConflictMessage = true;
      }
    },
    tgsDeactivateConflictMessage: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][
          machine
        ].displayConflictMessage = false;
      } else {
        state.flatTgsSwitch[location][machine].displayConflictMessage = false;
      }
    },
    tgsSetDevicesConflicts: (state, action) => {
      const {
        location,
        specificLocation,
        machine,
        currentSwitch,
        DesiredSwitch,
        systemTarget,
        commandTarget,
        extraData,
      } = action.payload;
      const dispatchData = {
        currentSwitch,
        desiredSwitch: DesiredSwitch,
        systemTarget,
        commandTarget,
        extraData,
      };
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine].devicesConflicts =
          dispatchData;
      } else {
        state.flatTgsSwitch[location][machine].devicesConflicts = dispatchData;
      }
    },
    handleTgsGraph: (state, action) => {
      const { location, specificLocation, machine, graphType, data } =
        action.payload;
      if (specificLocation) {
        state.flatTgsSwitch[location][specificLocation][machine] = {
          ...state.flatTgsSwitch[location][specificLocation][machine],
          [graphType]: data,
        };
      } else {
        state.flatTgsSwitch[location][machine] = {
          ...state.flatTgsSwitch[location][machine],
          [graphType]: data,
        };
      }
    },
    handleTgsGraphDate: (state, action) => {
      const { location, specificLocation, machine, graphType, data, unit } =
        action.payload;
      if (specificLocation) {
        const machineData =
          state.flatTgsSwitch[location][specificLocation][machine];
        machineData.graphDateData = {
          ...machineData.graphDateData,
          [graphType]: data,
        };

        if (graphType !== 'dataConsumptionGraphData') {
          machineData.graphDateData.intervalUnit = unit;
        }
      } else {
        const machineData = state.flatTgsSwitch[location][machine];
        machineData.graphDateData = {
          ...machineData.graphDateData,
          [graphType]: data,
        };

        if (graphType !== 'dataConsumptionGraphData') {
          machineData.graphDateData.intervalUnit = unit;
        }
      }
    },
  },
});

const extractDataFromMachine = (machine, isF) => {
  const isMachineActive = machine.device_active === 1;

  return {
    ...machine,
    deviceMac: machine.device_mac,
    deviceStatus: machine.device_status,
    usageHours:
      isNumber(machine.hours_of_usage)
        ? Math.floor(machine.hours_of_usage / 3600)
        : null,
    reading:
     isNumber(machine.gas_reading)
        ? Math.floor(machine.gas_reading)
        : null,
    hoursOfUsage:
     isNumber(machine.hours_of_usage)
        ? Math.floor(machine.hours_of_usage / 3600)
        : null,
    enclosureTemp:
      isMachineActive && isNumber(machine.enclosure_temp)
        ? Math.floor(machine.enclosure_temp)
        : null,
    outSideTemp:
      isMachineActive && isNumber(machine.outside_temp)
        ? Math.floor(machine.outside_temp)
        : null,
    consumption:
      isMachineActive && isNumber(machine.gas_consumption)
        ? Math.round(machine.gas_consumption * 10) / 10
        : null,
    setTemp:
      isMachineActive && isNumber(machine.threshold_temp)
        ? Math.floor(machine.threshold_temp)
        : null,
    currentTemp:
      isMachineActive && isNumber(machine.display_temp)
        ? Math.floor(machine.display_temp)
        : null,
    isEbp: (machine.EBP === 1 || machine.EBP === true) && isMachineActive,
    isGp: (machine.EBP === 0 || machine.EBP === false) && isMachineActive,
    EBP_mode:machine.EBP_mode ,
    instantHeat: {
      ...initialState.instantHeat,
      inputTemp: isNumber(machine.instant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.instant_temp)
          : Math.floor(machine.instant_temp)
        : null,
      isReady: isMachineActive && machine.on_switch === 1,
      isActivated:
        isMachineActive &&
        machine.on_switch === 1 &&
        machine.op_mode === 'SWITCH',
    },
    fanOnly: machine.fan === 1,
    snowSensor: {
      ...initialState.snowSensor,
      defaultTemp: isNumber(machine.blower_snow_threshold)
        ? Math.floor(machine.blower_snow_threshold)
        : null,
      isReady: isMachineActive && machine.snow_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.snow_enabled === 1 &&
        machine.snow_trigger === 1,
    },
    windFactor: {
      ...initialState.windFactor,
      isReady: isMachineActive && machine.wind_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.wind_enabled === 1 &&
        machine.wind_trigger === 1,
    },
    heatingSchedule: {
      ...machine.heatingSchedule,
      isActivated: machine.schedule_enabled === 1,
    },
    isWifi: isMachineActive,
    isDisabled: !isMachineActive || machine.op_mode === 'FAULT',
    isFanDisabled: !isMachineActive,
    machineMode: machine.op_mode,
    thermocouple: machine.tc_mode === 1,
    currentRun: machine.current_run,
    isFaults:
      isMachineActive &&
      (machine?.bms_fault === 1 ||
        machine?.hplp_fault === 1 ||
        machine?.timeout_fault === 1 ||
        machine?.thermocouple_fault === 1),
    bmsFault: (isMachineActive && machine.bms_fault) || 0,
    hplpFault: (isMachineActive && machine.hplp_fault) || 0,
    timeoutFault: (isMachineActive && machine.timeout_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.thermocouple_fault) || 0,
    isTESActive: machine.TES_enabled,
    switch_panels: machine.switch_panels,
    freezeBy: machine.freeze_by,
    ...(!isMachineActive && {
      heatingSchedule: {
        ...machine.heatingSchedule,
        isReady: false,
        isActivated: false,
      },
      heaterGraphData: [],
      enclosureGraphData: [],
      outsideGraphData: [],
      gasGraphData: [],
      snowGraphData: [],
      windGraphData: [],
    }),
  };
};

export default tgsSwitchSlice;
export const selectTgsSwitch = (state) => state.tgsSwitch;
export const selectFlatTgsSwitch = (state) => {
  return state.tgsSwitch;
};
export const {
  tgsHandleSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,

  tgsHandleInstantHeat,
  tgsHandleInstantHeatIsReady,
  tgsHandleInstantHeatOff,
  tgsHandleInstantHeatReset,

  tgsHandleSnowSensor,
  tgsHandleSnowSensorOff,
  tgsHandleSnowSensorReset,

  tgsHandleWindFactor,
  tgsHandleWindFactorOff,
  tgsHandleWindFactorReset,

  // tgsHandleOptionalConstantTemp,
  // tgsHandleOptionalConstantTempOff,

  tgsHandleAts,
  tgsHandleShutOff,
  // deactivate
  tgsResetMachinesState,

  tgsHandleFanOnly,

  tgsHandleAddHeatingSchedule,
  tgsHandleReadyHeatingSchedule,
  tgsHandleClearHeatingSchedule,
  tgsHandleHeatingScheduleReset,

  tgsHandleOpenMachineController,
  tgsHandleExpandSSRDetail,
  tgsHandleAtsSelection,

  // for mobile
  tgsHandleUnselectAllProgram,
  tgsHandleSelectProgram,

  // need to delete
  tgsHandleHeatingSchedule,

  handleTgsSwitch,
  handleTgsSwitchSocket,
  tgsActivateConflictMessage,
  tgsDeactivateConflictMessage,
  tgsSetDevicesConflicts,
  handleTgsGraph,
  handleTgsGraphDate,
} = tgsSwitchSlice.actions;
