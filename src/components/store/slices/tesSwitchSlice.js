import { createSlice } from "@reduxjs/toolkit";
import { isNumber, reduce } from "lodash";
import { convertCelsiusToFahrenheit } from "../../../helpers/helpers";

const ssrInitialState = {
  select: "tc-01",
  buttonStatus: "on",
  switchName: null,
  description: [null, null, null],
  index: 1,
  isSettingOpen: false,
  openPasswordBox: false,
};

const initialState = {
  machineType: "ess",
  deviceMac: null,
  deviceStatus: null,
  isTesSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,

  devicesConflicts: {
    systemTarget: "",
    currentSwitch: "",
    DesiredSwitch: "",
    commandTarget: "",
    extraData: null,
  },

  isOff: false,
  freezeBy: null,
  isTGSActive: false,
  // ssr detail
  isExpanded: false,

  // master control individual machine
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

  heatingSystem: "#10 Switch Turnout",

  // telemetry
  heatingSystemAbbr: "",
  usageHours: 50,
  energyConsump: 700,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },
  //

  windFactor: { isReady: false, isActivated: false },
  // ats: { isActivated: false },

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
    ssr1: {
      ...ssrInitialState,
      specs: [],
    },
    ssr2: {
      ...ssrInitialState,
      currentCurrent: 0,
      specs: [],

      buttonStatus: "flt",
    },
    ssr3: {
      ...ssrInitialState,
      specs: [],
    },
    ssr4: {
      ...ssrInitialState,
      specs: [],
      currentCurrent: [10.65],
    },
    ssr5: {
      ...ssrInitialState,
      specs: [],
    },
    ssr6: {
      ...ssrInitialState,
      specs: [],
    },
    ssr7: {
      ...ssrInitialState,
      specs: [],
      buttonStatus: "off",
    },
    ssr8: {
      ...ssrInitialState,
      specs: [
        // {
        //   elementName: 'RS-CRIB RAIL HEATER',
        //   partNumber: 'TRSC-8L-2S-A48-P1',
        //   current: 3.4,
        //   wattage: 1600,
        //   voltage: 480,
        //   lengths: 8,
        //   currentCurrent: 3,
        // },
      ],
    },
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
    intervalUnit: "",
  },
};

