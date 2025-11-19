import { createSlice } from '@reduxjs/toolkit';

const ssrInitialState = {
  thermoCouple: 'tc-02',
  isSelectSwitchListOpen: false,
};

const ssrState = {
  ssr1: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-CRIB RAIL HEATER',
        partNumber: 'TRSC-7L-2S-A48-P1',
        currentCurrent: 2.2,
        current: 2.95,
        wattage: 1400,
        voltage: 480,
        lengths: 7,
      },
    ],
  },
  ssr2: {
    ...ssrInitialState,

    specs: [
      {
        elementName: 'RS-CRIB RAIL HEATER',
        partNumber: 'TRSC-10L-2S-A48-P1',
        current: 4.2,
        wattage: 2000,
        voltage: 480,
        lengths: 10,
        currentCurrent: 4.1,
      },
    ],

    buttonStatus: 'flt',
  },
  ssr3: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-CRIB RAIL HEATER',
        partNumber: 'TRSC-11L-2S-A48-P1',
        current: 4.6,
        wattage: 2200,
        voltage: 480,
        lengths: 11,
        currentCurrent: 8,
      },
    ],
  },
  ssr4: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-Switch HEATER',
        partNumber: 'TRS-16L-2S-A48-P1',
        current: 6.7,
        wattage: 3200,
        voltage: 480,
        lengths: 16,
        currentCurrent: 6.1,
      },
    ],
  },
  ssr5: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-Switch HEATER',
        partNumber: 'TRS-20L-2S-A48-P1',
        current: 8.4,
        wattage: 4000,
        voltage: 480,
        lengths: 20,
        currentCurrent: 8,
      },
    ],
  },
  ssr6: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'FLEXIBLE RAIL HEATER',
        partNumber: 'T-FLEX-24L-2S-A48-P1',
        current: 10,
        wattage: 4800,
        voltage: 480,
        lengths: 24,
        currentCurrent: 9,
      },
    ],
  },
  ssr7: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-Switch HEATER',
        partNumber: 'TRS-16L-2S-A24-P1',
        current: 13.4,
        wattage: 3200,
        voltage: 240,
        lengths: 16,
        currentCurrent: 13,
      },
    ],
  },
  ssr8: {
    ...ssrInitialState,
    specs: [
      {
        elementName: 'RS-CRIB RAIL HEATER',
        partNumber: 'TRSC-8L-2S-A48-P1',
        current: 3.4,
        wattage: 1600,
        voltage: 480,
        lengths: 8,
        currentCurrent: 3,
      },
    ],
  },
};

const sysIdentificationState = {
  locations: [],
  heatingSysOptions: ['ess', 'tgs', 'tes', 'hp', 'ate'],
  switchSizeOptions: [],
  ssrRatingOptions: [],
  gasTypeOptions: ['ng', 'lp'],
};

