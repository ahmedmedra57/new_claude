import {
  useMasterControlSelectStore,
  useESSSwitchStore,
  useTESSwitchStore,
  useTGSSwitchStore,
  useHPElectricSwitchStore,
  useHPGasSwitchStore,
  useESSDataConsumptionStore,
  useTESDataConsumptionStore,
  useTGSDataConsumptionStore,
  useHPDataConsumptionStore,
  useForceAndCommandsStore,
  useAdminStore,
} from "../components/zustand-stores";

export const loopMachinesDispatchHandler = (
  dispatchHandler,
  machines,
  location,
  specificLocation = null,
  settingsSwtName,
  isSelectedSys
) => {
  machines.forEach((machine) =>
    dispatchHandler(
      location,
      machine,
      specificLocation,
      settingsSwtName,
      isSelectedSys
    )
  );
};

const dispatchesHandler = (
  stores,
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
    machines = selectedMachines;
  } else if (extraOption) {
    if (data[option].subLocations) {
      machines = Object.keys(data[option].subLocations[extraOption].devices);
    } else {
      machines = Object.keys(data[option]);
    }
  } else {
    if (data[option].devices) {
      machines = Object.keys(data[option].devices);
    } else {
      machines = Object.keys(data[option]);
    }
  }

  if (swt === "ess") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.essSwitch;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "tes") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.tesSwitch;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "tgs") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.tgsSwitch;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "hpEc") {
    const { selectIndividualMachine, unselectIndividualMachine } = stores.hpElectricSwitch;
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "hpGc") {
    const { selectIndividualMachine, unselectIndividualMachine } = stores.hpGasSwitch;
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "essDc") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.essDataConsumption;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "tesDc") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.tesDataConsumption;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "tgsDc") {
    const { selectIndividualMachine, unselectIndividualMachine, selectSpecificLocationMachines, unselectSpecificLocationMachines } = stores.tgsDataConsumption;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
        loopMachinesDispatchHandler(
          unselectSpecificLocationMachines,
          machines,
          option,
          extraOption
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "hpDc") {
    const { selectIndividualMachine, unselectIndividualMachine } = stores.hpDataConsumption;
    if (select) {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option
        );
      }
    } else {
      if (extraOption) {
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option
        );
      }
    }
  } else if (swt === "forceAndCommand") {
    const { selectIndividualMachine, unselectIndividualMachine } = stores.forceAndCommands;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
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
          unselectIndividualMachine,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
          machines,
          option,
          null,
          settingsSwt,
          isSelectedSys
        );
      }
    }
  } else if (swt === "admin") {
    const { selectIndividualMachine, unselectIndividualMachine } = stores.admin;
    if (select) {
      if (extraOption) {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          selectIndividualMachine,
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
          unselectIndividualMachine,
          machines,
          option,
          extraOption,
          settingsSwt,
          isSelectedSys
        );
      } else {
        loopMachinesDispatchHandler(
          unselectIndividualMachine,
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
  stores,
  locations,
  swt,
  data,
  settingsSwt,
  isSelectedSys
) => {
  locations.forEach((location) => {
    if (!data[location].isSpecificLocation) {
      dispatchesHandler(
        stores,
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
          stores,
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
  stores,
  specificLocations,
  swt,
  data,
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
      stores,
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
  stores,
  machines,
  swt,
  data,
  settingsSwt,
  isSelectedSys
) => {
  const uniqueArray = [...new Set(machines.map(JSON.stringify))].map(
    JSON.parse
  );

  uniqueArray.forEach((machine) => {
    if (machine[2]) {
      dispatchesHandler(
        stores,
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
        stores,
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
  stores,
  locations,
  swt,
  data,
  settingsSwt,
  isSelectedSys
) => {
  locations.forEach((location) => {
    if (!data[location].isSpecificLocation) {
      Object.keys(data[location].devices).map((machine) => {
        dispatchesHandler(
          stores,
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
          stores,
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

export const switchCountHandler = (machines, swt, stores) => {
  const { setSelectedOne } = stores.masterControlSelect;
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
  setSelectedOne(swt, `${selectedSwtNumber} switches`);
};

export const useSelectSwitchDropBoxDispatches = (
  button,
  allSelectBoxData,
  swt,
  isSelected,
  handleClose,
  data
) => {
  // Initialize all stores
  const masterControlSelect = useMasterControlSelectStore();
  const essSwitch = useESSSwitchStore();
  const tesSwitch = useTESSwitchStore();
  const tgsSwitch = useTGSSwitchStore();
  const hpElectricSwitch = useHPElectricSwitchStore();
  const hpGasSwitch = useHPGasSwitchStore();
  const essDataConsumption = useESSDataConsumptionStore();
  const tesDataConsumption = useTESDataConsumptionStore();
  const tgsDataConsumption = useTGSDataConsumptionStore();
  const hpDataConsumption = useHPDataConsumptionStore();
  const forceAndCommands = useForceAndCommandsStore();
  const admin = useAdminStore();

  const stores = {
    masterControlSelect,
    essSwitch,
    tesSwitch,
    tgsSwitch,
    hpElectricSwitch,
    hpGasSwitch,
    essDataConsumption,
    tesDataConsumption,
    tgsDataConsumption,
    hpDataConsumption,
    forceAndCommands,
    admin,
  };

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

  const {
    setSelectedOne,
    setSelectAll,
    addLocations,
    addSpecificLocations,
    addMachines,
    setLocationSelect,
    setSpecificLocationSelect,
    setMachineSelect,
  } = masterControlSelect;

  if (button === 1) {
    //  switches/machines count
    switchCountHandler(isMachineSelected, swt, stores);
    if (isAllSelected) {
      // 1. selected All
      // dispatch
      setSelectedOne(swt, "all");
      // #1.1. select locations
      selectLocationsHandler(stores, locations, swt, data);
    } else if (isLocationSelected.indexOf(true) !== -1) {
      // #2.1. selected locations
      selectLocationsHandler(stores, selectedLocations, swt, data);

      // #2.2. selected specific locations
      if (selectedSpecificLocations.length > 0) {
        selectSpecificLocationsHandler(
          stores,
          selectedSpecificLocations,
          swt,
          data
        );
      }

      // #2.3. selected individual machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(stores, selectedMachines, swt, data);
      }

      // #2.4. switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (isSpecificLocationSelected.indexOf(true) !== -1) {
      // #3. selected specific locations
      selectSpecificLocationsHandler(
        stores,
        selectedSpecificLocations,
        swt,
        data
      );

      // #3.1.selected machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(stores, selectedMachines, swt, data);
      }

      // #3.2.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (selectedMachines.length > 0) {
      // #4.only selected individual machines
      selectMachinesHandler(stores, selectedMachines, swt, data);

      // #4.1.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (!isSelected) {
      setSelectedOne(swt, null);
    }

    // close select box
    handleClose();
  } else {
    // reset all selections
    // 1.reset all local states
    setSelectAll(swt, false);
    setSelectedOne(swt, null);

    // 1.1.reset state for dispatch
    addLocations(swt, []);
    addSpecificLocations(swt, []);
    addMachines(swt, []);

    // 2. reset location
    const arr = locations.map((location) => false);
    setLocationSelect(swt, arr);

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
      setSpecificLocationSelect(swt, filteredArray);
    }

    // 2.2reset selected machines
    setMachineSelect(swt, machineArr);

    // dispatch the selected switch slice
    unselectAllMachinesHandler(stores, locations, swt, data);

    // close select box
    // handleClose();
  }
};
