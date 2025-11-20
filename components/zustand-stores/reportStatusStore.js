import { createStore } from './storeUtils';
import { calculateTotalEnergyConsumption } from '../../helpers/helpers';

const tgsInitialState = {
  isSystemEnabled: true,
  isMachineEnabled: false,
  systemEnergyConsump: 'total energy consumption 1750 kw',
  totalEnergyConsump: 'total energy consumption 350 kw',
  data: [
    [
      { 'set temp.': '300' },
      { 'current temp': '298' },
      { 'e.consump.': '1.94' },
    ],
    [
      { 'enclosure temp.': '19' },
      { 'outside temp.': '-25' },
      { 'hours of usage': '180' },
    ],
  ],
  gpEbpWifiAlertStatus: {
    isFault: false,
    isGp: false,
    isEbp: false,
    isWifi: true,
  },
  machineControllersStatus: {
    instantHeat: { isReady: false, isActive: false },
    snowSensor: { isReady: false, isActive: false },
    windFactor: { isReady: false, isActive: false },
    heatingSchedule: { isReady: false, isActive: false },
    constantTemp: { isReady: false, isActive: false },
  },
};

const initialState = {
  isSystemEnabled: true,
  isMachineEnabled: true,
  systemEnergyConsump: 'total energy consumption 1750 kw',
  totalEnergyConsump: 'total energy consumption 350 kw',
  data: [
    [
      { 'set temp.': '300' },
      { 'current temp': '298' },
      { 'e.consump.': '1.94' },
    ],
    [
      { 'enclosure temp.': '19' },
      { 'outside temp.': '-25' },
      { 'hours of usage': '180' },
    ],
  ],
  gpEbpWifiAlertStatus: {
    isFault: false,
    isGp: false,
    isEbp: false,
    isWifi: false,
  },
  machineControllersStatus: {
    instantHeat: { isReady: false, isActive: false },
    snowSensor: { isReady: false, isActive: false },
    windFactor: { isReady: false, isActive: false },
    heatingSchedule: { isReady: false, isActive: false },
    constantTemp: { isReady: false, isActive: false },
  },
};

const getMachines = (switchData, location, machineType, isF) => {
  const gas = isF ? 'FT³' : 'M³';
  const unit = machineType === 'tgs' ? gas : 'kw';

  const systemConsumption = () => {
    let total = 0;
    if(!switchData.isSpecificLocation){
      Object.keys(switchData.devices).forEach((machine) => {
        total += +calculateTotalEnergyConsumption(switchData.devices[machine].reading, machineType, isF) || 0;
      });
    }else{
      Object.keys(switchData.subLocations).forEach((subLocation) => {
        Object.keys(switchData.subLocations[subLocation].devices).forEach((machine) => {
          total += +calculateTotalEnergyConsumption(switchData.subLocations[subLocation].devices[machine].reading, machineType, isF) || 0;
        })
      })
    }
    return total === 0 ? '--' : total;
  }

  if(!switchData.isSpecificLocation){
    return Object.keys(switchData.devices).map((machine) => {
      const machineData = switchData.devices[machine];
      const consumption = calculateTotalEnergyConsumption(machineData.reading, machineType, isF)
      return {
        [machine]: {
          ...initialState,
          ...machineData,
          location,
          isSystemEnabled: true,
          isMachineEnabled: !machineData.isOff,
          systemEnergyConsump: `total energy consumption ${systemConsumption()} ${unit}`,
          totalEnergyConsump: `total energy consumption ${consumption} ${unit}`,
          data: [
            [
              { 'set temp.': machineData.setTemp },
              { 'current temp': machineData.currentTemp },
              { 'e.consump.': machineData.consumption },
            ],
            [
              { 'enclosure temp.': machineData.enclosureTemp },
              { 'outside temp.': machineData.outSideTemp },
              { 'hours of usage': machineData.hoursOfUsage },
            ],
          ],
          gpEbpWifiAlertStatus: {
            isFault: machineData.isFaults,
            isGp: machineData.isGp,
            isEbp: machineData.isEbp,
            isWifi: machineData.isWifi,
          },
          machineControllersStatus: {
            instantHeat: {
              ...machineData.instantHeat,
              isActive: machineData.instantHeat.isActivated,
            },
            snowSensor: {
              ...machineData.snowSensor,
              isActive: machineData.snowSensor.isActivated,
            },
            windFactor: {
              ...machineData.windFactor,
              isActive: machineData.windFactor.isActivated,
            },
            heatingSchedule: {
              ...machineData.heatingSchedule,
              isActive: machineData.heatingSchedule.isActivated,
            },
            constantTemp: {
              ...machineData.optionalConstantTemp,
              isActive: machineData.optionalConstantTemp.isActivated,
            },
            fanOnly: machineData.fanOnly,
          },
        }
      }
    })
  }else{
    return Object.keys(switchData.subLocations).map((subLocation) => {
      const machines = Object.keys(switchData.subLocations[subLocation].devices).map((machine) => {
        const machineData = switchData.subLocations[subLocation].devices[machine];
        const consumption = calculateTotalEnergyConsumption(machineData.reading, machineType, isF);

        return {
          machineName: machine,
          machineDetails: {
            ...initialState,
            ...machineData,
            location,
            isSystemEnabled: true,
            isMachineEnabled: !machineData.isOff,
            systemEnergyConsumption: {
              total: `${systemConsumption()} ${unit}`,
            },
            machineEnergyConsumption: {
              total: `${consumption} ${unit}`,
            },
            temperatureData: {
              setTemperature: machineData.setTemp,
              currentTemperature: machineData.currentTemp,
              energyConsumption: machineData.consumption,
            },
            environmentalData: {
              enclosureTemperature: machineData.enclosureTemp,
              outsideTemperature: machineData.outSideTemp,
              hoursOfUsage: machineData.hoursOfUsage,
            },
            alertStatus: {
              fault: machineData.isFaults,
              gp: machineData.isGp,
              ebp: machineData.isEbp,
              wifi: machineData.isWifi,
            },
            controllerStatus: {
              instantHeat: {
                ...machineData.instantHeat,
                isActive: machineData.instantHeat.isActivated,
              },
              snowSensor: {
                ...machineData.snowSensor,
                isActive: machineData.snowSensor.isActivated,
              },
              windFactor: {
                ...machineData.windFactor,
                isActive: machineData.windFactor.isActivated,
              },
              heatingSchedule: {
                ...machineData.heatingSchedule,
                isActive: machineData.heatingSchedule.isActivated,
              },
              constantTemperature: {
                ...machineData.optionalConstantTemp,
                isActive: machineData.optionalConstantTemp.isActivated,
              },
              fanOnly: machineData.fanOnly,
            },
          },
        };
      });

      return {
        subLocationName: subLocation,
        machines,
      };
    });
  }
}

