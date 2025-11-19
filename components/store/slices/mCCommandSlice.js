import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  convertCelsiusToFahrenheit,
  getLocationsMachinesName,
} from '../../../helpers/helpers';

const initialState = {
  commandsInfo: {
    8983061444921505: [],
    dav: [
      // {
      //   'mca-dav-020622-01': {
      //     system: 'tgs-typhoon gas system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      // specificLocations:[['specLocation1'],[],['specLocation2']],
      //     machines: [
      //       [
      //         'bet-east01',
      //         'bet-east02',
      //         'bet-east03',
      //         'bet-east04',
      //         'bet-east05',
      //       ],
      //       [
      //         'bet-west01',
      //         'bet-west02',
      //         'bet-west03',
      //         'bet-west04',
      //         'bet-west05',
      //       ],
      //       [
      //         'south-coast01',
      //         'south-coast02',
      //         'south-coast03',
      //         'south-coast04',
      //         'south-coast05',
      //       ],
      //     ],
      //     // ats: selections,
      //     parameters: {
      //       instantHeat: 'active 300°C ',
      //       fanOnly: '',
      //       snowSensor: '',
      //       heatingSchedule: '',
      //       windFactor: '',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-02': {
      //     system: 'tes-typhoon gas system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east01', 'bet-east02'],
      //       ['bet-west01', 'bet-west02', 'bet-west03', 'bet-west04'],
      //       ['south-coast01', 'south-coast02', 'south-coast03'],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 300°C',
      //       optionalConstantTemp: 'ready 150°C',
      //       snowSensor: 'ready 350°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 250°C',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-03': {
      //     system: 'ess-typhoon electric system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east01', 'bet-east03', 'bet-east04', 'bet-east05'],
      //       ['bet-west04', 'bet-west05'],
      //       [
      //         'south-coast01',
      //         'south-coast02',
      //         'south-coast04',
      //         'south-coast05',
      //       ],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 300°C',
      //       optionalConstantTemp: 'ready 150°C',
      //       snowSensor: 'ready 350°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 250°C',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-04': {
      //     system: 'ess-typhoon electric system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east05'],
      //       ['bet-west01', 'bet-west02', 'bet-west05'],
      //       ['south-coast04', 'south-coast05'],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 375°C',
      //       optionalConstantTemp: 'ready 100°C',
      //       snowSensor: 'ready 450°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 350°C',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-05': {
      //     system: 'ess-typhoon electric system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east05'],
      //       ['bet-west01', 'bet-west02', 'bet-west05'],
      //       ['south-coast04', 'south-coast05'],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 375°C',
      //       optionalConstantTemp: 'ready 100°C',
      //       snowSensor: 'ready 450°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 350°C',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-06': {
      //     system: 'ess-typhoon electric system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east05'],
      //       ['bet-west01', 'bet-west02', 'bet-west05'],
      //       ['south-coast04', 'south-coast05'],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 375°C',
      //       optionalConstantTemp: 'ready 100°C',
      //       snowSensor: 'ready 450°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 350°C',
      //     },
      //   },
      // },
      // {
      //   'mca-dav-020622-07': {
      //     system: 'ess-typhoon electric system',
      //     switches: '15',
      //     locations: ['bet-east', 'bet-west', 'south-coast'],
      //     machines: [
      //       ['bet-east05'],
      //       ['bet-west01', 'bet-west02', 'bet-west05'],
      //       ['south-coast04', 'south-coast05'],
      //     ],
      //     parameters: {
      //       instantHeat: 'active 375°C',
      //       optionalConstantTemp: 'ready 100°C',
      //       snowSensor: 'ready 450°C',
      //       heatingSchedule: 'ready 450°C',
      //       windFactor: 'ready 350°C',
      //     },
      //   },
      // },
    ],
  },
  viewCommand: false,
  searchedCommand: { command: null, userId: null },
  commandNumber: Number('0'),
  commandDate: '',
  isNewCommandCreated: false,
  commandApplied: false,
  controllersStatus: [false, false, false, false, false],
  controlResetInitialState: false,
};

const DATE = moment().format('DDMMYY');

const mCCommandSlice = createSlice({
  name: 'mCCommand',
  initialState,
  reducers: {
    handleCreateCommand: (state, action) => {
      // increment command number every time a new command has been created
      let totalCommands = 0;
      Object.values(state.commandsInfo).forEach((eachUserCommands) => {
        eachUserCommands.forEach((command) => {
          if (Object.keys(command)[0].split('-')[2] === DATE) {
            return totalCommands++;
          }
        });
      });

      // state.commandNumber = +totalCommands + 1;

      state.isNewCommandCreated = true;

      // sets all the control status to initial state
      state.controllersStatus = [...initialState.controllersStatus];

      if (DATE !== state.commandDate) {
        state.commandDate = DATE;
      }
    },
    handleResetCreateNewCommand: (state) => {
      state.isNewCommandCreated = false;
    },
    handleCommandNumber: (state, action) => {
      state.commandNumber = action.payload;
    },
    handleResetCommandNumber: (state, action) => {
      state.commandNumber = Number('0');
    },
    handleControllersStatus: (state, action) => {
      state.controllersStatus[action.payload] = true;
    },
    handleViewCommand: (state, action) => {
      state.viewCommand = action.payload;
    },
    handleSearchCommand: (state, action) => {
      state.searchedCommand = action.payload;
    },
    handleSaveCommand: (state, action) => {
      // add last command to the list of commandsInfo
      state.commandsInfo[action.payload.user].push(action.payload.commandData);
      state.isNewCommandCreated = false;
    },
    handleApplyCommand: (state, action) => {
      state.commandApplied = action.payload;
    },
    handleControlResetInit: (state, action) => {
      state.controlResetInitialState = action.payload;
    },
    handleCommandInfo: (state, action) => {
      const { data, user, isF, flatEssSwitch, flatTgsSwitch, flatTesSwitch } =
        action.payload;
      const newData = data?.map(({ row: item }) => {
        const date = moment(item.createdAt).format('DDMMYY');
        const commandKey = `mca-${user.user_code}-${date}-${
          item.newData.commandNumber || 0
        }`;
        const unit = isF ? 'F' : 'C';

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
    },
    handleCommandDate: (state, action) => {
      state.commandDate = action.payload;
    },
  },
});

export default mCCommandSlice;
export const selectMCCommand = (state) => state.mCCommand;
export const {
  handleCreateCommand,
  handleViewCommand,
  handleApplyCommand,
  handleSearchCommand,
  handleSaveCommand,
  // handleViewPrevCommandAndCreateNewCommand,
  handleControllersStatus,
  handleControlResetInit,
  handleCommandInfo,
  handleCommandNumber,
  handleResetCommandNumber,
  handleCommandDate,
  handleResetCreateNewCommand,
} = mCCommandSlice.actions;
