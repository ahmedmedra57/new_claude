import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import sum from 'lodash/sum';
import moment from 'moment';
import { ROLE_PERMISSIONS } from '../constants';
import { useEffect } from 'react';

export const convertCelsiusToFahrenheit = (temp) => {
  if (temp == null) return null;
  if (temp) {
    return Math.round(temp * (9 / 5) + 32);
  }
  return 0;
};

export const convertFahrenheitToCelsius = (temp) => {
  if (temp == null) return null;
  if (temp) {
    return (temp - 32) * (5 / 9);
  }
  return 0;
};

export const hasValue = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const formatTime = ({ date, time }, isTimestamp) => {
  const { hour, minute, division } = time;

  // Create a Moment.js object using the given date
  const m = moment(date);

  // Set the time values using the extracted hour, minute, and division
  m.hour(parseInt(hour));
  m.minute(parseInt(minute));
  m.second(0);

  // Adjust the time if it's in PM format
  if (division === 'pm') {
    m.add(12, 'hours');
  }

  if (isTimestamp) {
    return m.utc().valueOf();
  }

  // Format to 'YYYY-MM-DDTHH:mm:ssZ' syntax
  const formattedDate = m.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z';

  return formattedDate;
};

export const getStartAndEndTimestamps = (timestamp, unit) => {
  const date = moment(timestamp).utc();

  return {
    start: date.clone().startOf(unit?.slice(0, -1)).valueOf(),
    end: date.clone().endOf(unit?.slice(0, -1)).valueOf(),
  };
};

export const readableTime = (time) => {
  const date = moment(time).utc();
  const hour = date.format('hh');
  const minute = date.format('mm');
  const division = date.format('a');

  const timeObject = {
    date: moment(time).utc().startOf('day')._d,
    time: {
      hour,
      minute,
      division,
    },
  };

  return timeObject;
};

export const isImageFile = (file) => {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  return imageExtensions.includes(fileExtension);
};

export const getTitle = (gender) => {
  if (gender) {
    if (gender.toLowerCase() === 'male') {
      return 'Mr.';
    } else if (gender.toLowerCase() === 'female') {
      return 'Ms.';
    } else {
      return '';
    }
  }
  return '';
};

export const getLocationsMachinesName = (deviceIds, switches) => {
  const locationsMachines = [];
  deviceIds.map((deviceId) => {
    Object.values(switches).map((zone, zoneIndex) => {
      Object.values(zone).map((machine, machineIndex) => {
        if (machine.deviceMac === deviceId) {
          const locationName = Object.keys(switches)[zoneIndex];
          const machineName = Object.keys(zone)[machineIndex];
          locationsMachines.push([locationName, machineName]);
        }
      });
    });
  });

  const locationsMachinesGrouped = groupBy(locationsMachines, (el) => el[0]);
  const locations = Object.keys(locationsMachinesGrouped);
  const machines = Object.values(locationsMachinesGrouped).map((el) =>
    el.map((el) => el[1])
  );

  return { locations, machines };
};

export const isAnotherSystemRunning = (currentRunning, anotherSystem) => {
  if (currentRunning === null) {
    return false;
  }
  if (currentRunning === anotherSystem) {
    return true;
  }
  return false;
};

export const calculateTotalEnergyConsumption = (value, swtName, isF) => {
  const consumptionGas = isF ? value : Math.round(value * 0.0283168);
  const consumption = swtName === 'tgs' ? consumptionGas : value;
  return consumption ?? '--';
};

export const getFaultIndexes = (data) => {
  let indexFault = [];
  data?.forEach((fault, idx) => {
    if (fault === 1) {
      indexFault.push(idx + 1);
    }
  });
  return indexFault;
};

export const getFaultsList = (data, specificLocation) => {
  return Object.values(data)
    .map((location) => {
      return Object.values(location).map((machineData) => {
        const defaultData = {
          number: [],
          locationPre: 'mbta',
          location: machineData.zone_id,
          machine: machineData.deviceMac,
          address: machineData.locationAddress,
          date: '',
        };
        let faults = [];
        if (machineData.ssrFault?.includes(1)) {
          getFaultIndexes(machineData.ssrFault).forEach((faultIndex) => {
            const time = Object.values(machineData.ssrState)[faultIndex - 1]
              ?.fault_time;
            faults.push({
              ...defaultData,
              faultType: 'ssr fault',
              number: [faultIndex],
              date: time ? moment.unix(time).format('h:mma - DD/MM/YYYY') : '',
            });
          });
        }
        if (machineData.ssrOverCurrent?.includes(1)) {
          getFaultIndexes(machineData.ssrOverCurrent).forEach((faultIndex) => {
            const time = Object.values(machineData.ssrState)[faultIndex - 1]
              ?.fault_time;
            faults.push({
              ...defaultData,
              faultType: 'ssr over current',
              number: [faultIndex],
              date: time ? moment.unix(time).format('h:mma - DD/MM/YYYY') : '',
            });
          });
        }
        if (machineData.groundFault === 1) {
          faults.push({
            ...defaultData,
          });
        }
        if (
          machineData.thermocoupleFault &&
          machineData.thermocoupleFault?.includes(1)
        ) {
          getFaultIndexes(machineData.thermocoupleFault).forEach(
            (faultIndex) => {
              faults.push({
                ...defaultData,
                faultType: 'thermocouple fault',
                number: [faultIndex],
              });
            }
          );
        }
        if (machineData.bmsFault === 1) {
          faults.push({
            ...defaultData,
            faultType: 'bms fault',
          });
        }
        if (machineData.hplpFault === 1) {
          faults.push({
            ...defaultData,
            faultType: 'hp/lp fault',
          });
        }
        if (machineData.timeoutFault === 1) {
          faults.push({
            ...defaultData,
            faultType: 'timeout fault',
          });
        }
        if (machineData.thermocoupleFault === 1) {
          faults.push({
            ...defaultData,
            faultType: 'thermocouple fault',
          });
        }
        return faults;
      });
    })
    .flat(2);
};

