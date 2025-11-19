import { createSlice } from '@reduxjs/toolkit';
import reduce from 'lodash/reduce';
import { electricalFaultsList, gasFaultsList } from '../../../helpers/helpers';

const initialState = {
  faults: false,
  receivedThermocoupleSetting: [],

  maxHeatTimer: { state: false, time: null },
  displayForceBox: false,

  // 1. maxheat for 72hrs / 2. maxheat for 12hrs / 3. systme off
  selectedForce: null,

  // for button stylings
  isForceButtonClicked: false,
  isForceButtonActivated: false,

  activatedResetButton: { faultType: null, status: false },
  attendButtonClicked: { faultType: null, status: false, faultNumber: null },

  displayForceSelectionBox: false,
  displaySystemTurnOffMessageBox: false,

  resetCounter: 3,
  // storage for written action taken
  actionTaken: [],
};

const faultsSlice = createSlice({
  name: 'faultsState',
  initialState: {
    ess: {
      'bet-east': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
      'bet-west': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
      's.coast': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
      'n-Mountain': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
      },
    },
    tes: {
      'bet-north': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
      },
      'bet-south': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
      },
      'n.coast': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
      },
    },
    tgs: {
      'mtl-east': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
      'mtl-west': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
      'mtl-south': {
        '01': initialState,
        '02': initialState,
        '03': initialState,
        '04': initialState,
        '05': initialState,
      },
    },
    messages: {
      ess: [],
      tes: [],
      tgs: [],
    },
  },
  reducers: {
    handleDisplayForceSelectionBox: (state, action) => {
      // swtName(ess||tes||tgs), location, machine
      const {
        swtName,
        location,
        specificLocation,
        machine,
        state: actionState,
      } = action.payload;
        state[swtName][location][machine].displayForceSelectionBox =
          actionState;

    },

    handleForceSelection: (state, action) => {
      // swtName(ess||tes||tgs), location, machine
      const { swtName, location, specificLocation, machine, selectedOne } =
        action.payload;
        state[swtName][location][machine].selectedForce = selectedOne;
    },

    handleForceButtonClick: (state, action) => {
      // swtName(ess||tes||tgs), location, machine
      const {
        swtName,
        location,
        specificLocation,
        machine,
        state: actionState,
      } = action.payload;
        state[swtName][location][machine].isForceButtonClicked = actionState;
    },

    handleForceButtonActivated: (state, action) => {
      // swtName(ess||tes||tgs), location, machine
      const {
        swtName,
        location,
        specificLocation,
        machine,
        state: actionState,
      } = action.payload;
        state[swtName][location][machine].isForceButtonActivated = actionState;

        // Release force button click state
        state[swtName][location][machine].isForceButtonClicked = false;
    },

    handleTimer: (state, action) => {
      // swtName(ess||tes||tgs), location, machine
      const { swtName, location, specificLocation, machine, time } =
        action.payload;
        state[swtName][location][machine].maxHeatTimer.time = time;

        // Timer on
        state[swtName][location][machine].maxHeatTimer.state = true;

        // Display force box in the graph component
        state[swtName][location][machine].displayForceBox = true;
    },

    handleDisplayForceStatusBox: (state, action) => {
      // display force selection working box
      const { swtName, location, specificLocation, machine } = action.payload;
        state[swtName][location][machine].displayForceBox = true;
    },

    handleFaultsReset: (state, action) => {
      const { swtName, location, specificLocation, machine, faultType } =
        action.payload;
        state[swtName][location][machine].activatedResetButton.faultType =
          faultType;

        state[swtName][location][machine].activatedResetButton.status = true;

        state[swtName][location][machine].isForceButtonClicked = false;

        state[swtName][location][machine].isForceButtonActivated = false;
    },

    handleAttendButtonClick: (state, action) => {
      const {
        swtName,
        location,
        specificLocation,
        machine,
        faultType,
        state: actionState,
        column,
      } = action.payload;
        state[swtName][location][machine].attendButtonClicked.faultType =
          faultType;

        state[swtName][location][machine].attendButtonClicked.status =
          actionState;
        state[swtName][location][machine].attendButtonClicked.column = column;
    },

    handleDisplaySystemTurnOffMessageBox: (state, action) => {
      const {
        swtName,
        location,
        specificLocation,
        machine,
        state: actionState,
      } = action.payload;
        state[swtName][location][machine].displaySystemTurnOffMessageBox =
          actionState;
    },

    handleAddActionTaken: (state, action) => {
      const { swtName, location, specificLocation, machine, actionTaken } =
        action.payload;
        state[swtName][location][machine].actionTaken.push(actionTaken);
    },

    handleThermocoupleFaultSelectedOne: (state, action) => {
      state.ess.forceOptions[action.payload] = action.payload;
    },

    handleFaultsMessages: (state, action) => {
      state.tgs.message = action.payload;
    },
    handleEssFaults: (state, action) => {
      state.ess = extractDataFaults(action.payload);
    },
    handleTgsFaults: (state, action) => {
      state.tgs = extractDataFaults(action.payload);
    },
    handleTesFaults: (state, action) => {
      state.tes = extractDataFaults(action.payload);
    },
    handleMessagesFaults: (state, action) => {
      const { flatEssSwitch, flatTgsSwitch, flatTesSwitch } = action.payload;
      state.messages.ess = electricalFaultsList(flatEssSwitch);
      state.messages.tgs = gasFaultsList(flatTgsSwitch);
      state.messages.tes = electricalFaultsList(flatTesSwitch);
    },
    handleReceivedThermocoupleSetting: (state, action) => {
      const { swtName, location, specificLocation, machine, data } =
        action.payload;
        if (typeof data === 'object') {
          if (
            state[swtName][location][machine].receivedThermocoupleSetting.find(
              (item) => item.id === data.id
            )
          ) {
            state[swtName][location][machine].receivedThermocoupleSetting =
              state[swtName][location][machine].receivedThermocoupleSetting.map(
                (item) => {
                  if (item.id === data.id) {
                    return data;
                  }
                  return item;
                }
              );
          } else {
            state[swtName][location][machine].receivedThermocoupleSetting =
              state[swtName][location][
                machine
              ].receivedThermocoupleSetting.concat(data);
          }
        } else if (typeof data === 'number') {
          state[swtName][location][machine].receivedThermocoupleSetting = state[
            swtName
          ][location][machine].receivedThermocoupleSetting.filter(
            (item) => item.id !== data
          );
        }
    },
  },
});

