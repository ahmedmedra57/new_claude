import { createStore } from './storeUtils';
import moment from 'moment';
import {
  convertCelsiusToFahrenheit,
  getLocationsMachinesName,
} from '../../helpers/helpers';

const DATE = moment().format('DDMMYY');

const useMcCommandStore = createStore('mcCommand', (set) => ({
  commandsInfo: {
    8983061444921505: [],
    dav: [],
  },
  viewCommand: false,
  searchedCommand: { command: null, userId: null },
  commandNumber: 0,
  commandDate: '',
  isNewCommandCreated: false,
  commandApplied: false,
  controllersStatus: [false, false, false, false, false],
  controlResetInitialState: false,

  createCommand: () => set((state) => {
    let totalCommands = 0;
    Object.values(state.commandsInfo).forEach((eachUserCommands) => {
      eachUserCommands.forEach((command) => {
        if (Object.keys(command)[0].split('-')[2] === DATE) {
          totalCommands++;
        }
      });
    });

    state.isNewCommandCreated = true;
    state.controllersStatus = [false, false, false, false, false];

    if (DATE !== state.commandDate) {
      state.commandDate = DATE;
    }
  }),

  resetCreateNewCommand: () => set({ isNewCommandCreated: false }),

  setCommandNumber: (commandNumber) => set({ commandNumber }),

  resetCommandNumber: () => set({ commandNumber: 0 }),

  setControllerStatus: (index) => set((state) => {
    state.controllersStatus[index] = true;
  }),

  setViewCommand: (viewCommand) => set({ viewCommand }),

  setSearchCommand: (searchedCommand) => set({ searchedCommand }),

  saveCommand: ({ user, commandData }) => set((state) => {
    state.commandsInfo[user].push(commandData);
    state.isNewCommandCreated = false;
  }),

  setCommandApplied: (commandApplied) => set({ commandApplied }),

  setControlResetInit: (controlResetInitialState) => set({ controlResetInitialState }),

  setCommandInfo: ({ data, user, isF, flatEssSwitch, flatTgsSwitch, flatTesSwitch }) => set((state) => {
    const unit = isF ? 'F' : 'C';
    const newData = data?.map(({ row: item }) => {
      const date = moment(item.createdAt).format('DDMMYY');
      const commandKey = `mca-${user.user_code}-${date}-${item.newData.commandNumber || 0}`;

      const system =
        item.deviceType === 'ESS'
          ? 'ess-typhoon electric system'
          : item.deviceType === 'TGS'
          ? 'tgs-typhoon gas system'
          : 'tes-typhoon gas system';

      const switches =
        item.deviceType === 'ESS'
          ? flatEssSwitch
          : item.deviceType === 'TGS'
          ? flatTgsSwitch
          : flatTesSwitch;

      const { locations, machines } = getLocationsMachinesName(
        item.deviceIds,
        switches
      );

      return {
        [commandKey]: {
          system,
          switches: item.deviceIds.length,
          locations,
          machines,
          ats:
            item.newData.EBP === 2
              ? { activateTgs: true, reactivate: false, block: false }
              : item.newData.EBP === 1
              ? { activateTgs: false, reactivate: false, block: true }
              : item.newData.EBP === 0
              ? { activateTgs: false, reactivate: true, block: false }
              : { activateTgs: false, reactivate: false, block: false },
          deactivate: {
            instantHeat: item.newData.on_switch === 0,
            isFanOnly: item.newData.fan === 0,
            heatingSchedule: !!item.newData.deleteCurrentSchedule,
            optionalConstantTemp: item.newData.on_constant === 0,
            snowSensor: item.newData.snow_enabled === 0,
            windFactor: item.newData.wind === 0,
          },
          isF,
          parameters: {
            instantHeat: item.newData.on_switch
              ? `active ${
                  isF
                    ? convertCelsiusToFahrenheit(item.newData.instant_temp)
                    : item.newData.instant_temp
                }°${unit}`
              : null,
            optionalConstantTemp: item.newData.on_constant
              ? `ready ${
                  isF
                    ? convertCelsiusToFahrenheit(item.newData.constant_temp)
                    : item.newData.constant_temp
                }°${unit}`
              : null,
            fanOnly: item.newData.fan ? 'ready' : null,
            snowSensor: item.newData.snow_enabled ? 'ready' : null,
            heatingSchedule: item.newData.schedule?.startDate
              ? `ready ${
                  isF
                    ? convertCelsiusToFahrenheit(
                        item.newData.schedule.threshold
                      )
                    : item.newData.schedule.threshold
                }°${unit}` +
                `|${item.newData.schedule.startDate}` +
                `|${item.newData.schedule.endDate}`
              : null,
            windFactor: item.newData.wind ? 'ready' : null,
          },
        },
      };
    });

    state.commandsInfo[user.user_id] = newData;
  }),

  setCommandDate: (commandDate) => set({ commandDate }),
}));

export default useMcCommandStore;