export const electricalFaultsList = (data) => {
  return Object.values(data)
    .map((location) => {
      return Object.values(location).map((machineData) => {
        // ssrFault, srrOverCurrent, groundFault and thermocoupleFault
        let faults = [];
        if (machineData.ssrFault?.includes(1)) {
          getFaultIndexes(machineData.ssrFault).forEach((faultIndex) => {
            const time = Object.values(machineData.ssrState)[faultIndex - 1]
              ?.fault_time;
            faults.push({
              faultType: 'ssr fault',
              number: [faultIndex],
              locationPre: 'mbta',
              location: machineData.locationId,
              machine: machineData.deviceMac,
              address: machineData.locationAddress,
              date: time ? moment.unix(time).format('h:mma - DD/MM/YYYY') : '',
            });
          });
        }
        if (machineData.ssrOverCurrent?.includes(1)) {
          getFaultIndexes(machineData.ssrOverCurrent).forEach((faultIndex) => {
            const time = Object.values(machineData.ssrState)[faultIndex - 1]
              ?.fault_time;
            faults.push({
              faultType: 'ssr over current',
              number: [faultIndex],
              locationPre: 'mbta',
              location: machineData.locationId,
              machine: machineData.deviceMac,
              address: machineData.locationAddress,
              date: time ? moment.unix(time).format('h:mma - DD/MM/YYYY') : '',
            });
          });
        }
        if (machineData.groundFault === 1) {
          faults.push({
            faultType: 'ground fault',
            number: [],
            locationPre: 'mbta',
            location: machineData.locationId,
            machine: machineData.deviceMac,
            address: machineData.locationAddress,
            date: '',
          });
        }
        if (machineData.thermocoupleFault?.includes(1)) {
          getFaultIndexes(machineData.thermocoupleFault).forEach(
            (faultIndex) => {
              faults.push({
                faultType: 'thermocouple fault',
                number: [faultIndex],
                locationPre: 'mbta',
                location: machineData.locationId,
                machine: machineData.deviceMac,
                address: machineData.locationAddress,
                date: '',
              });
            }
          );
        }
        return faults;
      });
    })
    .flat(2);
};

export const gasFaultsList = (data) => {
  return Object.values(data)
    .map((location) => {
      return Object.values(location).map((machineData) => {
        // bmsFault, hplpFault, timeoutFault and thermocoupleFault
        let faults = [];
        if (machineData.bmsFault === 1) {
          faults.push({
            faultType: 'bms fault',
            number: [],
            locationPre: 'mbta',
            location: machineData.locationId,
            machine: machineData.deviceMac,
            address: machineData.locationAddress,
            date: '',
          });
        }
        if (machineData.hplpFault === 1) {
          faults.push({
            faultType: 'hp/lp fault',
            number: [],
            locationPre: 'mbta',
            location: machineData.locationId,
            machine: machineData.deviceMac,
            address: machineData.locationAddress,
            date: '',
          });
        }
        if (machineData.timeoutFault === 1) {
          faults.push({
            faultType: 'timeout fault',
            number: [],
            locationPre: 'mbta',
            location: machineData.locationId,
            machine: machineData.deviceMac,
            address: machineData.locationAddress,
            date: '',
          });
        }
        if (machineData.thermocoupleFault === 1) {
          faults.push({
            faultType: 'thermocouple fault',
            number: [],
            locationPre: 'mbta',
            location: machineData.locationId,
            machine: machineData.deviceMac,
            address: machineData.locationAddress,
            date: '',
          });
        }
        return faults;
      });
    })
    .flat(2);
};

export const extractUniquePropertyValues = (arr, prop) => {
  const uniqueValues = new Set();

  arr.forEach((item) => {
    if (item.hasOwnProperty(prop)) {
      uniqueValues.add(item[prop]);
    }
  });
  return Array.from(uniqueValues);
};

export const getLocationDataByDeviceId = (deviceId, swtStatus) => {
  for (const location in swtStatus) {
    if (
      swtStatus[location].devices?.hasOwnProperty(deviceId) ||
      swtStatus[location].hasOwnProperty(deviceId)
    ) {
      return swtStatus[location] || {};
    }
  }
  return {};
};