const extractDataFaults = (data) => {
  return reduce(
    data,
    (result, value) => {
      if (value.specific_location) {
        return {
          ...result,
          ...reduce(
            value.specific_location,
            (result, value) => {
              return {
                ...result,
                [value.zone_id]: reduce(
                  value.devices,
                  (result, value) => ({
                    ...result,
                    [value.device_mac]: {
                      ...initialState,
                    },
                  }),
                  {}
                ),
              };
            },
            {}
          ),
        };
      }
      return {
        ...result,
        [value.zone_id]: reduce(
          value.devices,
          (result, value) => ({
            ...result,
            [value.device_mac]: {
              ...initialState,
            },
          }),
          {}
        ),
      };
    },
    {}
  );
};

export default faultsSlice;
export const selectFaults = (state) => state.faultsState;
export const {
  handleDisplayForceSelectionBox,
  handleForceSelection,
  handleForceButtonClick,
  handleTimer,
  handleForceButtonActivated,
  handleFaultsReset,
  handleAttendButtonClick,
  handleDisplaySystemTurnOffMessageBox,
  handleAddActionTaken,
  handleDisplayForceStatusBox,

  handleFaultsMessages,
  handleEssFaults,
  handleTgsFaults,
  handleTesFaults,
  handleMessagesFaults,
  handleReceivedThermocoupleSetting,
} = faultsSlice.actions;
