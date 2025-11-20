import { createStore } from './storeUtils';
import reduce from 'lodash/reduce';
import moment from 'moment/moment';

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

const useLocationsStore = createStore('locations', (set) => ({
  ess: {},
  tgs: {},
  tes: {},
  hp: {},
  all: {},
  specific: {},

  setEssLocation: (data) => set((state) => {
    state.ess = extractLocationData(data);
  }),

  setTgsLocation: (data) => set((state) => {
    state.tgs = extractLocationData(data);
  }),

  setTesLocation: (data) => set((state) => {
    state.tes = extractLocationData(data);
  }),

  setSysLocation: (data) => set((state) => {
    const res = reduce(
      data,
      (result, location) => {
        if (location.specific_location) {
          location.specific_location.forEach((specificLocation) => {
            const allDevices = [
              ...(result[specificLocation.zone_id]?.allDevices || []),
              ...(specificLocation.devices || []),
            ];
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
      data,
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
  }),

  setSitePlanURL: ({ swtName, location, specificLocation, key, url }) => set((state) => {
    if (specificLocation) {
      state.all[location][specificLocation][key] = url;
      state[swtName][location][specificLocation][key] = url;
    } else {
      state.all[location][key] = url;
      state[swtName][location][key] = url;
    }
  }),
}));

export default useLocationsStore;
