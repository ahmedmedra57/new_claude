import {
  handleAddLocations,
  handleAddMachines,
  handleAddSpecificLocations,
  handleLocationSelect,
  handleMachineSelect,
  handleSelectAll,
  handleSelectedOne,
  handleSpecificLocationSelect,
} from "../components/store/slices/masterControlSelectSlice";
import {
  essSpecificLocationSelectMachinesHandler,
  essSpecificLocationUnselectMachinesHandler,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
} from "../components/store/slices/essSwitchSlice";
import {
  tesHandleSelectIndividualMachine,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
  tesSpecificLocationUnselectMachinesHandler,
} from "../components/store/slices/tesSwitchSlice";
import {
  tgsHandleSelectIndividualMachine,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
  tgsSpecificLocationUnselectMachinesHandler,
} from "../components/store/slices/tgsSwitchSlice";
import {
  hpEcHandleSelectIndividualMachine,
  hpEcHandleUnSelectIndividualMachine,
} from "../components/store/slices/hpElectricSwitchSlice";
import {
  hpGcHandleSelectIndividualMachine,
  hpGcHandleUnSelectIndividualMachine,
} from "../components/store/slices/hpGasSwitchSlice";
import {
  essDataConsumptionHandleSelectIndividualMachine,
  essDataConsumptionHandleUnSelectIndividualMachine,
  essDataConsumptionSpecificLocationSelectMachineHandler,
  essDataConsumptionSpecificLocationUnselectMachineHandler,
} from "../components/store/slices/essDataConsumptionSlice";
import {
  tesDataConsumptionHandleSelectIndividualMachine,
  tesDataConsumptionHandleUnSelectIndividualMachine,
  tesDataConsumptionSpecificLocationSelectMachineHandler,
  tesDataConsumptionSpecificLocationUnselectMachineHandler,
} from "../components/store/slices/tesDataConsumptionSlice";
import {
  tgsDataConsumptionHandleSelectIndividualMachine,
  tgsDataConsumptionHandleUnSelectIndividualMachine,
  tgsDataConsumptionSpecificLocationSelectMachineHandler,
  tgsDataConsumptionSpecificLocationUnselectMachineHandler,
} from "../components/store/slices/tgsDataConsumptionSlice";
import {
  hpDataConsumptionHandleSelectIndividualMachine,
  hpDataConsumptionHandleUnSelectIndividualMachine,
} from "../components/store/slices/hpDataConsumptionSlice";
import {
  handleFCSelectIndividualMachine,
  handleFCUnSelectIndividualMachine,
} from "../components/store/slices/settings/forceAndCommandsSlice";
import {
  handleAdminSelectIndividualMachine,
  handleAdminUnSelectIndividualMachine,
} from "../components/store/slices/settings/admin/adminSlice";

export const loopMachinesDispatchHandler = (
  dispatchHandler,
  dispatch,
  machines,
  location,
  specificLocation = null,
  settingsSwtName,
  isSelectedSys
) => {
  machines.forEach((machine) =>
    dispatch(
      dispatchHandler({
        location,
        machine,
        specificLocation,
        swt: settingsSwtName,
        isSelectedSys,
      })
    )
  );
};

