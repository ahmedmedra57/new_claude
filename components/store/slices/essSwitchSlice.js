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
  isEssSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,

  isOff: false,
  freezeBy: null,
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
  heaterThermocoupleMap: [],

  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,

  // MCDeactivate: {
  //   isFanOnly: false,
  //   heatingSchedule: false,
  //   instantHeat: false,
  //   optionalConstantTemp: false,
  //   snowSensor: false,
  //   windFactor: false,
  // },

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
  heatingSystemAbbr: "",
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
      specs: [],
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

const essSwitchSlice = createSlice({
  name: "essSwitch",
  initialState: {
    "bet-east": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "bet-west": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "s.coast": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "n-Mountain": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
    },
    essSwitch: {},
    flatEssSwitch: {},
  },
  reducers: {
    handleSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].isSelected = true;
    },
    essSpecificLocationSelectMachinesHandler: (state, action) => {
      // // !!TEST
      // state.essSwitch[action.payload.location][
      //   action.payload.machine
      // ].isSelected = true;
      // // !!END
      state.flatEssSwitch[action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    handleUnSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].isSelected = false;
    },
    essSpecificLocationUnselectMachinesHandler: (state, action) => {
      // // !!TEST
      // state.essSwitch[action.payload.location][
      //   action.payload.machine
      // ].isSelected = false;
      // // !!END
      state.flatEssSwitch[action.payload.specificLocation][
        action.payload.machine
      ].isSelected = false;
    },
    // handleMCDeactivate: (state, action) => {
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].MCDeactivate[action.payload.control] = true;
    // },
    // handleInstantHeat: (state, action) => {
    //   // temperature and unit
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].instantHeat.inputTemp = action.payload.temp;

    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].instantHeat.isF = action.payload.isF;

    //   // turn on active button
    //   // state.essSwitch[action.payload.location][
    //   //   action.payload.machine
    //   // ].instantHeat.isActivated = true;
    //   // turn on ready button
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].instantHeat.isReady = true;
    // },
    handleInstantHeatReady: (state, action) => {
      const { location, machine, isF, temp } = action.payload;
      // temperature and unit
      state.flatEssSwitch[location][machine].instantHeat.inputTemp = temp;
      state.flatEssSwitch[location][machine].instantHeat.isF = isF;
      // turn on ready button
      state.flatEssSwitch[location][machine].instantHeat.isReady = true;
    },
    handleInstantHeatOff: (state, action) => {
      state.flatEssSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isActivated = false;

      state.flatEssSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat.isReady = false;
      // state.essSwitch[action.payload.location][
      //   action.payload.machine
      // ].instantHeat.inputTemp = 0;
    },
    handleInstantHeatReset: (state, action) => {
      state.flatEssSwitch[action.payload.location][
        action.payload.machine
      ].instantHeat = { ...initialState.instantHeat };
    },
    handleSnowSensor: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].snowSensor.isReady = true;

      // turn on ready button
    },
    handleSnowSensorOff: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].snowSensor.isReady = false;
    },
    // handleSnowSensorIsActivatedOff: (state, action) => {
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].snowSensor.isActivated = false;
    // },
    handleSnowSensorReset: (state, action) => {
      const { location, machine } = action.payload;

      state.flatEssSwitch[location][machine].snowSensor = {
        ...initialState.snowSensor,
      };
    },

    // handleOptionalConstantTemp: (state, action) => {
    //   // temperature and unit
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.inputTemp = action.payload.temp;

    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isF = action.payload.isF;

    //   // turn on active button
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isActivated = true;
    // },
    handleOptionalConstantTempReady: (state, action) => {
      const { location, machine, temp, isF } = action.payload;
      // temperature and unit
      state.flatEssSwitch[location][machine].optionalConstantTemp.inputTemp =
        temp;

      state.flatEssSwitch[location][machine].optionalConstantTemp.isF = isF;

      // turn on active button
      state.flatEssSwitch[location][
        machine
      ].optionalConstantTemp.isReady = true;
    },

    // handleOptionalConstantTempOff: (state, action) => {
    //   console.log('stop optional constant temp');
    //   // turn on active button
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isActivated = false;

    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.inputTemp = 0;
    // },
    handleMachineOptionalConstantTempOff: (state, action) => {
      const { location, machine } = action.payload;
      // turn on active button
      state.flatEssSwitch[location][
        machine
      ].optionalConstantTemp.isActivated = false;
      state.flatEssSwitch[location][
        machine
      ].optionalConstantTemp.isReady = false;
    },
    // handleOptionalConstantTempReadyOff: (state, action) => {
    //   // set isReady off
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].optionalConstantTemp.isReady = false;
    // },
    handleOptionalConstantTempReset: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].optionalConstantTemp = {
        ...initialState.optionalConstantTemp,
      };
    },
    handleWindFactor: (state, action) => {
      // turn on ready button
      state.flatEssSwitch[action.payload.location][
        action.payload.machine
      ].windFactor.isReady = true;
    },
    handleWindFactorOff: (state, action) => {
      const { location, machine } = action.payload;
      // turn on ready button
      state.flatEssSwitch[location][machine].windFactor.isReady = false;
    },
    // handleWindFactorIsActivatedOff: (state, action) => {
    //   // turn on ready button
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].windFactor.isReady = false;
    // },
    handleWindFactorReset: (state, action) => {
      state.flatEssSwitch[action.payload.location][
        action.payload.machine
      ].windFactor = { ...initialState.windFactor };
    },
    handleAddHeatingSchedule: (state, action) => {
      const { location, machine, index, start, end, inputTemp, isF, id } =
        action.payload;
      // add a schedule (start, end, index, temp, isF)
      state.flatEssSwitch[location][machine].heatingScheduleList[index] = {
        start,
        end,
        inputTemp,
        isF,
        id,
      };
      // ready to make next schedule
      state.flatEssSwitch[location][machine].heatingScheduleList[index + 1] = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
        id: null,
      };
    },
    handleReadyHeatingSchedule: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].heatingSchedule.isReady =
        action.payload.state;
    },
    // handleActivateHeatingSchedule: (state, action) => {
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].heatingSchedule.isActivated = action.payload.state;
    // },

    handleClearHeatingSchedule: (state, action) => {
      const { location, machine, data } = action.payload;
      state.flatEssSwitch[location][machine].heatingScheduleList = data;
    },
    handleHeatingScheduleReset: (state, action) => {
      const { location, machine } = action.payload;
      state.flatEssSwitch[location][machine].heatingScheduleList = {
        ...initialState.heatingScheduleList,
      };
      state.flatEssSwitch[location][machine].heatingSchedule = {
        ...initialState.heatingSchedule,
      };
    },
    // handleAts: (state, action) => {
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },
    // handleAtsOff: (state, action) => {
    //   state.essSwitch[action.payload.location][
    //     action.payload.machine
    //   ].ats.isActivated = true;
    // },

    handleShutOff: (state, action) => {
      const { location, machine } = action.payload;
      if (state.flatEssSwitch[location][machine].isOff) {
        state.flatEssSwitch[location][machine].isOff = false;
      } else {
        state.flatEssSwitch[location][machine].isOff = true;
      }
    },
    essResetMachinesState: (state, action) => {
      const { location, machine, isF, essZones } = action.payload;
      state.flatEssSwitch[location][machine] = {
        ...initialState,
        ...state.flatEssSwitch[location][machine],
      };
    },

    handleSelector: (state, action) => {
      const { location, machine, id, data } = action.payload;
      state.flatEssSwitch[location][machine].ssrState[id].select = data;
    },
    handleToggleSSR: (state, action) => {
      const { location, machine, id, buttonStatus } = action.payload;
      state.flatEssSwitch[location][machine].ssrState[id].buttonStatus =
        buttonStatus;
    },
    handleExpandSSRDetail: (state, action) => {
      const { location, machine, status } = action.payload;
      state.flatEssSwitch[location][machine].isExpanded = status;
    },
    handleChangeSSRDetail: (state, action) => {
      const { location, machine, id, data } = action.payload;
      state.flatEssSwitch[location][machine].ssrState[id].specs = data;
    },
    // handleOpenSetting: (state, action) => {
    //   state.essSwitch[action.payload.location][action.payload.machine].ssrState[
    //     action.payload.id
    //   ].isSettingOpen =
    //     !state.essSwitch[action.payload.location][action.payload.machine]
    //       .ssrState[action.payload.id].isSettingOpen;
    // },
    // handleChangeSwitchName: (state, action) => {
    //   state.essSwitch[action.payload.location][action.payload.machine].ssrState[
    //     action.payload.id
    //   ].switchName = action.payload.name;
    // },

    // open master control individual machine
    handleOpenMachineController: (state, action) => {
      const { location, machine, status } = action.payload;
      state.flatEssSwitch[location][machine].openMachineController = status;
    },
    handleOpenSetting: (state, action) => {
      const { location, machine, id, status } = action.payload;
      state.flatEssSwitch[location][machine].ssrState[id].isSettingOpen =
        status;
    },

    handleOpenPasswordBox: (state, action) => {
      const { location, machine, id, status } = action.payload;
      state.flatEssSwitch[location][machine].ssrState[id].openPasswordBox =
        status;
    },

    handleAtsSelection: (state, action) => {
      const { location, machine, selection } = action.payload;
      state.flatEssSwitch[location][machine].atsSelection = selection;
    },

    // for mobile
    essHandleUnselectAllProgram: (state, action) => {
      const { location, machine } = action.payload;
      const programsInitialState = {
        instantHeat: false,
        snowSensor: false,
        windFactor: false,
        optionalConstantTemp: false,
        ats: false,
        shutOff: false,
        heatingSchedule: false,
      };
      state.flatEssSwitch[location][machine].mobileSelectedProgram =
        programsInitialState;
    },
    essHandleSelectProgram: (state, action) => {
      const { location, machine, program } = action.payload;
      state.flatEssSwitch[location][machine].mobileSelectedProgram[program] =
        !state.flatEssSwitch[location][machine].mobileSelectedProgram[program];
    },
    handleEssSwitch: (state, action) => {
      delete state["bet-east"];
      delete state["bet-west"];
      delete state["n-Mountain"];
      delete state["s.coast"];
      let isF = action.payload.isF;

      const zones = action.payload.essZones;

      state.essSwitch = reduce(
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
      state.flatEssSwitch = reduce(
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
                        deviceStatus: machine.device_status,
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
      // state.essSwitch = {
      //   ...state.essSwitch, ['SHOROUQ SH-C LOCATION SH-LOC']: {
      //     isSpecificLocation: true, subLocations: {
      //       ['a27e2a57-41e2-437a-a5ec-b1e0605e8e0a']: {},
      //       ['92417f25-a718-42ab-bb3b-c4205619b506']: {}
      //     }
      //   }
      // }
    },
    handleEssSwitchSocket: (state, action) => {
      const data = action.payload.data;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac;
      const isF = action.payload.isF;
      if (!state.flatEssSwitch[location]) {
    state.flatEssSwitch[location] = {}; 
  }

  if (!state.flatEssSwitch[location][machine]) {
    state.flatEssSwitch[location][machine] = {}; 
  }

      state.flatEssSwitch[location][machine] = {
        ...state.flatEssSwitch[location][machine],
        ...extractDataFromMachine(data, isF),
      };
    },
    handleEssSSRState: (state, action) => {
      const { location, machine, data } = action.payload;
      state.flatEssSwitch[location][machine] = {
        ...state.flatEssSwitch[location][machine],
        ssrState: Object.fromEntries(
          Object.entries(
            reduce(
              data,
              (result, ssr) => {
                return {
                  ...result,
                  [`ssr${ssr.No + 1}`]: {
                    ...state.flatEssSwitch[location][machine].ssrState[
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
    handleEssSSRStateSocket: (state, action) => {
      const data = action.payload;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac || data.device_id;
      if (data.hasOwnProperty("specs")) {
        state.flatEssSwitch[location][machine].ssrState[`ssr${data.No + 1}`] = {
          ...state.flatEssSwitch[location][machine].ssrState[
            `ssr${data.No + 1}`
          ],
          ...data,
          select: `tc-${
            state.flatEssSwitch[location][machine].heaterThermocoupleMap[
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
        state.flatEssSwitch[location][machine].ssrFault[data.No] = data.fault
          ? 1
          : 0;
      } 
      else {
        if (!state.flatEssSwitch[location]) {
            state.flatEssSwitch[location] = {};
          }

          if (!state.flatEssSwitch[location][machine]) {
            state.flatEssSwitch[location][machine] = {};
          }

          if (!state.flatEssSwitch[location][machine].ssrState) {
            state.flatEssSwitch[location][machine].ssrState = {};
          }

        data.heater_thermocouple_map.forEach((el, index) => {
          state.flatEssSwitch[location][machine].ssrState[`ssr${index + 1}`] = {
            ...state.flatEssSwitch[location][machine].ssrState[
              `ssr${index + 1}`
            ],
            select: `tc-${el}`,
          };
        });
      }
    },
    handleEssGraph: (state, action) => {
      const { location, machine, graphType, data } = action.payload;
      state.flatEssSwitch[location][machine] = {
        ...state.flatEssSwitch[location][machine],
        [graphType]: data,
      };
    },
    handleEssGraphDate: (state, action) => {
      const { location, machine, graphType, data, unit } = action.payload;
      state.flatEssSwitch[location][machine].graphDateData = {
        ...state.flatEssSwitch[location][machine].graphDateData,
        [graphType]: data,
      };

      if (graphType !== "dataConsumptionGraphData") {
        state.flatEssSwitch[location][machine].graphDateData.intervalUnit =
          unit;
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
     isNumber(machine.energy_reading)
        ? Math.floor(machine.energy_reading)
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
      isMachineActive && isNumber(machine.energy_consumption)
        ? Math.round(machine.energy_consumption * 10) / 10
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
    isGp: (machine.EBP=== 0 || machine.EBP === false) && isMachineActive,
    EBP_mode:machine.EBP_mode,
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
        machine.op_mode === "SWITCH",
    },
    optionalConstantTemp: {
      ...initialState.optionalConstantTemp,
      inputTemp: isNumber(machine.constant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.constant_temp)
          : Math.floor(machine.constant_temp)
        : null,
      isReady: isMachineActive && machine.on_constant === 1,
      isActivated:
        isMachineActive &&
        machine.on_constant === 1 &&
        machine.op_mode === "CONSTANT",
    },
    snowSensor: {
      ...initialState.snowSensor,
      defaultTemp: isNumber(machine.electrical_snow_threshold)
        ? Math.floor(machine.electrical_snow_threshold)
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
    isDisabled: !isMachineActive || machine.op_mode === "FAULT",
    machineMode: machine.op_mode,
    thermocouple: machine.tc_mode === 1,
    heaterThermocoupleMap: machine.heater_thermocouple_map,
    activeThermocouples: machine.active_thermocouples,
    activatedHeaters: machine.activated_heaters,
    currentRun: machine.current_run,
    isFaults:
      isMachineActive &&
      ((Array.isArray(machine?.ssr_fault) && machine?.ssr_fault?.includes(1)) ||
        (Array.isArray(machine?.srr_over_current) &&
          machine.srr_over_current?.includes(1)) ||
        machine?.ground_fault === 1 ||
        (Array.isArray(machine?.thermocouple_fault) &&
          machine?.thermocouple_fault?.includes(1))),
    ssrFault: (isMachineActive && machine.ssr_fault) || [],
    srrOverCurrent: (isMachineActive && machine.srr_over_current) || [],
    groundFault: (isMachineActive && machine.ground_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.thermocouple_fault) || [],
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

export default essSwitchSlice;

export const selectEssSwitch = (state) => state.essSwitch;
export const selectFlatEssSwitch = (state) => {
  return state.essSwitch;
};

export const {
  handleSelectIndividualMachine,
  essSpecificLocationSelectMachinesHandler,
  handleUnSelectIndividualMachine,
  essSpecificLocationUnselectMachinesHandler,

  // handleInstantHeat,
  handleInstantHeatOff,
  handleInstantHeatReady,
  handleInstantHeatReset,

  handleSnowSensorReset,
  handleSnowSensor,
  handleSnowSensorOff,
  handleSnowSensorIsActivatedOff,

  handleWindFactor,
  handleWindFactorOff,
  // handleWindFactorIsActivatedOff,
  handleWindFactorReset,

  // handleOptionalConstantTemp,
  handleOptionalConstantTempReady,
  // handleOptionalConstantTempOff,
  handleMachineOptionalConstantTempOff,
  // handleOptionalConstantTempReadyOff,
  handleOptionalConstantTempReset,

  // handleAts,
  handleShutOff,
  // deactivate
  essResetMachinesState,

  handleAddHeatingSchedule,
  handleReadyHeatingSchedule,
  // handleActivateHeatingSchedule,
  handleClearHeatingSchedule,
  handleHeatingScheduleReset,

  handleSelector,
  handleToggleSSR,
  handleExpandSSRDetail,
  handleChangeSSRDetail,
  handleOpenSetting,
  handleOpenPasswordBox,

  // handleChangeSwitchName,

  handleOpenMachineController,
  handleAtsSelection,

  // for mobile
  essHandleUnselectAllProgram,
  essHandleSelectProgram,

  // need to delete
  handleHeatingSchedule,

  handleEssSwitch,
  handleEssSwitchSocket,
  handleEssSSRState,
  handleEssSSRStateSocket,
  handleEssGraph,
  handleEssGraphDate,
} = essSwitchSlice.actions;