const tesSwitchSlice = createSlice({
  name: "tesSwitch",
  initialState: {
    "bet-north": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
    },
    "bet-south": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
    },
    "n.coast": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
    },
    tesSwitch: {},
    flatTesSwitch: {},
  },
  reducers: {
    tesHandleSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].isSelected = true;
      } else {
        state.flatTesSwitch[location][machine].isSelected = true;
      }
    },
    tesSpecificLocationSelectMachinesHandler: (state, action) => {
      // // !!TEST
      // state.tesSwitch[action.payload.location][
      //   action.payload.machine
      // ].isSelected = true;
      // // !!END
      state.flatTesSwitch[action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    tesHandleUnSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].isSelected = false;
      } else {
        state.flatTesSwitch[location][machine].isSelected = false;
      }
    },
    tesSpecificLocationUnselectMachinesHandler: (state, action) => {
      // //  !!TEST
      // state.tesSwitch[action.payload.location][action.payload.specificLocation][
      //   action.payload.machine
      // ].isSelected = false;
      // // !!END
      state.flatTesSwitch[action.payload.location][
        action.payload.specificLocation
      ][action.payload.machine].isSelected = false;
    },
    tesHandleInstantHeat: (state, action) => {
      // temperature and unit
      state.flatTesSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.inputTemp = action.payload.temp;

      state.flatTesSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isF = action.payload.isF;

      // turn on active button
      // state.tesSwitch[action.payload.location][
      //   action.payload.machine
      // ].instantHeat.isActivated = true;

      // turn on active button
      state.flatTesSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isReady = true;
    },
    tesHandleInstantHeatIsReady: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      if (specificLocation) {
        // temperature and unit
        state.flatTesSwitch[location][specificLocation][
          machine
        ].instantHeat.inputTemp = temp;

        state.flatTesSwitch[location][specificLocation][
          machine
        ].instantHeat.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].instantHeat.isReady = true;
      } else {
        // temperature and unit
        state.flatTesSwitch[location][machine].instantHeat.inputTemp = temp;

        state.flatTesSwitch[location][machine].instantHeat.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][machine].instantHeat.isReady = true;
      }
    },
    tesHandleInstantHeatOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].instantHeat.isActivated = false;

        state.flatTesSwitch[location][specificLocation][
          machine
        ].instantHeat.isReady = false;
      } else {
        state.flatTesSwitch[location][machine].instantHeat.isActivated = false;
        // state.tesSwitch[location][
        //   machine
        // ].instantHeat.inputTemp = 0;
        state.flatTesSwitch[location][machine].instantHeat.isReady = false;
      }
    },
    tesHandleInstantHeatReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].instantHeat = {
          ...initialState.instantHeat,
        };
      } else {
        state.flatTesSwitch[location][machine].instantHeat = {
          ...initialState.instantHeat,
        };
      }
    },
    tesHandleSnowSensor: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // turn on ready button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].snowSensor.isReady = true;
      } else {
        // turn on ready button
        state.flatTesSwitch[location][machine].snowSensor.isReady = true;
      }
    },
    tesHandleSnowSensorOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].snowSensor.isReady = false;
      } else {
        state.flatTesSwitch[location][machine].snowSensor.isReady = false;
      }
    },
    tesHandleSnowSensorReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].snowSensor = {
          ...initialState.snowSensor,
        };
      } else {
        state.flatTesSwitch[location][machine].snowSensor = {
          ...initialState.snowSensor,
        };
      }
    },
    tesHandleOptionalConstantTemp: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;

      if (specificLocation) {
        // temperature and unit
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.inputTemp = temp;

        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.isActivated = true;
      } else {
        // temperature and unit
        state.flatTesSwitch[location][machine].optionalConstantTemp.inputTemp =
          temp;

        state.flatTesSwitch[location][machine].optionalConstantTemp.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][
          machine
        ].optionalConstantTemp.isActivated = true;
      }
    },
    tesHandleOptionalConstantTempIsReady: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      if (specificLocation) {
        // temperature and unit
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.inputTemp = temp;

        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.isReady = true;
      } else {
        // temperature and unit
        state.flatTesSwitch[location][machine].optionalConstantTemp.inputTemp =
          temp;

        state.flatTesSwitch[location][machine].optionalConstantTemp.isF = isF;

        // turn on active button
        state.flatTesSwitch[location][
          machine
        ].optionalConstantTemp.isReady = true;
      }
    },

    tesHandleOptionalConstantTempOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // turn on active button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.isActivated = false;

        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp.inputTemp = 0;
      } else {
        // turn on active button
        state.flatTesSwitch[location][
          machine
        ].optionalConstantTemp.isActivated = false;

        state.flatTesSwitch[location][
          machine
        ].optionalConstantTemp.inputTemp = 0;
      }
    },
    tesHandleOptionalConstantTempReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].optionalConstantTemp = {
          ...initialState.optionalConstantTemp,
        };
      } else {
        state.flatTesSwitch[location][machine].optionalConstantTemp = {
          ...initialState.optionalConstantTemp,
        };
      }
    },
    tesHandleWindFactor: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // turn on ready button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].windFactor.isReady = true;
      } else {
        // turn on ready button
        state.flatTesSwitch[location][machine].windFactor.isReady = true;
      }
    },
    tesHandleWindFactorOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        // turn on ready button
        state.flatTesSwitch[location][specificLocation][
          machine
        ].windFactor.isReady = false;
      } else {
        // turn on ready button
        state.flatTesSwitch[location][machine].windFactor.isReady = false;
      }
    },
    tesHandleWindFactorReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].windFactor = {
          ...initialState.windFactor,
        };
      } else {
        state.flatTesSwitch[location][machine].windFactor = {
          ...initialState.windFactor,
        };
      }
    },
    tesHandleAddHeatingSchedule: (state, action) => {
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
      const dispatchData = {
        start: start,
        end: end,
        inputTemp: inputTemp,
        isF: isF,
        id: id,
      };
      const resetData = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
        id: null,
      };
      if (specificLocation) {
        // add a schedule (start, end, index, temp, isF)
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingScheduleList[index] = dispatchData;

        // ready to make next schedule
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingScheduleList[index + 1] = resetData;
      } else {
        // add a schedule (start, end, index, temp, isF)
        state.flatTesSwitch[location][machine].heatingScheduleList[index] =
          dispatchData;

        // ready to make next schedule
        state.flatTesSwitch[location][machine].heatingScheduleList[index + 1] =
          resetData;
      }
    },
    tesHandleReadyHeatingSchedule: (state, action) => {
      const {
        location,
        specificLocation,
        machine,
        state: data,
      } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingSchedule.isReady = data;
      } else {
        state.flatTesSwitch[location][machine].heatingSchedule.isReady = data;
      }
    },

    tesHandleClearHeatingSchedule: (state, action) => {
      const { location, specificLocation, machine, data } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingScheduleList = data;
      } else {
        state.flatTesSwitch[location][machine].heatingScheduleList = data;
      }
    },
    tesHandleHeatingScheduleReset: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingScheduleList = {
          ...initialState.heatingScheduleList,
        };
        state.flatTesSwitch[location][specificLocation][
          machine
        ].heatingSchedule = {
          ...initialState.heatingSchedule,
        };
      } else {
        state.flatTesSwitch[location][machine].heatingScheduleList = {
          ...initialState.heatingScheduleList,
        };
        state.flatTesSwitch[location][machine].heatingSchedule = {
          ...initialState.heatingSchedule,
        };
      }
    },
    // tesHandleAts: (state, action) => {
    //   state.tesSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },
    // tesHandleAtsOff: (state, action) => {
    //   state.tesSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },

    tesHandleShutOff: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        if (state.flatTesSwitch[location][specificLocation][machine].isOff) {
          state.flatTesSwitch[location][specificLocation][
            machine
          ].isOff = false;
        } else {
          state.flatTesSwitch[location][specificLocation][machine].isOff = true;
        }
      } else {
        if (state.flatTesSwitch[location][machine].isOff) {
          state.flatTesSwitch[location][machine].isOff = false;
        } else {
          state.flatTesSwitch[location][machine].isOff = true;
        }
      }
    },
    tesResetMachinesState: (state, action) => {
      const { location, specificLocation, machine, isF, tesZones } =
        action.payload;

      const address = {};
      let machineName = "";
      let selectedMachineInfo = {};
      let locationName = "";
      let specificLocationName = "";
      if (specificLocation) {
        tesZones[location].forEach((tesSpecificZone) => {
          if (tesSpecificZone.specific_address === specificLocation) {
            locationName = tesSpecificZone.zone_name;
            specificLocationName = tesSpecificZone.specific_address;
            address.lat = tesSpecificZone.latitude;
            address.lng = tesSpecificZone.longitude;

            tesSpecificZone.devices.forEach((machineInfo) => {
              if (machine === machineInfo.device_mac) {
                selectedMachineInfo = { machineInfo };
                machineName = machineInfo.device_name;
              }
            });
          }
        });
        state.flatTesSwitch[location][specificLocation][machine] = {
          ...initialState,

          address,
          machineName,
          locationId: [location][0],
          locationName,
          specificLocationId: [specificLocation][0],
          specificLocationName,
          ...extractDataFromMachine(selectedMachineInfo.machineInfo, isF),
        };
      } else {
        tesZones.forEach((tesZone) => {
          if (tesZone.zone_id === location) {
            locationName = tesZone.zone_name;
            address.lat = tesZone.latitude;
            address.lng = tesZone.longitude;

            tesZone.devices.forEach((machineInfo) => {
              if (machine === machineInfo.device_mac) {
                selectedMachineInfo = { machineInfo };
                machineName = machineInfo.device_name;
              }
            });
          }
        });
        state.flatTesSwitch[location][machine] = {
          ...initialState,
          ...state.flatTesSwitch[location][machine],
          // address,
          // machineName,
          // locationId: [location][0],
          // locationName,
          // ...extractDataFromMachine(selectedMachineInfo.machineInfo, isF),
        };
      }
    },
    tesHandleSelector: (state, action) => {
      const { location, specificLocation, machine, id, data } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].ssrState[
          id
        ].select = data;
      } else {
        state.flatTesSwitch[location][machine].ssrState[id].select = data;
      }
    },
    tesHandleToggleSSR: (state, action) => {
      const { location, specificLocation, machine, id, buttonStatus } =
        action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].ssrState[
          id
        ].buttonStatus = buttonStatus;
      } else {
        state.flatTesSwitch[location][machine].ssrState[id].buttonStatus =
          buttonStatus;
      }
    },
    tesHandleExpandSSRDetail: (state, action) => {
      const { location, specificLocation, machine, status } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].isExpanded =
          status;
      } else {
        state.flatTesSwitch[location][machine].isExpanded = status;
      }
    },
    tesHandleChangeSSRDetail: (state, action) => {
      const { location, specificLocation, machine, id, data } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].ssrState[
          id
        ].specs = data;
      } else {
        state.flatTesSwitch[location][machine].ssrState[id].specs = data;
      }
    },

    // tesHandleChangeSwitchName: (state, action) => {
    //   state.tesSwitch[action.payload.location][action.payload.machine].ssrState[
    //     action.payload.id
    //   ].switchName = action.payload.name;
    // },

    // open master control individual machine
    tesHandleOpenMachineController: (state, action) => {
      const { location, specificLocation, machine, status } = action.payload;
      if (specificLocation) {
        // // !!TEST
        // state.tesSwitch[location][machine].openMachineController = status;
        // // !!END
        state.flatTesSwitch[location][specificLocation][
          machine
        ].openMachineController = status;
      } else {
        state.flatTesSwitch[location][machine].openMachineController = status;
      }
    },
    tesHandleOpenSetting: (state, action) => {
      const { location, specificLocation, machine, id, status } =
        action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].ssrState[
          id
        ].isSettingOpen = status;
      } else {
        state.flatTesSwitch[location][machine].ssrState[id].isSettingOpen =
          status;
      }
    },

    tesHandleOpenPasswordBox: (state, action) => {
      const { location, specificLocation, machine, id, status } =
        action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].ssrState[
          id
        ].openPasswordBox = status;
      } else {
        state.flatTesSwitch[location][machine].ssrState[id].openPasswordBox =
          status;
      }
    },
    tesHandleAtsSelection: (state, action) => {
      const { location, specificLocation, machine, selection } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].atsSelection =
          selection;
      } else {
        state.flatTesSwitch[location][machine].atsSelection = selection;
      }
    },

    // for mobile
    tesHandleUnselectAllProgram: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const resetProgram = {
        instantHeat: false,
        snowSensor: false,
        windFactor: false,
        optionalConstantTemp: false,
        ats: false,
        shutOff: false,
        heatingSchedule: false,
      };
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].mobileSelectedProgram = resetProgram;
      } else {
        state.flatTesSwitch[location][machine].mobileSelectedProgram =
          resetProgram;
      }
    },
    tesHandleSelectProgram: (state, action) => {
      const { location, specificLocation, machine, program } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].mobileSelectedProgram[program] =
          !state.flatTesSwitch[location][specificLocation][machine]
            .mobileSelectedProgram[program];
      } else {
        state.flatTesSwitch[location][machine].mobileSelectedProgram[program] =
          !state.flatTesSwitch[location][machine].mobileSelectedProgram[
            program
          ];
      }
    },
    handleTesSwitch: (state, action) => {
      delete state["bet-north"];
      delete state["bet-south"];
      delete state["n.coast"];
      const isF = action.payload.isF;

      const zones = action.payload.tesZones;

      state.tesSwitch = reduce(
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
                              specificLocationName:
                                specificLocation.specific_address || "",
                              isOff: machine.freeze,
                              ...extractDataFromMachine(machine, isF),
                            },
                          };
                        },
                        {}
                      ),
                    };
                    return result;
                  },
                  {}
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
      state.flatTesSwitch = reduce(
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
                        machineType: "tes",
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
    handleTesSwitchSocket: (state, action) => {
      const data = action.payload.data;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac;
      const isF = action.payload.isF;
      state.flatTesSwitch[location][machine] = {
        ...state.flatTesSwitch[location][machine],
        ...extractDataFromMachine(data, isF),
      };
    },
    handleTesSSRState: (state, action) => {
      const { location, machine, data } = action.payload;
      state.flatTesSwitch[location][machine] = {
        ...state.flatTesSwitch[location][machine],
        ssrState: Object.fromEntries(
          Object.entries(
            reduce(
              data,
              (result, ssr) => {
                return {
                  ...result,
                  [`ssr${ssr.No + 1}`]: {
                    ...state.flatTesSwitch[location][machine].ssrState[
                      `ssr${ssr.No + 1}`
                    ],
                    ...ssr,
                  },
                };
              },
              {}
            )
          ).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        ),
      };
    },
    handleTesSSRStateSocket: (state, action) => {
      const data = action.payload;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac;

      if (data.hasOwnProperty("specs")) {
        state.flatTesSwitch[location][machine].ssrState[`ssr${data.No + 1}`] = {
          ...state.flatTesSwitch[location][machine].ssrState[
            `ssr${data.No + 1}`
          ],
          ...data,
          select: `tc-${
            state.flatTesSwitch[location][machine].heaterThermocoupleMap[
              data.No
            ]
          }`,
          buttonStatus:
            data?.fault === true || data?.Load_exceeded === true
              ? "flt"
              : data?.active === true
              ? "on"
              : "off",
          switchName: `${data.name} ${data.size}`,
        };
        state.flatTesSwitch[location][machine].ssrFault[data.No] = data.fault
          ? 1
          : 0;
      } else {
        data.heater_thermocouple_map.forEach((el, index) => {
          state.flatTesSwitch[location][machine].ssrState[`ssr${index + 1}`] = {
            ...state.flatTesSwitch[location][machine].ssrState[
              `ssr${index + 1}`
            ],
            select: `tc-${el}`,
          };
        });
      }
    },
    tesActivateConflictMessage: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].displayConflictMessage = true;
      } else {
        state.flatTesSwitch[location][machine].displayConflictMessage = true;
      }
    },
    tesDeactivateConflictMessage: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][
          machine
        ].displayConflictMessage = false;
      } else {
        state.flatTesSwitch[location][machine].displayConflictMessage = false;
      }
    },
    tesSetDevicesConflicts: (state, action) => {
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
        state.flatTesSwitch[location][specificLocation][
          machine
        ].devicesConflicts = dispatchData;
      } else {
        state.flatTesSwitch[location][machine].devicesConflicts = dispatchData;
      }
    },
    handleTesGraph: (state, action) => {
      const { location, specificLocation, machine, graphType, data } =
        action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine] = {
          ...state.flatTesSwitch[location][specificLocation][machine],
          [graphType]: data,
        };
      } else {
        state.flatTesSwitch[location][machine] = {
          ...state.flatTesSwitch[location][machine],
          [graphType]: data,
        };
      }
    },
    handleTesGraphDate: (state, action) => {
      const { location, specificLocation, machine, graphType, data, unit } =
        action.payload;
      if (specificLocation) {
        state.flatTesSwitch[location][specificLocation][machine].graphDateData =
          {
            ...state.flatTesSwitch[location][specificLocation][machine]
              .graphDateData,
            [graphType]: data,
          };

        if (graphType !== "dataConsumptionGraphData") {
          state.flatTesSwitch[location][specificLocation][
            machine
          ].graphDateData.intervalUnit = unit;
        }
      } else {
        state.flatTesSwitch[location][machine].graphDateData = {
          ...state.flatTesSwitch[location][machine].graphDateData,
          [graphType]: data,
        };

        if (graphType !== "dataConsumptionGraphData") {
          state.flatTesSwitch[location][machine].graphDateData.intervalUnit =
            unit;
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
       isNumber(machine.e_hours_of_usage)
        ? Math.floor(machine.e_hours_of_usage / 3600)
        : null,
    reading:
      isNumber(machine.e_energy_reading)
        ? Math.floor(machine.e_energy_reading)
        : null,
    hoursOfUsage:
      isNumber(machine.e_hours_of_usage)
        ? Math.floor(machine.e_hours_of_usage / 3600)
        : null,
    enclosureTemp:
      isMachineActive && isNumber(machine.e_enclosure_temp)
        ? Math.floor(machine.e_enclosure_temp)
        : null,
    outSideTemp:
      isMachineActive && isNumber(machine.e_outside_temp)
        ? Math.floor(machine.e_outside_temp)
        : null,
    consumption:
      isMachineActive && isNumber(machine.e_energy_consumption)
        ? Math.round(machine.e_energy_consumption * 10) / 10
        : null,
    setTemp:
      isMachineActive && isNumber(machine.e_threshold_temp)
        ? Math.floor(machine.e_threshold_temp)
        : null,
    currentTemp:
      isMachineActive && isNumber(machine.e_display_temp)
        ? Math.floor(machine.e_display_temp)
        : null,
    isEbp: (machine.EBP === 1 || machine.EBP=== true) && isMachineActive,
    isGp: (machine.EBP === 0 || machine.EBP === false) && isMachineActive,
    EBP_mode:machine.EBP_mode ,
    instantHeat: {
      ...initialState.instantHeat,
      inputTemp: isNumber(machine.e_instant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.e_instant_temp)
          : Math.floor(machine.e_instant_temp)
        : null,
      isReady: isMachineActive && machine.e_on_switch === 1,
      isActivated:
        isMachineActive &&
        machine.e_on_switch === 1 &&
        machine.e_op_mode === "SWITCH",
    },
    optionalConstantTemp: {
      ...initialState.optionalConstantTemp,
      inputTemp: isNumber(machine.e_constant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.e_constant_temp)
          : Math.floor(machine.e_constant_temp)
        : null,
      isReady: isMachineActive && machine.e_on_constant === 1,
      isActivated:
        isMachineActive &&
        machine.e_on_constant === 1 &&
        machine.e_op_mode === "CONSTANT",
    },
    snowSensor: {
      ...initialState.snowSensor,
      defaultTemp: isNumber(machine.electrical_snow_threshold)
        ? Math.floor(machine.electrical_snow_threshold)
        : null,
      isReady: isMachineActive && machine.e_snow_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.e_snow_enabled === 1 &&
        machine.e_snow_trigger === 1,
    },
    windFactor: {
      ...initialState.windFactor,
      isReady: isMachineActive && machine.e_wind_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.e_wind_enabled === 1 &&
        machine.e_wind_trigger === 1,
    },
    heatingSchedule: {
      ...machine.heatingSchedule,
      isActivated: machine.e_schedule_enabled === 1,
    },
    isWifi: isMachineActive,
    isDisabled: !isMachineActive || machine.e_op_mode === "FAULT",
    machineMode: machine.e_op_mode,
    thermocouple: machine.tc_mode === 1,
    heaterThermocoupleMap: machine.heater_thermocouple_map,
    activeThermocouples: machine.active_thermocouples,
    activatedHeaters: machine.activated_heaters,
    currentRun: machine.current_run,
    isFaults:
      isMachineActive &&
      ((Array.isArray(machine?.e_ssr_fault) &&
        machine?.e_ssr_fault?.includes(1)) ||
        (Array.isArray(machine?.e_srr_over_current) &&
          machine.e_srr_over_current?.includes(1)) ||
        machine?.e_ground_fault === 1 ||
        (Array.isArray(machine?.e_thermocouple_fault) &&
          machine?.e_thermocouple_fault?.includes(1))),
    ssrFault: (isMachineActive && machine.e_ssr_fault) || [],
    srrOverCurrent: (isMachineActive && machine.e_srr_over_current) || [],
    groundFault: (isMachineActive && machine.e_ground_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.e_thermocouple_fault) || [],
    isTGSActive: machine.TGS_enabled,
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

export default tesSwitchSlice;
export const selectTesSwitch = (state) => state.tesSwitch;
export const {
  tesHandleSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,

  tesHandleInstantHeat,
  tesHandleInstantHeatOff,
  tesHandleInstantHeatReset,
  tesHandleInstantHeatIsReady,

  tesHandleSnowSensor,
  tesHandleSnowSensorOff,
  tesHandleSnowSensorReset,

  tesHandleWindFactor,
  tesHandleWindFactorOff,
  tesHandleWindFactorReset,

  tesHandleOptionalConstantTemp,
  tesHandleOptionalConstantTempIsReady,
  tesHandleOptionalConstantTempOff,
  tesHandleOptionalConstantTempReset,

  tesHandleAts,
  tesHandleShutOff,
  // deactivate
  tesResetMachinesState,

  tesHandleAddHeatingSchedule,
  tesHandleReadyHeatingSchedule,
  tesHandleClearHeatingSchedule,
  tesHandleHeatingScheduleReset,

  tesHandleSelector,
  tesHandleToggleSSR,
  tesHandleExpandSSRDetail,
  tesHandleChangeSSRDetail,
  tesHandleOpenSetting,
  tesHandleOpenPasswordBox,
  // tesHandleChangeSwitchName,

  tesHandleOpenMachineController,
  tesHandleAtsSelection,

  // for mobile
  tesHandleSelectProgram,
  tesHandleUnselectAllProgram,

  // need to delete
  tesHandleHeatingSchedule,

  handleTesSwitch,
  handleTesSwitchSocket,
  handleTesSSRState,
  handleTesSSRStateSocket,
  tesActivateConflictMessage,
  tesDeactivateConflictMessage,
  tesSetDevicesConflicts,
  handleTesGraph,
  handleTesGraphDate,
} = tesSwitchSlice.actions;