const dispatchesHandler = (
  dispatch,
  swt,
  data,
  option,
  select,
  extraOption,
  selectedMachines,
  settingsSwt,
  isSelectedSys
) => {
  let machines;
  if (selectedMachines) {
    // console.log("commandInfoInside1");
    machines = selectedMachines;
  } else if (extraOption) {
    // console.log("commandInfoInside2",{option,extraOption});
    if (data[option].subLocations) {
      machines = Object.keys(data[option].subLocations[extraOption].devices);
    } else {
      machines = Object.keys(data[option]);
    }
  } else {
    // console.log("commandInfoInside3",{option});
    if (data[option].devices) {
      machines = Object.keys(data[option].devices);
    } else {
      machines = Object.keys(data[option]);
    }
  }
  if (swt === "ess") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          essSpecificLocationSelectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     essSpecificLocationSelectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          handleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     handleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      
      if (extraOption) {
        loopMachinesDispatchHandler(
          essSpecificLocationUnselectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     essSpecificLocationUnselectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          handleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     handleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "tes") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tesSpecificLocationSelectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesSpecificLocationSelectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tesHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tesSpecificLocationUnselectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesSpecificLocationUnselectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tesHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "tgs") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tgsSpecificLocationSelectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsSpecificLocationSelectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tgsHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tgsSpecificLocationUnselectMachinesHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsSpecificLocationUnselectMachinesHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tgsHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "hpEc") {
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpEcHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     hpEcHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpEcHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
      
      }
    }
  } else if (swt === "hpGc") {
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpGcHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     hpGcHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpGcHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
      
      }
    }
  } else if (swt === "essDc") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          essDataConsumptionSpecificLocationSelectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
    
      } else {
        loopMachinesDispatchHandler(
          essDataConsumptionHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
      
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          essDataConsumptionSpecificLocationUnselectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     essDataConsumptionSpecificLocationUnselectMachineHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          essDataConsumptionHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     essDataConsumptionHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "tesDc") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tesDataConsumptionSpecificLocationSelectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesDataConsumptionSpecificLocationSelectMachineHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tesDataConsumptionHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesDataConsumptionHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tesDataConsumptionSpecificLocationUnselectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesDataConsumptionSpecificLocationUnselectMachineHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tesDataConsumptionHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tesDataConsumptionHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "tgsDc") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tgsDataConsumptionSpecificLocationSelectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsDataConsumptionSpecificLocationSelectMachineHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tgsDataConsumptionHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsDataConsumptionHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          tgsDataConsumptionSpecificLocationUnselectMachineHandler,
          dispatch,
          machines,
          option,
          extraOption
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsDataConsumptionSpecificLocationUnselectMachineHandler({
        //       location: option,
        //       machine,
        //       specificLocation: extraOption,
        //     })
        //   )
        // );
      } else {
        loopMachinesDispatchHandler(
          tgsDataConsumptionHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     tgsDataConsumptionHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "hpDc") {
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpDataConsumptionHandleSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     hpDataConsumptionHandleSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          hpDataConsumptionHandleUnSelectIndividualMachine,
          dispatch,
          machines,
          option
        );
        // machines.forEach((machine) =>
        //   dispatch(
        //     hpDataConsumptionHandleUnSelectIndividualMachine({
        //       location: option,
        //       machine,
        //     })
        //   )
        // );
      }
    }
  } else if (swt === "forceAndCommand") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          handleFCSelectIndividualMachine,
          dispatch,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          handleFCSelectIndividualMachine,
          dispatch,
          machines,
          option,
          null,
          settingsSwt,
          isSelectedSys
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          handleFCUnSelectIndividualMachine,
          dispatch,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          handleFCUnSelectIndividualMachine,
          dispatch,
          machines,
          option,
          null,
          settingsSwt,
          isSelectedSys
        );
      }
    }
  } else if (swt === "admin") {
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          handleAdminSelectIndividualMachine,
          dispatch,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          handleAdminSelectIndividualMachine,
          dispatch,
          machines,
          option,
          null,
          settingsSwt,
          isSelectedSys
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          handleAdminUnSelectIndividualMachine,
          dispatch,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          handleAdminUnSelectIndividualMachine,
          dispatch,
          machines,
          option,
          null,
          settingsSwt,
          isSelectedSys
        );
      }
    }
  }
};

const verifyNoSpecificLocations = (location, data) => {
  const locationData = data[location];
  return Object.values(locationData).some((el) => el?.deviceMac);
};

export const selectLocationsHandler = (
  locations,
  swt,
  data,
  dispatch,
  settingsSwt,
  isSelectedSys
) => {
  locations.forEach((location) => {
    if (!data[location].isSpecificLocation) {
      dispatchesHandler(
        dispatch,
        swt,
        data,
        location,
        true,
        null,
        null,
        settingsSwt,
        isSelectedSys
      );
    } else {
      Object.keys(data[location].subLocations).forEach((specificLocation) =>
        dispatchesHandler(
          dispatch,
          swt,
          data,
          location,
          true,
          specificLocation,
          null,
          settingsSwt,
          isSelectedSys
        )
      );
    }
  });
};

export const selectSpecificLocationsHandler = (
  specificLocations,
  swt,
  data,
  dispatch,
  settingsSwt,
  isSelectedSys
) => {
  specificLocations.forEach((specificLocation) => {
    const location = Object.entries(data).filter(([key, value]) => {
      if (value.isSpecificLocation) {
        return Object.keys(value.subLocations).some(
          (el) => el === specificLocation
        );
      }
    })[0][0];
    dispatchesHandler(
      dispatch,
      swt,
      data,
      location,
      true,
      specificLocation,
      null,
      settingsSwt,
      isSelectedSys
    );
  });
};

export const selectMachinesHandler = (
  machines,
  swt,
  data,
  dispatch,
  settingsSwt,
  isSelectedSys
) => {
  const uniqueArray = [...new Set(machines.map(JSON.stringify))].map(
    JSON.parse
  );

  uniqueArray.forEach((machine) => {
    if (machine[2]) {
      dispatchesHandler(
        dispatch,
        swt,
        data,
        machine[0],
        true,
        machine[1],
        [machine[2]],
        settingsSwt,
        isSelectedSys
      );
    } else {
      dispatchesHandler(
        dispatch,
        swt,
        data,
        machine[0],
        true,
        null,
        [machine[1]],
        settingsSwt,
        isSelectedSys
      );
    }
  });
};

