import { createSlice } from '@reduxjs/toolkit';
import reduce from 'lodash/reduce';
import result from 'lodash/result';
import moment from 'moment/moment';

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    ess: {},
    tgs: {},
    tes: {},
    hp: {},
    all: {},
    specific: {},
  },
  reducers: {
    handleEssLocation: (state, action) => {
      state.ess = extractLocationData(action.payload); 
    },
    handleTgsLocation: (state, action) => {
      state.tgs = extractLocationData(action.payload);
    },
    handleTesLocation: (state, action) => {
      state.tes = extractLocationData(action.payload);
    },
    handleSysLocation: (state, action) => {
    // state.specific = reduce(
      //   action.payload,
      //   (result, location) => {
      //     if (location.specific_location) {
      //       location.specific_location.forEach((specificLocation) => {
      //         return{
      //           ...result,
      //           [specificLocation.zone_id] : {
      //             ...specificLocation,
      //             address: {
      //               lat: specificLocation.latitude,
      //               lng: specificLocation.longitude,
      //             },
      //             zoneId: specificLocation.zone_id,
      //             locationId: specificLocation.zone_id,
      //             locationName: specificLocation.zone_name,
      //             locationAddress: specificLocation.zone_address || "",
      //             site_maps_ESS: specificLocation.site_maps_ESS
      //               ? specificLocation.site_maps_ESS[0]
      //               : "",
      //             site_maps_TGS: specificLocation.site_maps_TGS
      //               ? specificLocation.site_maps_TGS[0]
      //               : "",
      //             site_maps_TES: specificLocation.site_maps_TES
      //               ? specificLocation.site_maps_TES[0]
      //               : "",
      //             weather: specificLocation.daily
      //               .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
      //               .map((item) => ({
      //                 icon: item.weather[0].icon,
      //                 tempMin: item.main.temp_min.toFixed(),
      //                 tempMax: item.main.temp_max.toFixed(),
      //                 day: moment(item.dt_txt).format("dddd"),
      //               })),
      //             devices: {
      //               ...result[specificLocation.zone_id]?.devices,
      //               ...specificLocation?.devices.reduce(
      //                 (result, machine) => ({
      //                   ...result,
      //                   [machine.device_mac]: {
      //                     ...machine,
      //                     machineName: machine.device_name,
      //                     machineMac: machine.device_mac,
      //                     locationId: specificLocation.zone_id,
      //                     locationName: specificLocation.zone_name,
      //                   },
      //                 }),
      //                 {}
      //               ),
      //             },
      //           }
      //         }
      //       });
      //     }
      //     return {
      //       ...result,
      //       [location.zone_id]: {
      //         ...location,
      //         address: { lat: location.latitude, lng: location.longitude },
      //         zoneId: location.zone_id,
      //         locationId: location.zone_id,
      //         locationName: location.zone_name,
      //         locationAddress: location.zone_address || "",
      //         assignUsers: location.assign_users || [],
      //         site_maps_ESS: location.site_maps_ESS
      //           ? location.site_maps_ESS[0]
      //           : "",
      //         site_maps_TGS: location.site_maps_TGS
      //           ? location.site_maps_TGS[0]
      //           : "",
      //         site_maps_TES: location.site_maps_TES
      //           ? location.site_maps_TES[0]
      //           : "",
      //         weather: location.daily
      //           .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
      //           .map((item) => ({
      //             icon: item.weather[0].icon,
      //             tempMin: item.main.temp_min.toFixed(),
      //             tempMax: item.main.temp_max.toFixed(),
      //             day: moment(item.dt_txt).format("dddd"),
      //           })),
      //         devices: {
      //           ...result[location.zone_id]?.devices,
      //           ...location.devices.reduce(
      //             (result, machine) => ({
      //               ...result,
      //               [machine.device_mac]: {
      //                 ...machine,
      //                 machineName: machine.device_name,
      //                 machineMac: machine.device_mac,
      //                 locationId: location.zone_id,
      //                 locationName: location.zone_name,
      //               },
      //             }),
      //             {}
      //           ),
      //         },
      //       },
      //     };
      //   },
      //   {}
      // );
      // state.all = reduce(
      //   action.payload,
      //   (result, location) => {
      //     if (location.specific_location) {
      //       location.specific_location.forEach((specificLocation) => {
      //         console.log(result[specificLocation.zone_id]?.devices, "specificLocation.zone_id");
      //         result[specificLocation.zone_id] = {
      //           ...specificLocation,
      //           address: {
      //             lat: specificLocation.latitude,
      //             lng: specificLocation.longitude,
      //           },
      //           zoneId: specificLocation.zone_id,
      //           locationId: specificLocation.zone_id,
      //           locationName: specificLocation.zone_name,
      //           locationAddress: specificLocation.zone_address || "",
      //           site_maps_ESS: specificLocation.site_maps_ESS
      //             ? specificLocation.site_maps_ESS[0]
      //             : "",
      //           site_maps_TGS: specificLocation.site_maps_TGS
      //             ? specificLocation.site_maps_TGS[0]
      //             : "",
      //           site_maps_TES: specificLocation.site_maps_TES
      //             ? specificLocation.site_maps_TES[0]
      //             : "",
      //           weather: specificLocation.daily
      //             .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
      //             .map((item) => ({
      //               icon: item.weather[0].icon,
      //               tempMin: item.main.temp_min.toFixed(),
      //               tempMax: item.main.temp_max.toFixed(),
      //               day: moment(item.dt_txt).format("dddd"),
      //             })),
      //           devices: {
      //             ...result[specificLocation.zone_id]?.devices,
      //             ...specificLocation?.devices.reduce(
      //               (result, machine) => ({
      //                 ...result,
      //                 [machine.device_mac]: {
      //                   ...machine,
      //                   machineName: machine.device_name,
      //                   machineMac: machine.device_mac,
      //                   locationId: specificLocation.zone_id,
      //                   locationName: specificLocation.zone_name,
      //                 },
      //               }),
      //               {}
      //             ),
      //           },
      //         };
      //       });
      //     }
      //     return {
      //       ...result,
      //       [location.zone_id]: {
      //         ...location,
      //         address: { lat: location.latitude, lng: location.longitude },
      //         zoneId: location.zone_id,
      //         locationId: location.zone_id,
      //         locationName: location.zone_name,
      //         locationAddress: location.zone_address || "",
      //         assignUsers: location.assign_users || [],
      //         site_maps_ESS: location.site_maps_ESS
      //           ? location.site_maps_ESS[0]
      //           : "",
      //         site_maps_TGS: location.site_maps_TGS
      //           ? location.site_maps_TGS[0]
      //           : "",
      //         site_maps_TES: location.site_maps_TES
      //           ? location.site_maps_TES[0]
      //           : "",
      //         weather: location.daily
      //           .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
      //           .map((item) => ({
      //             icon: item.weather[0].icon,
      //             tempMin: item.main.temp_min.toFixed(),
      //             tempMax: item.main.temp_max.toFixed(),
      //             day: moment(item.dt_txt).format("dddd"),
      //           })),
      //         devices: {
      //           ...result[location.zone_id]?.devices,
      //           ...location.devices.reduce(
      //             (result, machine) => ({
      //               ...result,
      //               [machine.device_mac]: {
      //                 ...machine,
      //                 machineName: machine.device_name,
      //                 machineMac: machine.device_mac,
      //                 locationId: location.zone_id,
      //                 locationName: location.zone_name,
      //               },
      //             }),
      //             {}
      //           ),
      //         },
      //       },
      //     };
      //   },
      //   {}
      // );
      // {
      // handleSysLocation: (state, action) => {
      const data = JSON.stringify(action.payload);
      const res = reduce(
        action.payload,
        (result, location) => {
          if (location.specific_location) {
            const specificLocations = [];
            location.specific_location.forEach((specificLocation) => {
              const allDevices = [
                ...(result[specificLocation.zone_id]?.allDevices || []),
                ...(specificLocation.devices || []),
              ];
              specificLocations.push({
                ...specificLocation,
                devices: allDevices,
              });
              result[specificLocation.zone_id] = {
                ...specificLocation,
                address: {
                  lat: specificLocation.latitude,
                  lng: specificLocation.longitude,
                },
                zoneId: specificLocation.zone_id,
                locationId: specificLocation.zone_id,
                locationName: specificLocation.zone_name,
                locationAddress: specificLocation.zone_address || '',
                site_maps_ESS: specificLocation.site_maps_ESS
                  ? specificLocation.site_maps_ESS[0]
                  : '',
                site_maps_TGS: specificLocation.site_maps_TGS
                  ? specificLocation.site_maps_TGS[0]
                  : '',
                site_maps_TES: specificLocation.site_maps_TES
                  ? specificLocation.site_maps_TES[0]
                  : '',
                weather: specificLocation.daily
                  .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
                  .map((item) => ({
                    icon: item.weather[0].icon,
                    tempMin: item.main.temp_min.toFixed(),
                    tempMax: item.main.temp_max.toFixed(),
                    day: moment(item.dt_txt).format('dddd'),
                  })),
                allDevices: allDevices,
                devices: {
                  ...(result[specificLocation.zone_id]?.devices || {}),
                  ...specificLocation?.devices.reduce(
                    (_result, _machine) => ({
                      ..._result,
                      [_machine.device_mac]: {
                        ..._machine,
                        machineName: _machine.device_name,
                        machineMac: _machine.device_mac,
                        locationId: specificLocation.zone_id,
                        locationName: specificLocation.zone_name,
                      },
                    }),
                    {}
                  ),
                },
              };
            });
            if (result[location.zone_id]) {
              // console.log('specificLocation.zone_id', specificLocations);
              // location.specific_location = specificLocations;
              // console.log(
              //   'specificLocation.zone_id',
              //   location.specific_location
              // );
            }
          }
          return {
            ...result,
            [location.zone_id]: {
              ...location,
              address: { lat: location.latitude, lng: location.longitude },
              zoneId: location.zone_id,
              locationId: location.zone_id,
              locationName: location.zone_name,
              locationAddress: location.zone_address || '',
              assignUsers: location.assign_users || [],
              site_maps_ESS: location.site_maps_ESS
                ? location.site_maps_ESS[0]
                : '',
              site_maps_TGS: location.site_maps_TGS
                ? location.site_maps_TGS[0]
                : '',
              site_maps_TES: location.site_maps_TES
                ? location.site_maps_TES[0]
                : '',
              weather: location.daily
                .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
                .map((item) => ({
                  icon: item.weather[0].icon,
                  tempMin: item.main.temp_min.toFixed(),
                  tempMax: item.main.temp_max.toFixed(),
                  day: moment(item.dt_txt).format('dddd'),
                })),
              devices: {
                ...result[location.zone_id]?.devices,
                ...location.devices.reduce(
                  (result, machine) => ({
                    ...result,
                    [machine.device_mac]: {
                      ...machine,
                      machineName: machine.device_name,
                      machineMac: machine.device_mac,
                      locationId: location.zone_id,
                      locationName: location.zone_name,
                    },
                  }),
                  {}
                ),
              },
            },
          };
        },
        {}
      );
      state.specific = reduce(
        action.payload,
        (result, location) => {
          if (location.specific_location) {
            location.specific_location.forEach((specificLocation) => {
              return {
                ...result,
                [specificLocation.zone_id]: {
                  ...specificLocation,
                  address: {
                    lat: specificLocation.latitude,
                    lng: specificLocation.longitude,
                  },
                  zoneId: specificLocation.zone_id,
                  locationId: specificLocation.zone_id,
                  locationName: specificLocation.zone_name,
                  locationAddress: specificLocation.zone_address || '',
                  site_maps_ESS: specificLocation.site_maps_ESS
                    ? specificLocation.site_maps_ESS[0]
                    : '',
                  site_maps_TGS: specificLocation.site_maps_TGS
                    ? specificLocation.site_maps_TGS[0]
                    : '',
                  site_maps_TES: specificLocation.site_maps_TES
                    ? specificLocation.site_maps_TES[0]
                    : '',
                  weather: specificLocation.daily
                    .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
                    .map((item) => ({
                      icon: item.weather[0].icon,
                      tempMin: item.main.temp_min.toFixed(),
                      tempMax: item.main.temp_max.toFixed(),
                      day: moment(item.dt_txt).format('dddd'),
                    })),
                  devices: {
                    ...result[specificLocation.zone_id]?.devices,
                    ...specificLocation?.devices.reduce(
                      (result, machine) => ({
                        ...result,
                        [machine.device_mac]: {
                          ...machine,
                          machineName: machine.device_name,
                          machineMac: machine.device_mac,
                          locationId: specificLocation.zone_id,
                          locationName: specificLocation.zone_name,
                        },
                      }),
                      {}
                    ),
                  },
                },
              };
            });
          }
          return {
            ...result,
            [location.zone_id]: {
              ...location,
              address: { lat: location.latitude, lng: location.longitude },
              zoneId: location.zone_id,
              locationId: location.zone_id,
              locationName: location.zone_name,
              locationAddress: location.zone_address || '',
              assignUsers: location.assign_users || [],
              site_maps_ESS: location.site_maps_ESS
                ? location.site_maps_ESS[0]
                : '',
              site_maps_TGS: location.site_maps_TGS
                ? location.site_maps_TGS[0]
                : '',
              site_maps_TES: location.site_maps_TES
                ? location.site_maps_TES[0]
                : '',
              weather: location.daily
                .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
                .map((item) => ({
                  icon: item.weather[0].icon,
                  tempMin: item.main.temp_min.toFixed(),
                  tempMax: item.main.temp_max.toFixed(),
                  day: moment(item.dt_txt).format('dddd'),
                })),
              devices: {
                ...result[location.zone_id]?.devices,
                ...location.devices.reduce(
                  (result, machine) => ({
                    ...result,
                    [machine.device_mac]: {
                      ...machine,
                      machineName: machine.device_name,
                      machineMac: machine.device_mac,
                      locationId: location.zone_id,
                      locationName: location.zone_name,
                    },
                  }),
                  {}
                ),
              },
            },
          };
        },
        {}
      );
      state.all = res;

      //   console.log(state.all, "handleSysLocationXXX");

      // },
      // }
    },
    handleSitePlanURL: (state, action) => {
      const { swtName, location, specificLocation, key, url } = action.payload;
      if (specificLocation) {
        state.all[location][specificLocation][key] = url;
        state[swtName][location][specificLocation][key] = url;
      } else {
        state.all[location][key] = url;
        state[swtName][location][key] = url;
      }
    },
  },
});

