import {
  handleSettingsAddLocations,
  handleSettingsAddMachines,
  handleSettingsAddSpecificLocations,
  handleSettingsLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsSelectAll,
  handleSettingsSelectedOne,
  handleSettingsSpecificLocationSelect,
} from "../../../components/store/slices/settings/force&CommandAndAdminSelectSlice";
import {
  selectLocationsHandler,
  selectMachinesHandler,
  selectSpecificLocationsHandler,
  unselectAllMachinesHandler,
} from "../../../hooks/useSelectSwitchesDispatches";
import selectBoxResetHandler from "../../ess-tgs-tes-mc/selectBoxResetHandler";
import { settingsSwitchCountHandler } from "./settingsSwitchCountHandler";

export const buttonsHandler = (propsObj,setSelectSearchMethod,isValueSettings) => {
  const {
    button,
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
    swtName,
    dispatch,
    data,
    locations,
    handleClose,
    isSelected,
    isSelectedSys,
    system,
    program,
    
  } = propsObj;

  const switchName = system ? system : swtName;
  // logic for counting the number of selected machine
  settingsSwitchCountHandler(isMachineSelected, swtName, dispatch);

  // button is select
  if (button === 1) {
    if(isValueSettings){
      setSelectSearchMethod(1);
    }
    if (isAllSelected) {
      // 1. selected All
      // dispatch
      dispatch(
        handleSettingsSelectedOne({
          switch: swtName,
          selectedOne: "all",
        })
      );

      selectLocationsHandler(
        locations,
        program,
        data,
        dispatch,
        swtName,
        isSelectedSys
      );
    } else if (isLocationSelected.indexOf(true) !== -1) {
      // 2.1 update isLocationSelected
      selectLocationsHandler(
        selectedLocations,
        program,
        data,
        dispatch,
        switchName,
        isSelectedSys
      );

      // #2.2.update isSpecificLocationSelected
      if (selectedSpecificLocations.length > 0) {
        selectSpecificLocationsHandler(
          selectedSpecificLocations,
          program,
          data,
          dispatch,
          switchName,
          isSelectedSys
        );
      }

      if (selectedMachines.length > 0) {
        // 2.3. update isMachineSelected
        selectMachinesHandler(
          selectedMachines,
          program,
          data,
          dispatch,
          switchName,
          isSelectedSys
        );
      }
    } else if (isSpecificLocationSelected.length > 0) {
      // #3. update isSpecificLocationSelected
      selectSpecificLocationsHandler(
        selectedSpecificLocations,
        program,
        data,
        dispatch,
        swtName,
        isSelectedSys
      );

      // #3.1. update isMachineSelected
      if (selectedMachines.length > 0) {
        selectMachinesHandler(
          selectedMachines,
          program,
          data,
          dispatch,
          swtName,
          isSelectedSys
        );
      }
    } else if (selectedMachines.length > 0) {
      // #4.only selected individual machines
      selectMachinesHandler(
        selectedMachines,
        program,
        data,
        dispatch,
        swtName,
        isSelectedSys
      );
    } else if (!isSelected) {
      dispatch(
        handleSettingsSelectedOne({
          switch: swtName,
          selectedOne: null,
        })
      );
    }

    handleClose();
  } else {
    if(isValueSettings){
      setSelectSearchMethod(null)
    }
    const { locationList, specificLocationList, machineList } =
      selectBoxResetHandler(data, "setting");
    const resetObj = { switch: swtName, arr: [] };
    const locationResetObj = { switch: swtName, arr: locationList };
    const specificLocationResetObj = {
      arr: specificLocationList,
      switch: swtName,
    };
    const machineResetObj = { switch: swtName, arr: machineList };
    // Clear button
    // 1.reset all and title (selected one)
    dispatch(handleSettingsSelectAll({ switch: swtName, status: false }));
    dispatch(handleSettingsSelectedOne({ switch: swtName, selectedOne: null }));

    // 2. Empty selected location names
    dispatch(handleSettingsAddLocations(resetObj));
    // 2.1. Empty selected specific location names and machine names
    dispatch(handleSettingsAddSpecificLocations(resetObj));
    // 2.2. Empty selected  machine names
    dispatch(handleSettingsAddMachines(resetObj));

    // 3. reset isLocationSelected to an array of false
    dispatch(handleSettingsLocationSelect(locationResetObj));
    // 3.1. reset isSpecificLocationSelected to an array of false
    if (specificLocationList.length > 0) {
      dispatch(handleSettingsSpecificLocationSelect(specificLocationResetObj));
    }
    // 3.2. reset isMachineSelected to an array of false
    dispatch(handleSettingsMachineSelect(machineResetObj));
    // unSelect all machines of ESS,TGS or TES slice
    unselectAllMachinesHandler(
      locations,
      program,
      data,
      dispatch,
      switchName,
      isSelectedSys
    );
  }
};