export const unselectAllMachinesHandler = (
  locations,
  swt,
  data,
  dispatch,
  settingsSwt,
  isSelectedSys
) => {
  locations.forEach((location) => {
    if (!data[location].isSpecificLocation) {
      Object.keys(data[location].devices).map((machine) => {
        dispatchesHandler(
          dispatch,
          swt,
          data,
          location,
          null,
          null,
          null,
          settingsSwt,
          isSelectedSys
        );
      });
    } else {
      Object.keys(data[location].subLocations).map((specificLocation) => {
        dispatchesHandler(
          dispatch,
          swt,
          data,
          location,
          null,
          specificLocation,
          null,
          settingsSwt,
          isSelectedSys
        );
      });
    }
  });
};

export const switchCountHandler = (machines, swt, dispatch) => {
  let selectedSwtNumber = 0;
  machines.forEach((location) =>
    location.forEach((machine) => {
      if (typeof machine === "object") {
        machine.forEach((el) => {
          if (el) {
            selectedSwtNumber += 1;
          }
        });
      } else {
        if (machine) {
          selectedSwtNumber += 1;
        }
      }
    })
  );
  dispatch(
    handleSelectedOne({
      switch: swt,
      selectedOne: `${selectedSwtNumber} switches`,
    })
  );
};

export const useSelectSwitchDropBoxDispatches = (
  button,
  allSelectBoxData,
  swt,
  isSelected,
  handleClose,
  data,
  dispatch
) => {
  const locations = Object.keys(data);
  const {
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedSpecificLocations,
    selectedMachines,
    selectedLocations,
  } = allSelectBoxData;

  if (button === 1) {
    //  switches/machines count
    switchCountHandler(isMachineSelected, swt, dispatch);
    if (isAllSelected) {
      // 1. selected All
      // dispatch
      dispatch(handleSelectedOne({ switch: swt, selectedOne: "all" }));
      // #1.1. select locations
      selectLocationsHandler(locations, swt, data, dispatch);
    } else if (isLocationSelected.indexOf(true) !== -1) {
      // #2.1. selected locations
      selectLocationsHandler(selectedLocations, swt, data, dispatch);

      // #2.2. selected specific locations
      if (selectedSpecificLocations.length > 0) {
        selectSpecificLocationsHandler(
          selectedSpecificLocations,
          swt,
          data,
          dispatch
        );
      }

      // #2.3. selected individual machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(selectedMachines, swt, data, dispatch);
      }

      // #2.4. switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (isSpecificLocationSelected.indexOf(true) !== -1) {
      // #3. selected specific locations
      selectSpecificLocationsHandler(
        selectedSpecificLocations,
        swt,
        data,
        dispatch
      );

      // #3.1.selected machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(selectedMachines, swt, data, dispatch);
      }

      // #3.2.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (selectedMachines.length > 0) {
      // #4.only selected individual machines
      selectMachinesHandler(selectedMachines, swt, data, dispatch);

      // #4.1.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (!isSelected) {
      dispatch(handleSelectedOne({ switch: swt, selectedOne: null }));
    }

    // close select box
    handleClose();
  } else {
    // reset all selections
    // 1.reset all local states
    dispatch(handleSelectAll({ switch: swt, status: false }));
    dispatch(handleSelectedOne({ switch: swt, selectedOne: null }));

    // 1.1.reset state for dispatch
    dispatch(handleAddLocations({ switch: swt, arr: [] }));
    dispatch(handleAddSpecificLocations({ switch: swt, arr: [] }));
    dispatch(handleAddMachines({ switch: swt, arr: [] }));

    // 2. reset location
    const arr = locations.map((location) => false);
    dispatch(handleLocationSelect({ switch: swt, arr }));

    // 2.1 reset specific location
    const specificLocationArr = [];
    const machineArr = Object.values(data).map((location) => {
      const tempArr = [];
      specificLocationArr.push(tempArr);

      return Object.values(location).map((value) => {
        if (value.machineType) {
          return false;
        } else {
          return Object.keys(value).map((_) => {
            tempArr.push(false);
            return false;
          });
        }
      });
    });

    const filteredArray = specificLocationArr.filter(
      (subArray) => subArray.length > 0
    );
    if (filteredArray.length > 0) {
      dispatch(
        handleSpecificLocationSelect({
          arr: filteredArray,
          switch: swt,
        })
      );
    }

    // 2.2reset selected machines
    dispatch(handleMachineSelect({ switch: swt, arr: machineArr }));

    // dispatch the selected switch slice
    unselectAllMachinesHandler(locations, swt, data, dispatch);

    // close select box
    // handleClose();
  }
};
