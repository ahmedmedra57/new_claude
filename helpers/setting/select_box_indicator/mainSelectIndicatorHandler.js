import { selectAllHandler } from "../../ess-tgs-tes-mc/select_box_logic/selectAllHandler";
import { selectMachineHandler } from "../../ess-tgs-tes-mc/select_box_logic/selectMachineHandler";
import { selectAllIndicatorDispatcherHandler } from "./selectAllIndicatorDispatcherHandler";
import { selectLocationIndicatorDispatcherHandler } from "./selectLocationIndicatorDispatcherHandler";
import { selectMachineIndicatorDispatcherHandler } from "./selectMachineIndicatorDispatcherHandler";
import { selectSettingsLocationHandler } from "./selectSettingsLocationHandler";
import { selectSettingsMachineHandler } from "./selectSettingsMachineHandler";
import { selectSettingsSpecificLocationHandler } from "./selectSettingsSpecificLocationHandler";
import { selectSpecificLocationIndicatorDispatcherHandler } from "./selectSpecificLocationIndicatorDispatcherHandler";

const changeObjKeysHandler = (myObject) => {
  // Create a new object to store the updated keys
  const updatedObject = {};

  const keyMap = {
    controller: "switch",
    arr: "arr",
  };
  // Iterate over the keys and update them
  for (const key in myObject) {
    if (key in keyMap) {
      updatedObject[keyMap[key]] = myObject[key];
    } else {
      updatedObject[key] = myObject[key];
    }
  }

  return updatedObject;
};

// Select handler for the indicator
export const mainSelectIndicatorHandler = (propObj) => {
  const {
    dispatch,
    data,
    locations,
    swtName,
    specificLocations,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedSpecificLocations,
    selectedLocations,
    selectedMachines,
    option,
    machine,
    extraOption,
    machineIndex,
  } = propObj;

  if (option === "all") {
    // select all Logic
    const { locationList, specificLocationList, machineList } =
      selectAllHandler(
        data,
        swtName,
        isLocationSelected,
        isSpecificLocationSelected
      );

    const modifiedList = [locationList, specificLocationList, machineList].map(
      (list) => changeObjKeysHandler(list)
    );
    selectAllIndicatorDispatcherHandler(
      dispatch,
      swtName,
      { newLocationList: modifiedList[0] },
      { newSpecificLocationList: modifiedList[1] },
      { newMachineList: modifiedList[2] }
    );
  } else if (option !== "all" && machine === undefined) {
    // ======= select location logic =====
    console.log(
      {
        data,
        option,
        locations,
        isLocationSelected,
        isMachineSelected,
        selectedLocations,
      },
      "mainSelectIndicatorHandler"
    );
    const {
      locationList,
      specificLocationList,
      machineList,
      newSelectedLocations,
    } = selectSettingsLocationHandler(
      data,
      option,
      locations,
      isLocationSelected,
      isMachineSelected,
      selectedLocations
    );
    const uniqueLocationsArr = Array.from(
      new Set(newSelectedLocations.map(JSON.stringify))
    ).map(JSON.parse);
    selectLocationIndicatorDispatcherHandler(
      dispatch,
      swtName,
      locationList,
      specificLocationList,
      machineList,
      uniqueLocationsArr
    );
  } else if (option !== "all" && machine === "isSpecificLocation") {
    // ======= select specific location logic =====

    const { specificLocationList, machineList, newSpecificLocations } =
      selectSettingsSpecificLocationHandler(
        data,
        option,
        machineIndex,
        extraOption,
        locations,
        isSpecificLocationSelected,
        isMachineSelected,
        specificLocations,
        selectedSpecificLocations
      );
    const uniqueSpecificLocationsArr = Array.from(
      new Set(newSpecificLocations.map(JSON.stringify))
    ).map(JSON.parse);

    selectSpecificLocationIndicatorDispatcherHandler(
      dispatch,
      swtName,
      specificLocationList,
      machineList,
      uniqueSpecificLocationsArr
    );
  } else {
    // ======= select machine logic =====
    const { locationIdx, specLocationIdx, machineIdx, newSelectedMachine } =
      selectSettingsMachineHandler(
        option,
        machine,
        extraOption,
        data,
        selectedMachines
      );
    console.log(
      {
        option,
        machine,
        extraOption,
        data,
        selectedMachines,
      },
      "mainSelectIndicatorHandler"
    );
    const uniqueMachinesArr = Array.from(
      new Set(newSelectedMachine.map(JSON.stringify))
    ).map(JSON.parse);

    selectMachineIndicatorDispatcherHandler(
      dispatch,
      swtName,
      locationIdx,
      specLocationIdx,
      machineIdx,
      uniqueMachinesArr
    );
  }
};
