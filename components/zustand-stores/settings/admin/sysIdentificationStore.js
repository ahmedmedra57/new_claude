import { createStore } from '../../storeUtils';

const ssrInitialState = {
  select: 'tc-01',
  buttonStatus: 'on',
  switchName: null,
  description: [null, null, null],
  index: 1,
  isSettingOpen: false,
  openPasswordBox: false,
};

const ssrState = {
  ssr1: { ...ssrInitialState, specs: [] },
  ssr2: { ...ssrInitialState, currentCurrent: 0, specs: [], buttonStatus: 'flt' },
  ssr3: { ...ssrInitialState, specs: [] },
  ssr4: { ...ssrInitialState, specs: [], currentCurrent: [10.65] },
  ssr5: { ...ssrInitialState, specs: [] },
  ssr6: { ...ssrInitialState, specs: [] },
  ssr7: { ...ssrInitialState, specs: [], buttonStatus: 'off' },
  ssr8: { ...ssrInitialState, specs: [] },
};

const useSysIdentificationStore = createStore('sysIdentification', (set) => ({
  locations: [],
  heatingSysOptions: ['ess', 'tgs', 'tes', 'hp', 'ate'],
  switchSizeOptions: [],
  ssrRatingOptions: [],
  gasTypeOptions: ['ng', 'lp'],

  createSysIdentification: ({ location, address, specificLocationInfo, specificLocationName }) => set((state) => {
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
  }),

  editSysIdentification: ({ isEditAll, specificLocationName, locationIdx, modifiedLocation }) => set((state) => {
    if (isEditAll) {
      if (specificLocationName) {
        state.locations.splice(locationIdx, 1, modifiedLocation);
      } else {
        const {
          location,
          address,
          specificLocation: {
            info: { numOfUOS, numOfSSR, switchesNum, switchInfo },
          },
        } = modifiedLocation;
        const locationState = {
          address,
          location,
          numOfSSR,
          numOfUOS,
          switchesNum,
          switchInfo,
        };
        state.locations.splice(locationIdx, 1, locationState);
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
      } = modifiedLocation;

      state.locations[locationIdx].address = address;
      state.locations[locationIdx].location = location;

      if (specificLocation) {
        const specificLocationState =
          state.locations[locationIdx].specificLocation[specificLocation];
        specificLocationState.numOfUOS = numOfUOS;
        specificLocationState.numOfSSR = numOfSSR;
        specificLocationState.switchesNum = switchesNum;
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
        state.locations[locationIdx].numOfUOS = numOfUOS;
        state.locations[locationIdx].numOfSSR = numOfSSR;
        state.locations[locationIdx].switchesNum = switchesNum;
        state.locations[locationIdx].switchInfo.forEach((eachSwitch, idx) => {
          switchInfo.forEach((savedSwitch) => {
            if (
              eachSwitch.UOS === savedSwitch.UOS &&
              eachSwitch.switchName === savedSwitch.switchName
            ) {
              state.locations[locationIdx].switchInfo.splice(idx, 1, savedSwitch);
            }
          });
        });
      }
    }
  }),

  removeSysIdentificationLocation: (locationIdx) => set((state) => {
    state.locations.splice(locationIdx, 1);
  }),

  addSwitchSizeSSRRating: ({ keyOfOptions, value }) => set((state) => {
    if (keyOfOptions === 'switchSizeOptions') {
      state[keyOfOptions].push(`#${value}`);
    } else {
      state[keyOfOptions].push(`${value} amps`);
    }
  }),

  setSwitchSize: (sizes) => set((state) => {
    state.switchSizeOptions = sizes
      .map((size) => `#${size.value}`)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }),

  setSSRRating: (ratings) => set((state) => {
    state.ssrRatingOptions = ratings
      .map((rate) => `${rate.value} amps`)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }),

  addGasType: (gasType) => set((state) => {
    state.gasTypeOptions.push(gasType);
  }),

  setLocationsSystemIdentification: ({ data, heaterSpecs }) => set((state) => {
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
                        switchSize: `#${switchPanels.size || switchPanels.switch_size}`,
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
                switchSize: `#${switchPanels.size || switchPanels.switch_size}`,
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
  }),
}));

export default useSysIdentificationStore;