const sysIdentificationSlice = createSlice({
  name: 'sysIdentification',
  initialState: sysIdentificationState,
  reducers: {
    handleCreateSysIdentification: (state, action) => {
      const { location, address, specificLocationInfo, specificLocationName } =
        action.payload;
      if (specificLocationName) {
        const locationEL = location;
        let filteredLocationIdx;
        state.locations.forEach(({ location }, idx) => {
          if (location === locationEL) {
            filteredLocationIdx = idx;
          }
        });
        if (filteredLocationIdx) {
          state.locations[filteredLocationIdx].specificLocation = {
            ...state.locations[filteredLocationIdx].specificLocation,
            [specificLocationName]: specificLocationInfo,
          };
          // state.locations[filteredLocationIdx].specificLocation[
          //   `${specificLocationName}`
          // ] = specificLocationInfo;
        } else {
          state.locations.push({
            address,
            location,
            specificLocation: { [specificLocationName]: specificLocationInfo },
          });
        }
      } else {
        state.locations.push({
          address,
          location,
          numOfUOS: specificLocationInfo.numOfUOS,
          numOfSSR: specificLocationInfo.numOfSSR,
          switchesNum: specificLocationInfo.switchesNum,
          switchInfo: specificLocationInfo.switchInfo,
          specificLocation: null,
        });
      }
    },

    handleEditSysIdentification: (state, action) => {
      // Edit all
      if (action.payload.isEditAll) {
        if (action.payload.specificLocationName) {
          state.locations.splice(
            action.payload.locationIdx,
            1,
            action.payload.modifiedLocation
          );
        } else {
          const {
            location,
            address,
            specificLocation: {
              info: { numOfUOS, numOfSSR, switchesNum, switchInfo },
            },
          } = action.payload.modifiedLocation;
          const locationState = {
            address,
            location,
            numOfSSR,
            numOfUOS,
            switchesNum,
            switchInfo,
          };

          state.locations.splice(action.payload.locationIdx, 1, locationState);
        }
      } else {
        const {
          location,
          specificLocation,
          address,
          numOfUOS,
          numOfSSR,
          switchesNum,
          switchInfo,
        } = action.payload.modifiedLocation;
        const { locationIdx } = action.payload;
        // Edit some
        // address
        state.locations[locationIdx].address = address;
        // location
        state.locations[locationIdx].location = location;
        if (specificLocation) {
          const specificLocationState =
            state.locations[locationIdx].specificLocation[specificLocation];
          // numOfUOS
          specificLocationState.numOfUOS = numOfUOS;
          // numOfSSR
          specificLocationState.numOfSSR = numOfSSR;
          // switchesNum
          specificLocationState.switchesNum = switchesNum;
          // switchInfo
          specificLocationState.switchInfo.forEach((eachSwitch, idx) => {
            switchInfo.forEach((savedSwitch) => {
              if (
                eachSwitch.deviceMac === savedSwitch.deviceMac &&
                eachSwitch.switchName === savedSwitch.switchName
              ) {
                specificLocationState.switchInfo.splice(idx, 1, savedSwitch);
              }
            });
          });
        } else {
          // // specific location
          // state.locations[locationIdx].specificLocation = {
          //   [specificLocation]: {
          //     numOfUOS,
          //     numOfSSR,
          //     switchesNum,
          //     switchInfo,
          //   },
          // };
          // numOfUOS
          state.locations[locationIdx].numOfUOS = numOfUOS;
          // numOfSSR
          state.locations[locationIdx].numOfSSR = numOfSSR;
          //switchesNum
          state.locations[locationIdx].switchesNum = switchesNum;
          // switchInfo
          state.locations[locationIdx].switchInfo.forEach((eachSwitch, idx) => {
            switchInfo.forEach((savedSwitch) => {
              if (
                eachSwitch.UOS === savedSwitch.UOS &&
                eachSwitch.switchName === savedSwitch.switchName
              ) {
                state.locations[locationIdx].switchInfo.splice(
                  idx,
                  1,
                  savedSwitch
                );
              }
            });
          });
        }
      }
    },

    handleRemoveSysIdentificationLocation: (state, action) => {
      state.locations.splice(action.payload.locationIdx, 1);
    },

    handleAddSwitchSizeSSRRating: (state, action) => {
      if (action.payload.keyOfOptions === 'switchSizeOptions') {
        state[action.payload.keyOfOptions].push(`#${action.payload.value}`);
      } else {
        state[action.payload.keyOfOptions].push(`${action.payload.value} amps`);
      }
    },
    handleSwitchSize: (state, action) => {
      state.switchSizeOptions = action.payload
        .map((size) => `#${size.value}`)
        .sort((a, b) => {
          return a.localeCompare(b, undefined, { numeric: true });
        });
    },
    handleSSRRating: (state, action) => {
      state.ssrRatingOptions = action.payload
        .map((rate) => `${rate.value} amps`)
        .sort((a, b) => {
          return a.localeCompare(b, undefined, { numeric: true });
        });
    },
    handleAddGasType: (state, action) => {
      state.gasTypeOptions.push(action.payload);
    },
    handleLocationsSystemIdentification: (state, action) => {
      const { data, heaterSpecs } = action.payload;
      state.locations = data.map((location) => {
        if (location.specific_location) {
          const specificLocationSortedData = location.specific_location.reduce(
            (acc, specificLocation, specificLocationIdx) => {
              return {
                ...acc,
                [specificLocation?.specific_address ??
                `specific location name${specificLocationIdx + 1}`]: {
                  numOfUOS: specificLocation.uos_panel_number || null,
                  numOfSSR: specificLocation.ssr_quantity || null,
                  switchesNum: specificLocation.switches_number || null,
                  switchInfo: specificLocation.uos_panels
                    ?.map((uosPanels, index) => {
                      return uosPanels.switch_panels?.map((switchPanels) => {
                        return {
                          UOS: index < 9 ? `0${index + 1}` : `${index + 1}`,
                          switchName: switchPanels.name,
                          heatingSys: switchPanels.system_heating
                            .map((el) => el.toLowerCase())
                            .join('/'),
                          gasType: switchPanels.gas_type,
                          selectedSSR: switchPanels.ssr_uts
                            .map((ssr) => {
                              return {
                                [`ssr${ssr + 1}`]:
                                  uosPanels.ssr
                                    ?.map((ssrInfo) => {
                                      if (ssrInfo.no === ssr) {
                                        return {
                                          ...ssrState.ssr1,
                                          thermoCouple: ssrInfo.tc
                                            ? ssrInfo.tc < 10
                                              ? `tc-0${ssrInfo.tc}`
                                              : `tc-${ssrInfo.tc}`
                                            : '---',
                                          specs: ssrInfo.heaters
                                            .map((heater) =>
                                              heaterSpecs.find(
                                                (spec) =>
                                                  spec.partNumber === heater
                                              )
                                            )
                                            .filter((spec) => spec),
                                        };
                                      } else {
                                        return null;
                                      }
                                    })
                                    .filter((el) => el)[0] || [],
                              };
                            })
                            .filter((el) => Object.values(el)[0]),
                          application: switchPanels.application,
                          switchSize: `#${
                            switchPanels.size || switchPanels.switch_size
                          }`,
                          ssrRating: `${switchPanels.ssr_rating} amps`,
                          sysId: switchPanels.system_id,
                          deviceName: uosPanels.device_name,
                          zoneId: uosPanels.zone_id,
                          deviceMac: uosPanels.device_mac,
                          type: uosPanels.type,
                          latitude: specificLocation.latitude,
                          longitude: specificLocation.longitude,
                          displaySelectBox: [false, false, false, false, false],
                        };
                      });
                    })
                    .flat()
                    .filter((switchInfo) => switchInfo),
                },
              };
            },
            {}
          );

          return {
            location: location.zone_name || '',
            address: location.zone_address || '',
            specificLocation: specificLocationSortedData,
          };
        }
        return {
          location: location.zone_name || null,
          specificLocation: location.specific_address || null,
          address: location.zone_address || null,
          numOfUOS: location.uos_panel_number || null,
          numOfSSR: location.ssr_quantity || null,
          switchesNum: location.switches_number || null,
          switchInfo: location.uos_panels
            ?.map((uosPanels, index) => {
              return uosPanels.switch_panels?.map((switchPanels) => {
                return {
                  UOS: index < 9 ? `0${index + 1}` : `${index + 1}`,
                  switchName: switchPanels.name,
                  heatingSys: switchPanels.system_heating
                    .map((el) => el.toLowerCase())
                    .join('/'),
                  gasType: switchPanels.gas_type,
                  selectedSSR: switchPanels.ssr_uts
                    .map((ssr) => {
                      return {
                        [`ssr${ssr + 1}`]:
                          uosPanels.ssr
                            ?.map((ssrInfo) => {
                              if (ssrInfo.no === ssr) {
                                return {
                                  ...ssrState.ssr1,
                                  thermoCouple: ssrInfo.tc
                                    ? ssrInfo.tc < 10
                                      ? `tc-0${ssrInfo.tc}`
                                      : `tc-${ssrInfo.tc}`
                                    : '---',
                                  specs: ssrInfo.heaters
                                    .map((heater) =>
                                      heaterSpecs.find(
                                        (spec) => spec.partNumber === heater
                                      )
                                    )
                                    .filter((spec) => spec),
                                };
                              } else {
                                return null;
                              }
                            })
                            .filter((el) => el)[0] || [],
                      };
                    })
                    .filter((el) => Object.values(el)[0]),
                  application: switchPanels.application,
                  switchSize: `#${
                    switchPanels.size || switchPanels.switch_size
                  }`,
                  ssrRating: `${switchPanels.ssr_rating} amps`,
                  sysId: switchPanels.system_id,
                  deviceName: uosPanels.device_name,
                  zoneId: uosPanels.zone_id,
                  deviceMac: uosPanels.device_mac,
                  type: uosPanels.type,
                  latitude: location.latitude,
                  longitude: location.longitude,
                  displaySelectBox: [false, false, false, false, false],
                };
              });
            })
            .flat()
            .filter((switchInfo) => switchInfo),
        };
      });
    },
  },
});

export default sysIdentificationSlice;
export const selectSysIdentification = (state) => state.sysIdentification;
export const {
  handleRemoveSysIdentificationLocation,
  handleEditSysIdentification,
  handleCreateSysIdentification,
  handleAddSwitchSizeSSRRating,
  handleSwitchSize,
  handleSSRRating,
  handleAddGasType,
  handleLocationsSystemIdentification,
} = sysIdentificationSlice.actions;