const useReportStatusStore = createStore('reportStatus', (set) => ({
  allLocations: [
    {
      'mbta - bet east yard boston massachusetts - 10 switches': {
        essSwitches: [
          { 'bet east - 01 # 10 s.t. - ess': initialState },
          { 'bet east - 02 # 10 s.t. - ess': initialState },
          { 'bet east - 03 # 10 s.t. - ess': initialState },
          { 'bet east - 04 # 10 s.t. - ess': initialState },
          { 'bet east - 05 # 10 s.t. - ess': initialState },
        ],
        tgsSwitches: [
          { 'mtl east - 01 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl east - 02 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl east - 03 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl east - 04 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl east - 05 # 20 s.t. - tgs': tgsInitialState },
        ],
        tesSwitches: [],
      },
    },
    {
      'mbta - bet west yard boston massachusetts - 10 switches': {
        essSwitches: [
          { 'bet west - 01 # 10 s.t. - ess': initialState },
          { 'bet west - 02 # 10 s.t. - ess': initialState },
          { 'bet west - 03 # 10 s.t. - ess': initialState },
          { 'bet west - 04 # 10 s.t. - ess': initialState },
          { 'bet west - 05 # 10 s.t. - ess': initialState },
        ],
        tgsSwitches: [
          { 'mtl west - 01 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl west - 02 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl west - 03 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl west - 04 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl west - 05 # 20 s.t. - tgs': tgsInitialState },
        ],
        tesSwitches: [],
      },
    },
    {
      'mbta - south coast montreal - 9 switches': {
        essSwitches: [],
        tgsSwitches: [
          { 'mtl south - 01 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl south - 02 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl south - 03 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl south - 04 # 20 s.t. - tgs': tgsInitialState },
          { 'mtl south - 05 # 20 s.t. - tgs': tgsInitialState },
        ],
        tesSwitches: [
          { 'bet south - 01 # 10 s.t. - tes': initialState },
          { 'bet south - 02 # 10 s.t. - tes': initialState },
          { 'bet south - 03 # 10 s.t. - tes': initialState },
        ],
      },
    },
    {
      'mbta - south coast yard boston massachusetts - 10 switches': {
        essSwitches: [
          { 'south coast - 01 # 10 s.t. - ess': initialState },
          { 'south coast - 02 # 10 s.t. - ess': initialState },
          { 'south coast - 03 # 10 s.t. - ess': initialState },
          { 'south coast - 04 # 10 s.t. - ess': initialState },
          { 'south coast - 05 # 10 s.t. - ess': initialState },
        ],
        tgsSwitches: [
          { 'south coast - 01 # 20 s.t. - tgs': tgsInitialState },
          { 'south coast - 02 # 20 s.t. - tgs': tgsInitialState },
          { 'south coast - 03 # 20 s.t. - tgs': tgsInitialState },
          { 'south coast - 04 # 20 s.t. - tgs': tgsInitialState },
          { 'south coast - 05 # 20 s.t. - tgs': tgsInitialState },
        ],
        tesSwitches: [],
      },
    },
  ],

  setReportStatus: ({ essSwitch, tgsSwitch, tesSwitch, isF }) => set((state) => {
    const locations = [...new Set([...Object.keys(essSwitch), ...Object.keys(tgsSwitch), ...Object.keys(tesSwitch)])];
    state.allLocations = locations.map((location) => {
      return {
        [location]: {
          essSwitches: essSwitch[location] ? getMachines(essSwitch[location], location, 'ess', isF) : [],
          tgsSwitches: tgsSwitch[location] ? getMachines(tgsSwitch[location], location, 'tgs', isF) : [],
          tesSwitches: tesSwitch[location] ? getMachines(tesSwitch[location], location, 'tes', isF) : [],
        }
      }
    });
  }),
}));

export default useReportStatusStore;
