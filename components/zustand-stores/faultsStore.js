import { createStore } from './storeUtils';
import { reduce } from 'lodash';
import { electricalFaultsList, gasFaultsList } from '../../helpers/helpers';

const initialState = {
  faults: false,
  receivedThermocoupleSetting: [],
  maxHeatTimer: { state: false, time: null },
  displayForceBox: false,
  selectedForce: null,
  isForceButtonClicked: false,
  isForceButtonActivated: false,
  activatedResetButton: { faultType: null, status: false },
  attendButtonClicked: { faultType: null, status: false, faultNumber: null },
  displayForceSelectionBox: false,
  displaySystemTurnOffMessageBox: false,
  resetCounter: 3,
  actionTaken: [],
};

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

const useFaultsStore = createStore('faultsState', (set) => ({
  ess: {},
  tes: {},
  tgs: {},
  messages: {
    ess: [],
    tes: [],
    tgs: [],
  },

  setDisplayForceSelectionBox: ({ swtName, location, machine, state: actionState }) => set((state) => {
    state[swtName][location][machine].displayForceSelectionBox = actionState;
  }),

  setForceSelection: ({ swtName, location, machine, selectedOne }) => set((state) => {
    state[swtName][location][machine].selectedForce = selectedOne;
  }),

  setForceButtonClick: ({ swtName, location, machine, state: actionState }) => set((state) => {
    state[swtName][location][machine].isForceButtonClicked = actionState;
  }),

  setForceButtonActivated: ({ swtName, location, machine, state: actionState }) => set((state) => {
    state[swtName][location][machine].isForceButtonActivated = actionState;
    state[swtName][location][machine].isForceButtonClicked = false;
  }),

  setTimer: ({ swtName, location, machine, time }) => set((state) => {
    state[swtName][location][machine].maxHeatTimer.time = time;
    state[swtName][location][machine].maxHeatTimer.state = true;
    state[swtName][location][machine].displayForceBox = true;
  }),

  setDisplayForceStatusBox: ({ swtName, location, machine }) => set((state) => {
    state[swtName][location][machine].displayForceBox = true;
  }),

  resetFaults: ({ swtName, location, machine, faultType }) => set((state) => {
    state[swtName][location][machine].activatedResetButton.faultType = faultType;
    state[swtName][location][machine].activatedResetButton.status = true;
    state[swtName][location][machine].isForceButtonClicked = false;
    state[swtName][location][machine].isForceButtonActivated = false;
  }),

  setAttendButtonClick: ({ swtName, location, machine, faultType, state: actionState, column }) => set((state) => {
    state[swtName][location][machine].attendButtonClicked.faultType = faultType;
    state[swtName][location][machine].attendButtonClicked.status = actionState;
    state[swtName][location][machine].attendButtonClicked.column = column;
  }),

  setDisplaySystemTurnOffMessageBox: ({ swtName, location, machine, state: actionState }) => set((state) => {
    state[swtName][location][machine].displaySystemTurnOffMessageBox = actionState;
  }),

  addActionTaken: ({ swtName, location, machine, actionTaken }) => set((state) => {
    state[swtName][location][machine].actionTaken.push(actionTaken);
  }),

  setReceivedThermocoupleSetting: ({ swtName, location, machine, data }) => set((state) => {
    if (typeof data === 'object') {
      const existingItem = state[swtName][location][machine].receivedThermocoupleSetting.find(
        (item) => item.id === data.id
      );
      if (existingItem) {
        state[swtName][location][machine].receivedThermocoupleSetting =
          state[swtName][location][machine].receivedThermocoupleSetting.map(
            (item) => (item.id === data.id ? data : item)
          );
      } else {
        state[swtName][location][machine].receivedThermocoupleSetting.push(data);
      }
    } else if (typeof data === 'number') {
      state[swtName][location][machine].receivedThermocoupleSetting =
        state[swtName][location][machine].receivedThermocoupleSetting.filter(
          (item) => item.id !== data
        );
    }
  }),

  setEssFaults: (payload) => set((state) => {
    state.ess = extractDataFaults(payload);
  }),

  setTgsFaults: (payload) => set((state) => {
    state.tgs = extractDataFaults(payload);
  }),

  setTesFaults: (payload) => set((state) => {
    state.tes = extractDataFaults(payload);
  }),

  setMessagesFaults: ({ flatEssSwitch, flatTgsSwitch, flatTesSwitch }) => set((state) => {
    state.messages.ess = electricalFaultsList(flatEssSwitch);
    state.messages.tgs = gasFaultsList(flatTgsSwitch);
    state.messages.tes = electricalFaultsList(flatTesSwitch);
  }),
}));

export default useFaultsStore;
