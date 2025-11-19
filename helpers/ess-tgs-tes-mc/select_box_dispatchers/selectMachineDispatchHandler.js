import {
  handleAddMachinesBySwitch,
  handleMachineSelectAltBySwitch,
  handleMachineSelectWithSpecLocationAltBySwitch,
} from "../../../components/store/slices/masterControlBySwitchSelectSlice";
import {
  handleAddMachinesByLocation,
  handleMachineSelectAltByLocation,
  handleMachineSelectWithSpecLocationAltByLocation,
} from "../../../components/store/slices/masterControlSelectByLocationSlice";

export const selectMachineDispatchHandler = (
  dispatch,
  scope,
  name,
  extraOption,
  locationIdx,
  specLocationIdx,
  machineIdx,
  newSelectedMachine
) => {
  // ======dispatches below======
  if (scope === "switch") {
    if (extraOption) {
      // dispatch machines that have a specific location
      dispatch(
        handleMachineSelectWithSpecLocationAltBySwitch({
          controller: name,
          locationIdx,
          specLocationIdx,
          machineIdx,
        })
      );
    } else {
      // dispatch machines that do not have a specific location
      dispatch(
        handleMachineSelectAltBySwitch({
          controller: name,
          locationIdx,
          machineIdx,
        })
      );
    }
    // for dispatch selected machines
    dispatch(
      handleAddMachinesBySwitch({
        controller: name,
        arr: newSelectedMachine,
      })
    );
  } else {
    if (extraOption) {
      // dispatch machines that have a specific location
      dispatch(
        handleMachineSelectWithSpecLocationAltByLocation({
          controller: name,
          locationIdx,
          specLocationIdx,
          machineIdx,
        })
      );
    } else {
      // dispatch machines that do not have a specific location
      dispatch(
        handleMachineSelectAltByLocation({
          controller: name,
          locationIdx,
          machineIdx,
        })
      );
    }
    // for dispatch selected machines
    dispatch(
      handleAddMachinesByLocation({
        controller: name,
        arr: newSelectedMachine,
      })
    );
  }
};
