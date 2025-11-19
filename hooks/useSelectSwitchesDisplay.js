import {
  handleAddLocations,
  handleAddMachines,
  handleAddSpecificLocations,
  handleLocationSelect,
  handleMachineSelect,
  handleMachineSelectAlt,
  handleMachineSelectWithSpecLocationAlt,
  handleSelectAll,
  handleSpecificLocationSelect,
} from "../components/store/slices/masterControlSelectSlice";

export const useSelectSwitchesDisplay = (
  option,
  machine,
  extraOption,
  machineIndex,
  specificLocations,
  swt,
  data,
  allSelectBoxData,
  dispatch
) => {
  const locations = Object.keys(data);
  const {
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedSpecificLocations,
    selectedMachines,
    selectedLocations,
  } = allSelectBoxData;

  if (option === "all") {
    // 1. select all
    dispatch(handleSelectAll({ switch: swt, status: true }));

    // 2.update all locations
    const locationArr = isLocationSelected.map((location) => true);

    dispatch(handleLocationSelect({ switch: swt, arr: locationArr }));

    // 3.update all isSpecificLocationSelected
    const specificLocationArr = isSpecificLocationSelected.map((el) =>
      el.map((specLocationState) => true)
    );

    dispatch(
      handleSpecificLocationSelect({ switch: swt, arr: specificLocationArr })
    );
    
    // 4.update all machines
    const individualArr = Object.values(data)?.map((location, i) => {
      if (location.isSpecificLocation) {
        
        return Object.values(location.subLocations).map((subLocation) => {
          return Object.values(subLocation.devices).map((machine) => {
            return true;
          });
        });
      } else {
        return Object.values(location.devices).map((machine) => {
          return true;
        });
      }
    });

    dispatch(handleMachineSelect({ switch: swt, arr: individualArr }));
  } else if (option !== "all" && machine === undefined) {
    // 2. select location
    // 2.1 update  isLocationSelected
    const index = locations.indexOf(option);
    const arr = [...isLocationSelected];
    arr[index] = true;
    dispatch(handleLocationSelect({ switch: swt, arr }));

    // 2.2 update isSpecificLocationSelected
    const exitingSpecLocationsValue = Object.values(data).filter(
      (el) => el.isSpecificLocation
    );

    const newIsSpecificLocationSelected = [];
    exitingSpecLocationsValue.forEach((specLocationTitle) => {
      const tempArr = [];

      newIsSpecificLocationSelected.push(tempArr);

      if (data[option].subLocations) {
        Object.keys(data[option].subLocations).forEach((el, index) => {
          if (el === Object.keys(specLocationTitle.subLocations)[index]) {
            tempArr.push(true);
          } else {
            tempArr.push(false);
          }
        });
      }
    });
    dispatch(
      handleSpecificLocationSelect({
        switch: swt,
        arr: newIsSpecificLocationSelected,
      })
    );

    // 2.3 update isMachineSelected
    const machineNewArr = isMachineSelected[index]?.map((el) => {
      if (typeof el === "boolean") {
        return true;
      } else {
        const machineArr = el?.map((machine) => true);
        return machineArr;
      }
    });
    const copyArr = [...isMachineSelected];
    copyArr[index] = machineNewArr;
    dispatch(handleMachineSelect({ switch: swt, arr: copyArr }));

    // 2.4 for dispatch selected locations
    const newSelect = [...selectedLocations];
    newSelect.push(option);
    dispatch(handleAddLocations({ switch: swt, arr: newSelect }));
  } else if (option !== "all" && machine === "isSpecificLocation") {

    // 3. select specific location
    // location index


    // 3.1 update isSpecificLocationSelected
    let index;
    specificLocations.map((el, i) => {
      if (el.includes(extraOption)) {
        return (index = i);
      }
    });

    const isSpecificLocationNewArr = isSpecificLocationSelected[index]?.map(
      (_, idx) => {
        if (idx === machineIndex) {
          return true;
        }
        return _;
  
      }
    );
    const arr = [...isSpecificLocationSelected];

    arr[index] = isSpecificLocationNewArr;

    dispatch(handleSpecificLocationSelect({ switch: swt, arr }));

    // 3.2 update isMachineSelected
    const locationIndex = locations.indexOf(option);
    const machineNewArr = isMachineSelected[locationIndex][machineIndex]?.map(
      (machine) => true
    );

    const deepCopyArr = JSON.parse(JSON.stringify(isMachineSelected));

    deepCopyArr[locationIndex][machineIndex] = machineNewArr;
    dispatch(handleMachineSelect({ switch: swt, arr: deepCopyArr }));

    // for dispatch selected specific locations
    const newSelect = [...selectedSpecificLocations];
    if (!newSelect.some((el) => el === extraOption)) {
      newSelect.push(extraOption);
    }
    newSelect.push(extraOption);
    dispatch(handleAddSpecificLocations({ switch: swt, arr: newSelect }));
  } else {
    // 4. select individually
    console.log(
      { option, machine, extraOption, data, selectedMachines },
      "selectMachineHandler1"
    );
    const locationIdx = Object.keys(data).indexOf(option);
    const newSelectedMachineArr = [...selectedMachines];
    // 4.1 update isMachineSelected that has a specific location
    if (extraOption) {
      const specLocationIdx = Object.keys(data[option].subLocations).indexOf(
        extraOption
      );
      const machineIdx = Object.keys(
        data[option].subLocations[extraOption].devices
      ).indexOf(machine);
      dispatch(
        handleMachineSelectWithSpecLocationAlt({
          switch: swt,
          locationIdx,
          specLocationIdx,
          machineIdx,
        })
      );

      newSelectedMachineArr.push([option, extraOption, machine]);
    } else {
      // 4.2 update isMachineSelected that doesn't have a specific location
      const machineIdx = Object.keys(data[option].devices).indexOf(machine);

      dispatch(
        handleMachineSelectAlt({ switch: swt, locationIdx, machineIdx })
      );

      newSelectedMachineArr.push([option, machine]);
    }

    // for dispatch selected machines
    dispatch(handleAddMachines({ switch: swt, arr: newSelectedMachineArr }));
  }
};