export const getESSAuditTrailFaults = (data, swtStatus) => {
  const faults = [];
  if (!data || !swtStatus) return [];
  data?.forEach(({ row, ...restProps }) => {
    row?.deviceIds?.forEach((deviceId) => {
      // ssr faults
      if (
        row?.newData?.hasOwnProperty('ssr_fault') &&
        row.newData?.ssr_fault?.includes(1)
      ) {
        faults.push({
          faultType: 'ssr fault',
          number: getFaultIndexes(row.newData?.ssr_fault),
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('thermocouple_fault') &&
        row.newData?.thermocouple_fault?.includes(1)
      ) {
        faults.push({
          faultType: 'thermocouple failure',
          number: getFaultIndexes(row.newData?.thermocouple_fault),
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }
      if (
        row?.newData?.hasOwnProperty('ground_fault') &&
        row.newData?.ground_fault == 1
      ) {
        faults.push({
          faultType: 'ground fault',
          number: [],
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('srr_over_current') &&
        row.newData?.srr_over_current?.includes(1)
      ) {
        faults.push({
          faultType: 'ssr over current',
          number: getFaultIndexes(row.newData?.srr_over_current),
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }
    });
  });
  return faults;
};

export const getTESAuditTrailFaults = (data, swtStatus) => {

  const faults = [];
  if (!data || !swtStatus) return [];
  data?.forEach(({ row, ...restProps }) => {
    row?.deviceIds?.forEach((deviceId) => {
        const locationData=  getLocationDataByDeviceId(deviceId, swtStatus);
      let locationid;
      if (locationData?.parent_location_id) {
        locationid = locationData.parent_location_id;
      } else {
        locationid = locationData?.locationId;
      }
      // ssr faults
      if (
        row?.newData?.hasOwnProperty('e_ssr_fault') &&
        row.newData?.e_ssr_fault?.includes(1)
      ) {
        faults.push({
          faultType: 'ssr fault',
          number: getFaultIndexes(row.newData?.e_ssr_fault),
          locationPre: 'mbta',
          location:locationid,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('e_thermocouple_fault') &&
        row.newData?.e_thermocouple_fault?.includes(1)
      ) {
        faults.push({
          faultType: 'thermocouple failure',
          number: getFaultIndexes(row.newData?.e_thermocouple_fault),
          locationPre: 'mbta',
          location: locationid,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }
      if (
        row?.newData?.hasOwnProperty('e_ground_fault') &&
        row.newData?.e_ground_fault == 1
      ) {
        faults.push({
          faultType: 'ground fault',
          number: [],
          locationPre: 'mbta',
          location: locationid,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('e_srr_over_current') &&
        row.newData?.e_srr_over_current?.includes(1)
      ) {
        faults.push({
          faultType: 'ssr over current',
          number: getFaultIndexes(row.newData?.e_srr_over_current),
          locationPre: 'mbta',
          location: locationid,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: row.newData?.position,
          isLCD: row.isLCD,
        });
      }
    });
  });
  return faults;
};
export const getTgsAuditTrailFaults = (data, swtStatus) => {
  const faults = [];
  if (!data || !swtStatus) return [];
  data?.forEach(({ row, ...restProps }) => {
    row?.deviceIds?.forEach((deviceId) => {
      // ssr faults
      if (
        row?.newData?.hasOwnProperty('bms_fault') &&
        row.newData?.bms_fault == 1
      ) {
        faults.push({
          faultType: 'bms fault',
          number: [],
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('hplp_fault') &&
        row.newData?.hplp_fault == 1
      ) {
        faults.push({
          faultType: 'hp/lp fault',
          number: [],
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }
      if (
        row?.newData?.hasOwnProperty('thermocouple_fault') &&
        row.newData?.thermocouple_fault == 1
      ) {
        faults.push({
          faultType: 'thermocouple fault',
          number: [],
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }

      if (
        row?.newData?.hasOwnProperty('timeout_fault') &&
        row.newData?.timeout_fault == 1
      ) {
        faults.push({
          faultType: 'timeout fault',
          number: [],
          locationPre: 'mbta',
          location: getLocationDataByDeviceId(deviceId, swtStatus)?.locationId,
          machine: deviceId,
          address: getLocationDataByDeviceId(deviceId, swtStatus)
            ?.locationAddress,
          date: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
          attends: row.userAttends,
          position: undefined,
          isLCD: row.isLCD,
        });
      }
    });
  });
  return faults;
};

export const auditTrailActionsDataForamt = (data, swtStatus, isF, allUsers) => {
  if (!data || !swtStatus) return [];
  const unit = isF ? `°F` : `°C`;
  return data?.map(({ row, ...restProps }) => {
    const actionLoctaionIds = [
      ...new Set(
        row.deviceIds?.map(
          (deviceId) =>
            getLocationDataByDeviceId(deviceId, swtStatus)?.locationId
        )||[]
      ),
    ];

    const actionSwitches = {};
    row.deviceIds?.forEach((deviceId) => {
      const locationId = getLocationDataByDeviceId(
        deviceId,
        swtStatus
      )?.locationId;
      if (actionSwitches.hasOwnProperty(locationId)) {
        actionSwitches[locationId].push(deviceId);
      } else {
        actionSwitches[locationId] = [deviceId];
      }
    });
    let userData = allUsers.find((user) => user.user_id === row.userId);

    const defaultData = {
      companyName: 'ATA',
      actionType: row.actionType,
      date: new Date(row.createdAt),
      userName: userData?.username,
      userCode: userData?.user_code,
      system: row.deviceType,
      locations: actionLoctaionIds,
      switches: actionSwitches,
      machines: row.deviceIds,
      isLCD: row.isLCD,
      parameters: {},
    };

    if (
      row?.actionType === 'GLOBAL_TELEMETRY_OVERVIEW' ||
      row?.actionType === 'AUDIT_TRAIL'
    ) {
      return {
        ...defaultData,
        parameters: {
          commandNumber: row.newData?.commandNumber,
          ...(row?.actionType === 'GLOBAL_TELEMETRY_OVERVIEW' && {
            globalTelemetryOverview: row.newData,
          }),
          ...(row?.actionType === 'AUDIT_TRAIL' && {
            auditTrail: {
              startDate: moment(row.newData.startDate).format('h:mma M/D/YYYY'),
              endDate: moment(row.newData.endDate).format('h:mma M/D/YYYY'),
            },
          }),
        },
      };
    }

    if (
      row?.actionType === 'SETTING' ||
      row?.actionType === 'HEAT_CONFIGURATION'
    ) {
      return {
        ...defaultData,
        parameters: {
          commandNumber: row.newData?.commandNumber,
          ...(row.newData.hasOwnProperty('EBP_mode') && {
            EBP_mode: row.newData.EBP_mode,
          }),
          ...(row.newData.hasOwnProperty('e_EBP_mode') && {
            EBP_mode: row.newData.e_EBP_mode,
          }),
          ...(row.newData.hasOwnProperty('TES_enabled') && {
            TES_enabled: row.newData.TES_enabled,
          }),
          ...(row.newData.hasOwnProperty('blower_snow_threshold') && {
            blower_snow_threshold: row.newData.blower_snow_threshold,
          }),
          ...(row.newData.hasOwnProperty('electrical_snow_threshold') && {
            electrical_snow_threshold: row.newData.electrical_snow_threshold,
          }),
          ...(row.newData.hasOwnProperty('blower_temp_ch') && {
            blower_temp_ch: row.newData.blower_temp_ch,
          }),
          ...(row.newData.hasOwnProperty('burner_temp_ch') && {
            burner_temp_ch: row.newData.burner_temp_ch,
          }),
          ...(row.newData.hasOwnProperty('display_temp_ch') && {
            display_temp_ch: row.newData.display_temp_ch,
          }),
          ...(row.newData.hasOwnProperty('enclosure_temp_ch') && {
            enclosure_temp_ch: row.newData.enclosure_temp_ch,
          }),
          ...(row.newData.hasOwnProperty('outside_temp_ch') && {
            outside_temp_ch: row.newData.outside_temp_ch,
          }),
          ...(row.newData.hasOwnProperty('tc_mode') && {
            tc_mode: row.newData.tc_mode,
          }),
          ...(row.newData.hasOwnProperty('wind_threshold') && {
            wind_threshold: row.newData.wind_threshold,
          }),
          ...(row.newData.hasOwnProperty('gas_type') && {
            gas_type: row.newData.gas_type,
          }),
          ...(row.newData.hasOwnProperty('force_run') && {
            force: row.newData.force_run,
          }),
          ...(row.newData.hasOwnProperty('force') && {
            force: row.newData.force,
          }),
          ...(row.newData.hasOwnProperty('initial_open') && {
            initial_open: row.newData.initial_open,
          }),
          ...(row.newData.hasOwnProperty('min_open') && {
            min_open: row.newData.min_open,
          }),
          ...(row.newData.hasOwnProperty('max_open') && {
            max_open: row.newData.max_open,
          }),
        },
      };
    }

    return {
      ...defaultData,
      ...(row.deviceType === 'ESS'
        ? {
            parameters: {
              ...(row.newData.hasOwnProperty('on_switch') && {
                instantHeat: row.newData.on_switch
                  ? `active ${
                      row.newData.hasOwnProperty('instant_temp') &&
                      (isF
                        ? convertCelsiusToFahrenheit(row.newData.instant_temp)
                        : row.newData.instant_temp)
                    }${unit}`
                  : 'off',
              }),
              ...(!row.newData.hasOwnProperty('on_switch') &&
                row.newData.hasOwnProperty('instant_temp') &&
                row.prevData.hasOwnProperty('instant_temp') && {
                  instantHeatChangeTemp: `from ${row.prevData.instant_temp}${unit} to ${row.newData.instant_temp}${unit}`,
                }),
              ...(row.newData.hasOwnProperty('on_constant') && {
                optionalConstantTemp: row.newData.on_constant
                  ? `ready ${
                      row.newData.constant_temp && isF
                        ? convertCelsiusToFahrenheit(row.newData.constant_temp)
                        : row.newData.constant_temp
                    }${unit}`
                  : 'off',
              }),
              ...(!row.newData.hasOwnProperty('on_constant') &&
                row.newData.hasOwnProperty('constant_temp') &&
                row.prevData.hasOwnProperty('constant_temp') && {
                  optionalConstantTempChanged: `from ${row.prevData.constant_temp}${unit} to ${row.newData.constant_temp}${unit}`,
                }),
              ...((row.newData.hasOwnProperty('snow_enabled') ||
                row.newData.hasOwnProperty('snow_trigger')) && {
                snowSensor:
                  row.newData.snow_enabled || row.newData.snow_trigger
                    ? row.newData.snow_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('scheduleAdd') && {
                heatingSchedule: row.newData.scheduleAdd?.startDate
                  ? `ready ${
                      isF
                        ? convertCelsiusToFahrenheit(
                            row.newData.scheduleAdd.threshold
                          )
                        : row.newData.scheduleAdd.threshold
                    }${unit}` +
                    ` | ${moment(row.newData.scheduleAdd.startDate).format(
                      'h:mma M/D/YYYY'
                    )}` +
                    ` | ${moment(row.newData.scheduleAdd.endDate).format(
                      'h:mma M/D/YYYY'
                    )}`
                  : 'off',
              }),
              ...(row.prevData.hasOwnProperty('scheduleDelete') && {
                scheduleEnabled: 'off',
              }),
              ...(row.newData.hasOwnProperty('schedule_enabled') && {
                scheduleEnabled:
                  row.newData.schedule_enabled === 1 ? 'enabled' : 'disabled',
              }),
              ...((row.newData.hasOwnProperty('wind_enabled') ||
                row.newData.hasOwnProperty('wind_trigger')) && {
                windFactor:
                  row.newData.wind_enabled || row.newData.wind_trigger
                    ? row.newData.wind_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('freeze') && {
                freeze: row.newData.freeze ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('device_active') && {
                deviceActive: row.newData.device_active ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('EBP') && {
                EBP: row.newData.EBP,
              }),
              ...(row?.actionType === 'SSR_RESET' && {
                ssrReset: true,
              }),
              ...(row?.actionType === 'GROUND_RESET' && {
                groundReset: true,
              }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                (row.newData.hasOwnProperty('position') ||
                  row.newData.hasOwnProperty('index')) && {
                  thermocoupleReset: true,
                }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                row.newData.hasOwnProperty('thermocouple') && {
                  thermocoupleForce: row.newData.thermocouple.fault_mode,
                }),
              ...(row?.actionType === 'GLOBAL_TELEMETRY_OVERVIEW' && {
                globalTelemetryOverview: row.newData,
              }),
              commandNumber: row.newData?.commandNumber,
            },
          }
        : row.deviceType === 'TES'
        ? {
            parameters: {
              ...(row.newData.hasOwnProperty('e_on_switch') && {
                instantHeat: row.newData.e_on_switch
                  ? `active ${
                      row.newData.hasOwnProperty('e_instant_temp') &&
                      (isF
                        ? convertCelsiusToFahrenheit(row.newData.e_instant_temp)
                        : row.newData.e_instant_temp)
                    }${unit}`
                  : 'off',
              }),
              ...(row.newData.hasOwnProperty('on_switch') && {
                instantHeat: row.newData.on_switch
                  ? `active ${
                      row.newData.hasOwnProperty('instant_temp') &&
                      (isF
                        ? convertCelsiusToFahrenheit(row.newData.instant_temp)
                        : row.newData.instant_temp)
                    }${unit}`
                  : 'off',
              }),
              ...(!row.newData.hasOwnProperty('on_switch') &&
                row.newData.hasOwnProperty('e_instant_temp') &&
                row.prevData.hasOwnProperty('e_instant_temp') && {
                  instantHeatChangeTemp: `from ${row.prevData.e_instant_temp}${unit} to ${row.newData.e_instant_temp}${unit}`,
                }),
              ...(row.newData.hasOwnProperty('e_on_constant') && {
                optionalConstantTemp: row.newData.e_on_constant
                  ? `ready ${
                      row.newData.e_constant_temp && isF
                        ? convertCelsiusToFahrenheit(
                            row.newData.e_constant_temp
                          )
                        : row.newData.e_constant_temp
                    }${unit}`
                  : 'off',
              }),
              ...(!row.newData.hasOwnProperty('e_on_constant') &&
                row.newData.hasOwnProperty('e_constant_temp') &&
                row.prevData.hasOwnProperty('e_constant_temp') && {
                  optionalConstantTempChanged: `from ${row.prevData.e_constant_temp}${unit} to ${row.newData.e_constant_temp}${unit}`,
                }),
              ...((row.newData.hasOwnProperty('e_snow_enabled') ||
                row.newData.hasOwnProperty('e_snow_trigger')) && {
                snowSensor:
                  row.newData.e_snow_enabled || row.newData.e_snow_trigger
                    ? row.newData.e_snow_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('scheduleAdd') && {
                heatingSchedule: row.newData.scheduleAdd?.startDate
                  ? `ready ${
                      isF
                        ? convertCelsiusToFahrenheit(
                            row.newData.scheduleAdd.threshold
                          )
                        : row.newData.scheduleAdd.threshold
                    }${unit}` +
                    ` | ${moment(row.newData.scheduleAdd.startDate).format(
                      'h:mma M/D/YYYY'
                    )}` +
                    ` | ${moment(row.newData.scheduleAdd.endDate).format(
                      'h:mma M/D/YYYY'
                    )}`
                  : 'off',
              }),
              ...(row.prevData.hasOwnProperty('scheduleDelete') && {
                scheduleEnabled: 'off',
              }),
              ...(row.newData.hasOwnProperty('e_schedule_enabled') && {
                scheduleEnabled:
                  row.newData.e_schedule_enabled === 1 ? 'enabled' : 'disabled',
              }),
              ...((row.newData.hasOwnProperty('e_wind_enabled') ||
                row.newData.hasOwnProperty('e_wind_trigger')) && {
                windFactor:
                  row.newData.e_wind_enabled || row.newData.e_wind_trigger
                    ? row.newData.e_wind_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('e_freeze') && {
                freeze: row.newData.e_freeze ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('device_active') && {
                deviceActive: row.newData.device_active ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('EBP') && {
                EBP: row.newData.EBP,
              }),
              ...(row?.actionType === 'SSR_RESET' && {
                ssrReset: true,
              }),
              ...(row?.actionType === 'GROUND_RESET' && {
                groundReset: true,
              }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                (row.newData.hasOwnProperty('position') ||
                  row.newData.hasOwnProperty('index')) && {
                  thermocoupleReset: true,
                }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                row.newData.hasOwnProperty('thermocouple') && {
                  thermocoupleForce: row.newData.thermocouple.fault_mode,
                }),
              commandNumber: row.newData?.commandNumber,
            },
          }
        : {
            parameters: {
              ...(row.newData.hasOwnProperty('on_switch') && {
                instantHeat: row.newData.on_switch
                  ? `active ${
                      row.newData.instant_temp &&
                      (isF
                        ? convertCelsiusToFahrenheit(row.newData.instant_temp)
                        : row.newData.instant_temp)
                    }${unit}`
                  : 'off',
              }),
              ...(!row.newData.hasOwnProperty('on_switch') &&
                row.newData.hasOwnProperty('instant_temp') &&
                row.prevData.hasOwnProperty('instant_temp') && {
                  instantHeatChangeTemp: `from ${row.prevData.instant_temp}${unit} to ${row.newData.instant_temp}${unit}`,
                }),
              ...((row.newData.hasOwnProperty('snow_enabled') ||
                row.newData.hasOwnProperty('snow_trigger')) && {
                snowSensor:
                  row.newData.snow_enabled || row.newData.snow_trigger
                    ? row.newData.snow_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('scheduleAdd') && {
                heatingSchedule: row.newData.scheduleAdd?.startDate
                  ? `ready ${
                      isF
                        ? convertCelsiusToFahrenheit(
                            row.newData.scheduleAdd.threshold
                          )
                        : row.newData.scheduleAdd.threshold
                    }${unit}` +
                    ` | ${moment(row.newData.scheduleAdd.startDate).format(
                      'h:mma M/D/YYYY'
                    )}` +
                    ` | ${moment(row.newData.scheduleAdd.endDate).format(
                      'h:mma M/D/YYYY'
                    )}`
                  : 'off',
              }),
              ...(row.prevData.hasOwnProperty('scheduleDelete') && {
                scheduleEnabled: 'off',
              }),
              ...(row.newData.hasOwnProperty('schedule_enabled') && {
                scheduleEnabled:
                  row.newData.schedule_enabled === 1 ? 'enabled' : 'disabled',
              }),
              ...((row.newData.hasOwnProperty('wind_enabled') ||
                row.newData.hasOwnProperty('wind_trigger')) && {
                windFactor:
                  row.newData.wind_enabled || row.newData.wind_trigger
                    ? row.newData.wind_enabled
                      ? 'ready'
                      : 'active'
                    : 'off',
              }),
              ...(row.newData.hasOwnProperty('freeze') && {
                freeze: row.newData.freeze ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('device_active') && {
                deviceActive: row.newData.device_active ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('fan') && {
                fan: row.newData.fan ? 'on' : 'off',
              }),
              ...(row.newData.hasOwnProperty('EBP') && {
                EBP: row.newData.EBP,
              }),
              ...(row?.actionType === 'SSR_RESET' && {
                ssrReset: true,
              }),
              ...(row?.actionType === 'GROUND_RESET' && {
                groundReset: true,
              }),
              ...(row?.actionType === 'HPLP_RESET' && {
                Hp_LpReset: true,
              }),
              ...(row?.actionType === 'TIMEOUT_RESET' && {
                timeOutReset: true,
              }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                (row.newData.hasOwnProperty('position') ||
                  row.newData.hasOwnProperty('index')) && {
                  thermocoupleReset: true,
                }),
              ...(row?.actionType === 'THERMOCOUPLE_RESET' &&
                row.newData.hasOwnProperty('thermocouple') && {
                  thermocoupleForce: row.newData.thermocouple.fault_mode,
                }),
              commandNumber: row.newData?.commandNumber,
            },
          }),
    };
  });
};

export const auditTrailSettingsDataForamt = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return [];

  // Step 1: Sort the array by user ID
  const sortedData = data.sort((a, b) => a.row.userId - b.row.userId);

  // Step 2: Initialize the result array
  const userLoginLogs = [];

  for (let i = 0; i < sortedData.length; i++) {
    const currentRow = sortedData[i].row;
    const logObj = { login: null, logout: null };

    if (currentRow?.newData.login === true) {
      // Check if the next object exists and has login as false
      if (
        i < sortedData.length - 1 &&
        sortedData[i + 1].row.newData.login === false
      ) {
        logObj.login = new Date(currentRow.createdAt);
        logObj.logout = new Date(sortedData[i + 1].row.createdAt);
        i++; // Skip the next object
      } else {
        // If the next object has login as true or it doesn't exist
        logObj.login = new Date(currentRow.createdAt);
      }
    } else if (currentRow?.newData.login === false) {
      // Check if the previous object exists and has login as true
      if (i > 0 && sortedData[i - 1]?.row.newData.login === true) {
        logObj.login = new Date(sortedData[i - 1].row.createdAt);
        logObj.logout = new Date(currentRow.createdAt);
      } else {
        // If there is no previous login event, assume it's a logout event
        logObj.logout = new Date(currentRow.createdAt);
      }
    }

    userLoginLogs.push(logObj);
  }

  return userLoginLogs;
};
export const getDeviceIdsByLocationData = (locations) => {
  const deviceIds = [];
  Object.values(locations).forEach((location) => {
    deviceIds.push(...Object.keys(location));
  });
  const result = [...new Set(deviceIds)];
  return result;
};

export const getLocationAssignedUsersByDeviceIds = (
  deviceIds,
  allLocations
) => {
  const assignedUsers = [];
  deviceIds.forEach((deviceId) => {
    assignedUsers
      .push
      // ...getLocationDataByDeviceId(deviceId, allLocations).assignUsers
      ();
  });
  return [...new Set(assignedUsers.flat())];
};

export const machineAuditTrailActionsFormat = (
  actionsArray,
  allUsersArray,
  isF
) => {
  if (!actionsArray) return [];
  const unit = isF ? `°F` : `°C`;
  return actionsArray?.map(({ row, ...restProps }) => {
    let userData = allUsersArray.find((user) => user?.user_id === row?.userId);
    let number = row.newData?.commandNumber ?? 0;
    let commandNumber = `${createCommandTitle(
      row?.actionType,
      row?.deviceType,
      row?.isLCD
    )}-${userData.user_code}-${moment(row.createdAt).format('DDMMYY')}-${
      number < 10 ? `${'0' + number} ` : number
    }`;
    return {
      id: commandNumber,
      userName: userData?.username,
      time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
      parameters: {
        instantHeat: row.newData.on_switch
          ? `active ${
              isF
                ? convertCelsiusToFahrenheit(row.newData.instant_temp)
                : row.newData.instant_temp
            }${unit}`
          : null,
        fanOnly: row.newData.fan ? 'ready' : null,
        optionalConstantTemp: row.newData.on_constant
          ? `ready ${
              isF
                ? convertCelsiusToFahrenheit(row.newData.constant_temp)
                : row.newData.constant_temp
            }${unit}`
          : null,
        snowSensor: row.newData.snow_enabled ? 'ready' : null,
        heatingSchedule: row.newData.schedule?.startDate
          ? `ready ${
              isF
                ? convertCelsiusToFahrenheit(row.newData.schedule.threshold)
                : row.newData.schedule.threshold
            }${unit}` +
            `|${row.newData.schedule.startDate}` +
            `|${row.newData.schedule.endDate}`
          : null,
        windFactor: row.newData.wind ? 'ready' : null,
      },
    };
  });
};

export const machineAuditTrailFaultsFormat = (faultsArray, allUsersArray) => {
  const Formatedfaults = [];
  if (!faultsArray || !allUsersArray) return [];
  faultsArray?.forEach(({ row, ...restProps }) => {
    row?.deviceIds?.forEach((deviceId) => {
      const userData = allUsersArray.find(
        (user) => user?.user_id === row?.userId
      );
      const userName = userData?.username;
      const userTitle = userData?.user_role;
      // tes faults
      if (
        row?.newData?.hasOwnProperty('e_ssr_fault') &&
        row.newData?.e_ssr_fault?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'ssr fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('e_thermocouple_fault') &&
        row.newData?.e_thermocouple_fault?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'thermocouple fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }
      if (
        row?.newData?.hasOwnProperty('e_ground_fault') &&
        row.newData?.e_ground_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'ground fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('e_srr_over_current') &&
        row.newData?.e_srr_over_current?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'ssr over current',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }
      // ess faults

      if (
        row?.newData?.hasOwnProperty('ssr_fault') &&
        row.newData?.ssr_fault?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'ssr fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('thermocouple_fault') &&
        row.newData?.thermocouple_fault?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'thermocouple failure',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }
      if (
        row?.newData?.hasOwnProperty('ground_fault') &&
        row.newData?.ground_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'ground fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('srr_over_current') &&
        row.newData?.srr_over_current?.includes(1)
      ) {
        Formatedfaults.push({
          fault: 'ssr over current',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      // tgs faults
      if (
        row?.newData?.hasOwnProperty('bms_fault') &&
        row.newData?.bms_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'bms fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('hplp_fault') &&
        row.newData?.hplp_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'hp/lp fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }
      if (
        row?.newData?.hasOwnProperty('thermocouple_fault') &&
        row.newData?.thermocouple_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'thermocouple fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }

      if (
        row?.newData?.hasOwnProperty('timeout_fault') &&
        row.newData?.timeout_fault == 1
      ) {
        Formatedfaults.push({
          fault: 'timeout fault',
          userName: userName,
          title: userTitle,
          comment: [''],
          time: moment(row.createdAt).format('h:mma - DD/MM/YYYY'),
        });
      }
    });
  });
  return Formatedfaults;
};

export const countdownTimer = (time) => {
  const duration = moment.duration(time, 'seconds');
  const countdown = {
    hours:
      duration._data.hours + duration._data.days * 24 < 10
        ? '0' + duration.hours()
        : duration._data.hours + duration._data.days * 24,
    minutes:
      duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes(),
    seconds:
      duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds(),
  };
  return `${countdown.hours}:${countdown.minutes}:${countdown.seconds}`;
};

export const getGraphTypeKey = (graphType) => {
  let result;
  switch (graphType) {
    case 'heater_graph':
      result = 'heaterGraphData';
      break;
    case 'enclosure_graph':
    case 'gas_enclosure_graph':
      result = 'enclosureGraphData';
      break;
    case 'outside_graph':
      result = 'outsideGraphData';
      break;
    case 'gas_graph':
      result = 'gasGraphData';
      break;
    case 'snow_graph':
    case 'gas_snow_graph':
      result = 'snowGraphData';
      break;
    case 'wind_graph':
    case 'gas_wind_graph':
      result = 'windGraphData';
      break;
    case 'energy':
    case 'fuel':
      result = 'energyGasConsumptionGraphData';
      break;
  }
  return result;
};

export const formatDateXAxis = (intervalUnit) => {
  let result;
  switch (intervalUnit) {
    case 'months':
      result = 'MMM';
      break;
    case 'weeks':
      result = 'ww';
    case 'days':
      result = 'DD';
      break;
    case 'hours':
      result = 'HH';
      break;
    case 'minutes':
      result = 'mm';
      break;
  }
  return result;
};

export const formatDateTooltip = (intervalUnit) => {
  let result;
  switch (intervalUnit) {
    case 'months':
    case 'weeks':
      result = 'MMMM YYYY';
      break;
    case 'days':
      result = 'MMMM dddd DD, YYYY';
      break;
    case 'hours':
    case 'minutes':
      result = 'MMMM dddd DD, YYYY - hh:mm a';
      break;
  }
  return result;
};

export const getAuditTrailActionTitle = (
  actionType,
  deviceType,
  isLCD = null
) => {
  const actionTypeTitles = {
    MASTER_CONTROL: {
      ESS: 'ESS-MASTER CONTROL ACTION',
      TES: 'TES-MASTER CONTROL ACTION',
      default: 'TGS-MASTER CONTROL ACTION',
    },
    GLOBAL_MASTER_CONTROL: 'MASTER CONTROL ACTION',
    FAST_MASTER_CONTROL: {
      ESS: 'ESS-QUICK MASTER CONTROL ACTION',
      TES: 'TES-QUICK MASTER CONTROL ACTION',
      default: 'TGS-QUICK MASTER CONTROL ACTION',
    },
    LOCAL_MASTER_CONTROL: {
      ESS: 'ESS-LOCATION CONTROL ACTION',
      TES: 'TES-LOCATION CONTROL ACTION',
      default: 'TGS-LOCATION CONTROL ACTION',
    },
    /*     
    'HPLP_RESET',
    'LOAD_EXCEED_RESET',
    'BMS_RESET', 
    */
    SSR_RESET: isLCD ? 'SSR FAULT LCD ACTION' : 'SSR FAULT ACTION',
    THERMOCOUPLE_RESET: isLCD
      ? 'THERMOCOUPLE FAILURE LCD ACTION'
      : 'THERMOCOUPLE FAILURE ACTION',
    GROUND_RESET: isLCD ? 'GROUND FAULT ACTION' : 'GROUND FAULT LCD ACTION',
    TIMEOUT_RESET: isLCD
      ? 'TIME OUT FAULT LCD ACTION'
      : 'TIME OUT FAULT ACTION',
    HPLP_RESET: isLCD
      ? 'HIGH PRESSURE/LOW PRESSURE FAULT LCD ACTION'
      : 'HIGH PRESSURE/LOW PRESSURE FAULT ACTION',
    GLOBAL_TELEMETRY_OVERVIEW: 'GLOBAL SYSTEM TELEMETRY OVERVIEW ACTION',
    GLOBAL_DATA_TELEMETRY_OVERVIEW: 'GLOBAL SYSTEM TELEMETRY OVERVIEW ACTION',
    AUDIT_TRAIL: 'AUDIT TRAIL ACTION',
    ACTION: {
      ESS: isLCD ? 'ESS-LCD CONTROL ACTION' : 'ESS-SWITCH CONTROL ACTION',
      TES: isLCD ? 'TES-LCD CONTROL ACTION' : 'TES-SWITCH CONTROL ACTION',
      default: isLCD ? 'TGS-LCD CONTROL ACTION' : 'TGS-SWITCH CONTROL ACTION',
    },
    SETTING: 'SETTINGS ACTION',
    HEAT_CONFIGURATION: 'SETTINGS HEAT LOAD CONFIGURATION ACTION',
  };

  const actionTitle = actionTypeTitles[actionType] || '';

  if (typeof actionTitle === 'string') {
    return actionTitle;
  } else if (typeof actionTitle === 'object') {
    return actionTitle[deviceType] || actionTitle.default || '';
  }

  return '';
};

export const createCommandTitle = (
  actionType = '',
  deviceType = '',
  isLCD = null
) => {
  const actionTypeTitles = {
    MASTER_CONTROL: {
      ESS: 'ESS-MC/A',
      TES: 'TES-MC/A',
      default: 'TGS-MC/A',
    },
    GLOBAL_MASTER_CONTROL: 'MC/A',
    FAST_MASTER_CONTROL: {
      ESS: 'ESS-QUICK/MC/A',
      TES: 'TES-QUICK/MC/A',
      default: 'TGS-QUICK/MC/A',
    },
    LOCAL_MASTER_CONTROL: {
      ESS: 'ESS-LOC_MC/A',
      TES: 'TES-LOC_MC/A',
      default: 'TGS-LOC_MC/A',
    },
    SSR_RESET: isLCD ? 'SSR_F/A' : 'SSR_F/LCD/A',
    THERMOCOUPLE_RESET: isLCD ? 'T/C_F/LCD/A' : 'T/C_F/A',
    GROUND_RESET: isLCD ? 'GROUND_F/LCD/A' : 'GROUND_F/A',
    TIMEOUT_RESET: isLCD ? 'T_O_F/LCD/A' : 'T_O_F/A',
    HPLP_RESET: isLCD ? 'HP/LP_F/LCD/A' : 'HP/LP_F/A',
    GLOBAL_TELEMETRY_OVERVIEW: 'GSTO/A',
    GLOBAL_DATA_TELEMETRY_OVERVIEW: 'GSTO_DATA/A',
    AUDIT_TRAIL: 'AT/A',
    ACTION: {
      ESS: 'ESS-SWT_C/A',
      TES: 'TES-SWT_C/A',
      default: 'TGS-SWT_C/A',
    },
    SETTING: 'SET/A',
    HEAT_CONFIGURATION: 'SET/A',
  };

  const actionTitle = actionTypeTitles[actionType] || '';

  if (typeof actionTitle === 'string') {
    return actionTitle;
  } else if (typeof actionTitle === 'object') {
    return actionTitle[deviceType] || actionTitle.default || '';
  }

  return '';
};

export const getConsumptionValue = (swtName, value, isF) => {
  return swtName === 'tgs'
    ? Math.round((isF ? value : value * 0.0283168) * 10) / 10
    : Math.round(value * 10) / 10;
};

export const getSelectedDeviceIds = (
  masterControlSelects,
  swtSwitch,
  swtName
) => {
  return masterControlSelects[swtName].isMachineSelected
    .map((arr, idxArr) => {
      return arr.map((el, edxEl) => {
        if (Array.isArray(el)) {
          if (el.some(Boolean)) {
            return Object.keys(
              Object.values(Object.values(swtSwitch)[idxArr].subLocations)[
                edxEl
              ].devices
            );
          }
        } else if (el) {
          const location = Object.values(swtSwitch)[idxArr]?.devices;
          return Object.keys(location)[edxEl];
        }
        return false;
      });
    })
    .flat()
    .filter((el) => el);
};

const getColorBlockChart = (index, swtName) => {
  const isOdd = index % 2 === 1;
  switch (swtName) {
    case 'ess':
      return isOdd ? '#83FFFF' : '#70C7F0';
    case 'tgs':
      return isOdd ? '#FF7800' : '#FFC400';
    case 'tes':
      return isOdd ? '#95FF45' : '#D5FF45';
  }
};

export const getTotalSearchValues = (data, type, swtName, isF, isDc) => {
  return Math.floor(
    sum(
      data.map((el) => {
        const machine = isDc ? el : el.data;
        return sum(
          machine
            .filter((el) => typeof el.startTime === 'number' || el.start_date)
            .map((el) => {
              switch (type) {
                case 'hourOfUsage':
                  return Math.floor((el.hourOfUsage || 0) / 3600);
                case 'consumption':
                  return getConsumptionValue(swtName, el.consumption, isF);
                case 'total':
                  return Math.floor(el.total || 0);
              }
            })
        );
      })
    )
  );
};

export const getTotalMachineValues = (data, type, swtName, isF) => {
  return Math.floor(
    sum(
      data
        .filter((el) => typeof el.startTime === 'number' || el.start_date)
        .map((el) => {
          switch (type) {
            case 'hourOfUsage':
              return Math.floor((el.hourOfUsage || 0) / 3600);
            case 'consumption':
              return getConsumptionValue(swtName, el.consumption, isF);
            case 'total':
              return Math.floor(el.total || 0);
          }
        })
    )
  );
};

export const formatTelemetryChartData = (data, swtName, swtSwitch, isF) => {
  const color =
    swtName === 'ess' ? '#83FFFF' : swtName === 'tgs' ? '#FF7800' : '#95FF45';

  const intervalData = data.map((machine) => {
    const machineData = getLocationDataByDeviceId(machine.deviceId, swtSwitch)[
      machine.deviceId
    ];
    if(isEmpty(machineData)){
      return {
        machine: machine.deviceId,
        switch: `unassigned`,
        totalConsumption: 0,
        totalUsageHours: 0,
        barColor: color,
      };
    }

    return {
      machine: machine.deviceId,
      switch: `${machineData.locationName} - ${machineData.machineName}`,
      totalConsumption: getTotalMachineValues(
        machine.data,
        'consumption',
        swtName,
        isF
      ),
      totalUsageHours: getTotalMachineValues(machine.data, 'hourOfUsage'),
      barColor: color,
      ...machine.data
        .filter((el) => typeof el.startTime === 'number')
        .map((el, index) => {
          const intervalName = el.startTime;
          return {
            [intervalName]: getConsumptionValue(swtName, el.consumption, isF),
            [`${intervalName}TEC`]: `${getConsumptionValue(
              swtName,
              el.consumption,
              isF
            )} kw`,
            [`${intervalName}THU`]: `${Math.floor(
              (el.hourOfUsage || 0) / 3600
            )} hours`,
            [`${intervalName}Color`]: getColorBlockChart(index, swtName),
          };
        })
        .reduce((cur, result) => {
          return { ...result, ...cur };
        }, {}),
    };
  });

  const intervalKeys = [
    ...new Set(
      data
        .map((machine) => {
          return machine.data
            .filter((el) => typeof el.startTime === 'number')
            .map((el) => el.startTime);
        })
        .flat()
    ),
  ].sort();

  return {
    intervalData,
    intervalKeys,
  };
};

export const getMachineDataByInhandId = (inhandId, swtSwitch) => {
  for (const location in swtSwitch) {
    for (const machine in swtSwitch[location]) {
      if (swtSwitch[location][machine].inhandId === inhandId) {
        return swtSwitch[location][machine];
      }
    }
  }
};

export const getAllSpecificLocationNames = (data) => {
  const allSpecificLocationsName = [];
  data &&
    Object.values(data).forEach((value) => {
      if (value.isSpecificLocation) {
        allSpecificLocationsName.push(Object.keys(value.subLocations));
      }
    });
  return allSpecificLocationsName;
};

export const getSpecLocationHandler = (data) => {
  return Object.values(data).filter((location) =>
    Object.values(location).some((el) => !el.deviceMac)
  );
};

export const transformSpecificLocationData = (data, scope) => {
  const filteredData = Object.entries(data).filter(
    ([key, value]) => key === scope
  )[0];
  return { [filteredData[0]]: filteredData[1] };
};

export const getSpecificLocationNameOfALocation = (location) => {
  const allSpecificLocationsName = [];
  location &&
    Object.entries(location).forEach(([key, value]) => {
      if (Object.values(value)[0]?.deviceMac && Object.keys(value).length > 0) {
        allSpecificLocationsName.push(key);
      }
    });
  return allSpecificLocationsName;
};

export const extractSwtSize = (name) => {
  if (name) {
    return name.match(/\d+/g);
  } else {
    return '';
  }
};
export const extractApplicationAbr = (name) => {
  if (name) {
    return name
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter((word) => word && word.trim() !== '')
      .reduce((prev, word) => {
        if (prev) {
          return `${prev}.${word.charAt(0).toLowerCase()}`;
        }
        return word.charAt(0).toLowerCase();
      }, '');
  } else {
    return '';
  }
};

export const filteredSuggestionsHandler = (list, locations, inputValue) => {

  
  if (!list || !locations.all || !inputValue) {
    return [];
  }

  return list.filter(suggestion => {
 
    
    const parts = suggestion.split(' - ');
 
    // Convert parts to searchable names
    const searchableNames = parts.map((part, index) => {
      const locationData = locations.all[part];

      // Handle first part (location)
      if (index === 0) {
        // Check if it's a specific location
        if (locationData?.parent_location_id != null) {
          const parentLocation = locations.all[locationData.parent_location_id];
       
          const specificLocation = parentLocation?.specific_location?.find(
            spec => spec.zone_id === part
          );

            if (!specificLocation) {
            return locationData.locationName || "";
          }
 
        
       
        //  return [...names, specificLocation?.zone_name || ''];
         const names= specificLocation?.devices?.map(device => device.device_name);
          
          return [...names,specificLocation.zone_name];
        }
      
        // Regular location
        return locationData?.locationName || '';
      }
      
      // Handle subsequent parts (devices/machines)
      return locationData?.machineName || '';
    });


    // Join names and check if includes search input
    const searchableString = searchableNames
      .flat()
      .filter(Boolean)
      .join(' - ')
      .toUpperCase();
    return searchableString.includes(inputValue.toUpperCase());
  });
};

export const getFormattedMachineName = (swtData) => {
  const locations = Object.keys(swtData).map((location) =>
    Object.entries(swtData[location]).flatMap(([key, el]) => {
      if (el.deviceMac) {
        return `${location} - ${key}`;
      } else {
        return Object.keys(swtData[location][key]).flatMap(
          (machine) => `${location} - ${key} - ${machine}`
        );
      }
    })
  );

  return locations.reduce((acc, cur) => acc.concat(cur), []);
};


const extractAllowedSettings = (role) => {
  return Object.keys(ROLE_PERMISSIONS.ALLOWED_SETTINGS).filter((setting) =>
    ROLE_PERMISSIONS.ALLOWED_SETTINGS[setting].includes(role)
  );
};
export const checkUserPermissions = (role) => {
  const permissions = {};
  for (const [key, value] of Object.entries(ROLE_PERMISSIONS)) {
    if (key === 'ALLOWED_SETTINGS') {
      permissions[key] = extractAllowedSettings(role);
    } else {
      permissions[key] = value.includes(role);
    }
  }
  return permissions;
};
export const getWifiAlertStatusHandler = (
  switchData,
  accessKey,
  location,
  noSpecificLocation,
  accessSpecificLocation
) => {
  const gpEbpArray = [];
  let gpEbpState = null;

  if (noSpecificLocation) {
    let systemData;
   if (accessSpecificLocation) {
     
      systemData = location?.[1]?.[switchData] || [];
    } else {
   
      systemData = Object.values(location || {})?.[0]?.[switchData] || [];
    }

    gpEbpState =
      systemData?.length > 0
        ? systemData
            .map((el) =>
              Object.values(el).some(
                (gpEbp) => gpEbp.gpEbpWifiAlertStatus[accessKey] === true
              )
            )
            .some((value) => value === true)
        : null;
  } else {
    gpEbpState = Object.values(location)
      .flatMap((specificLocationEl) => {
        const systemData = Object.values(specificLocationEl)[0][switchData];

        return systemData?.length > 0
          ? systemData
              .map(
                (machine) =>
                  Object.values(machine)[0].gpEbpWifiAlertStatus[accessKey]
              )
              .some((status) => status === true)
          : null;
      })
      .some((value) => value === true);
  }

  if (gpEbpState !== null) {
    gpEbpArray.push(gpEbpState);
  }
  return gpEbpArray;
};

export const getFaultsAlertsHandler = (data) => {
  const filteredData = data.filter((switchEl) =>
    switchEl[1].machines
      ? switchEl[1].machines.length > 0
      : switchEl[1].length > 0
  );

  const faultsState = filteredData.map((el) => {
    return el[1].some((el) => {
      if (el.machines) {
        return el.machines.some((machine) => {
          return (
            Object.values(machine)[1].gpEbpWifiAlertStatus.isFault === true
          );
        });
      } else {
        return Object.values(el)[0].gpEbpWifiAlertStatus.isFault === true;
      }
      // return Object.values(el)[0].gpEbpWifiAlertStatus.isFault === true;
    });
  });
  return { faultsState, filteredData };
};