const extractLocationData = (data) => {
  return reduce(
    data,
    (result, location) => {
      if (location.specific_location) {
        location.specific_location.forEach((specificLocation) => {
          result[specificLocation.zone_id] = {
            ...specificLocation,
            address: {
              lat: specificLocation.latitude,
              lng: specificLocation.longitude,
            },
            zoneId: specificLocation.zone_id,
            locationId: specificLocation.zone_id,
            locationName: specificLocation.zone_name,
            locationAddress: specificLocation.zone_address || '',
            site_maps_ESS: specificLocation.site_maps_ESS
              ? specificLocation.site_maps_ESS[0]
              : '',
            site_maps_TGS: specificLocation.site_maps_TGS
              ? specificLocation.site_maps_TGS[0]
              : '',
            site_maps_TES: specificLocation.site_maps_TES
              ? specificLocation.site_maps_TES[0]
              : '',
            weather: specificLocation.daily
              .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
              .map((item) => ({
                icon: item.weather[0].icon,
                tempMin: item.main.temp_min.toFixed(),
                tempMax: item.main.temp_max.toFixed(),
                day: moment(item.dt_txt).format('dddd'),
              })),
            devices: specificLocation?.devices.reduce(
              (result, machine) => ({
                ...result,
                [machine.device_mac]: {
                  ...machine,
                  machineName: machine.device_name,
                  machineMac: machine.device_mac,
                  locationId: specificLocation.zone_id,
                  locationName: specificLocation.zone_name,
                },
              }),
              {}
            ),
          };
        });
      }
      return {
        ...result,
        [location.zone_id]: {
          ...location,
          address: { lat: location.latitude, lng: location.longitude },
          zoneId: location.zone_id,
          locationId: location.zone_id,
          locationName: location.zone_name,
          locationAddress: location.zone_address || '',
          site_maps_ESS: location.site_maps_ESS
            ? location.site_maps_ESS[0]
            : '',
          site_maps_TGS: location.site_maps_TGS
            ? location.site_maps_TGS[0]
            : '',
          site_maps_TES: location.site_maps_TES
            ? location.site_maps_TES[0]
            : '',
          weather: location.daily
            .filter((_, index) => [0, 8, 16, 24, 32].includes(index))
            .map((item) => ({
              icon: item.weather[0].icon,
              tempMin: item.main.temp_min.toFixed(),
              tempMax: item.main.temp_max.toFixed(),
              day: moment(item.dt_txt).format('dddd'),
            })),
          devices: location?.devices.reduce(
            (result, machine) => ({
              ...result,
              [machine.device_mac]: {
                ...machine,
                machineName: machine.device_name,
                machineMac: machine.device_mac,
                locationId: location.zone_id,
                locationName: location.zone_name,
              },
            }),
            {}
          ),
        },
      };
    },
    {}
  );
};

export default locationSlice;
export const selectLocations = (state) => state.locations;

export const {
  handleEssLocation,
  handleTgsLocation,
  handleTesLocation,
  handleSysLocation,
  handleSitePlanURL,
} = locationSlice.actions;
