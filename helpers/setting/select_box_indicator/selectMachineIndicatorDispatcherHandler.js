import {
  handleSettingsAddMachines,
  handleSettingsMachineSelectAlt,
} from '../../../components/store/slices/settings/force&CommandAndAdminSelectSlice';

export const selectMachineIndicatorDispatcherHandler = (
  dispatch,
  name,
  locationIdx,
  specLocationIdx,
  machineIdx,
  newSelectedMachine
) => {
  // dispatch to isMachineSelected
  dispatch(
    handleSettingsMachineSelectAlt({
      switch: name,
      locationIdx,
      specLocationIdx,
      machineIdx,
    })
  );
  // for dispatch to selectedMachines
  dispatch(
    handleSettingsAddMachines({
      switch: name,
      arr: newSelectedMachine,
    })
  );
};
