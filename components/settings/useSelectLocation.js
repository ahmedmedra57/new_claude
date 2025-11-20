import { useEffect } from "react";
import { getAllSpecificLocationNames } from "../../helpers/helpers";

const useSelectLocationBox = (
  openHeaders,
  handleUnSelectIndividualMachine,
  selectedOne,
  ess,
  essSpec,
  tgs,
  tgsSpec,
  tes,
  tesSpec,
  sys,
  sysSpec,
  ate,
  hp,
  isEnable1,
  isEnable2,
  isEnable3,
  isEnable4,
  isEnable5,
  isEnable6,
  isEnable7,
  isEnable8,
  isEnable9,
  isEnable10
) => {
    const dispatchUnSelectMachinesHandler = (
    location,
    swt,
    swtData,
    isSelectedSys,
    specificLocation
  ) => {
    if (specificLocation) {
      const machines = Object.keys(swtData[location].subLocations[specificLocation].devices);
      machines.forEach((machine) =>
        dispatch(
          handleUnSelectIndividualMachine({
            swt,
            location,
            specificLocation,
            machine,
            isSelectedSys,
          })
        );
    } else {
      const machines = Object.keys(swtData[location].devices);
      machines.forEach((machine) =>
        dispatch(
          handleUnSelectIndividualMachine({
            swt,
            location,
            machine,
            isSelectedSys,
          })
        );
    }
  };

  const handleUnSelectMachines = (location, swt, swtData, specificLocation) => {
    if (swt === "valveSettings") {
      dispatchUnSelectMachinesHandler(
        location,
        "tgs",
        swtData,
        "isSelectedValveSettings",
        specificLocation
      );
    } else if (swt === "gasType") {
      dispatchUnSelectMachinesHandler(
        location,
        "tgs",
        swtData,
        "isSelectedGasType",
        specificLocation
      );
    } else if (swt === "sysIdentification") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedSysIdentification",
        specificLocation
      );
    } else if (swt === "sysConfiguration") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedSysConfiguration",
        specificLocation
      );
    } else if (swt === "forceGasAndElectricSys") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedForceGasAndElectricSys",
        specificLocation
      );
    } else if (swt === "outsideTemp") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isOutsideTempSelected",
        specificLocation
      );
    } else {
      dispatchUnSelectMachinesHandler(
        location,
        swt,
        swtData,
        null,
        specificLocation
      );
    }
  };

  const loopHandler = (swt, swtData) => {
    const locations = swtData && Object.keys(swtData);
    locations.forEach((location) => {
      if (!swtData[location].isSpecificLocation) {
        handleUnSelectMachines(location, swt, swtData);
      } else {
        Object.keys(swtData[location].subLocations).forEach((specificLocation) =>
          handleUnSelectMachines(location, swt, swtData, specificLocation);
      }
    });
  };

  useEffect(() => {
    dispatch(handleSettingsResetAllSelect();
    if (openHeaders[0]) {
      loopHandler("ess", essSpec);
    } else if (openHeaders[2]) {
      loopHandler("tes", tesSpec);
    } else if (openHeaders[1]) {
      if (isEnable2) {
        loopHandler("gasType", tgsSpec);
      }
      if (isEnable1) {
        loopHandler("valveSettings", tgsSpec);
      } else {
        loopHandler("tgs", tgsSpec);
      }
    } else if (openHeaders[5]) {
      if (isEnable3) {
        loopHandler("forceGasAndElectricSys", sysSpec);
      }
      if (isEnable4) {
        loopHandler("sysIdentification", sysSpec);
      }
      if (isEnable5) {
        loopHandler("outsideTemp", sysSpec);
      }
      if (isEnable6) {
        loopHandler("burningChamber", sysSpec);
      }
      if (isEnable7) {
        loopHandler("encloseTemp", sysSpec);
      }
      if (isEnable8) {
        loopHandler("currEss", sysSpec);
      }
      if (isEnable9) {
        loopHandler("currTgs", sysSpec);
      }
      if (isEnable10) {
        loopHandler("currTes", sysSpec);
      } else {
        loopHandler("sys", sysSpec);
      }
    }
  }, [openHeaders]);


  const dispatchAllHandler = (program) => {
    dispatch(handleSettingsSelectAll({ switch: program, status: false });
  };
  const dispatchLocationsHandler = (programData, program) => {
    const locations = Object.keys(programData);
    const locationsArr = locations.map((_) => false);
    dispatch(
      handleSettingsLocationSelect({ arr: locationsArr, switch: program });
  };
  const dispatchSpecificLocationsHandler = (programData, program) => {
    const specificLocationName = getAllSpecificLocationNames(programData);
    const allSpecificLocationsArr = [];
    programData &&
      Object.values(programData).forEach((value) => {
        if (value?.isSpecificLocation) {
          const specLocation = Object.keys(value.subLocations).map(
            (el) => false
          );
          allSpecificLocationsArr.push(specLocation);
        }
      });
    dispatch(
      handleSettingsSpecificLocationSelect({
        arr: allSpecificLocationsArr,
        switch: program,
      });
    return specificLocationName;
  };
  const dispatchMachinesHandler = (
    programData,
    program,
    specificationLocationArr
  ) => {
    const specificLocationArr = [];
    const machineArr = Object.values(programData).map((location) => {
      if (location.isSpecificLocation) {
        const machinesList = Object.values(location.subLocations).map(
          (specLocation) => Object.keys(specLocation.devices).map((el) => false);
        const specLocation = Object.keys(location.subLocations).map(
          (el) => false
        );
        specificLocationArr.push(specLocation);
        return machinesList;
      } else {
        return Object.values(location.devices).map((value) => {
          return false;
        });
      }
    });
    dispatch(handleSettingsMachineSelect({ arr: machineArr, switch: program });
  };

  useEffect(() => {
    if (openHeaders[0]) {
      if (!selectedOne) {
        dispatchAllHandler("ess");
        dispatchLocationsHandler(essSpec, "ess");

        const specificationLocationArr = dispatchSpecificLocationsHandler(
          essSpec,
          "ess"
        );
        dispatchMachinesHandler(essSpec, "ess", specificationLocationArr);
      }
    } else if (openHeaders[1]) {
      if (!selectedOne) {
        if (isEnable1) {
          dispatchAllHandler("valveSettings");
          dispatchLocationsHandler(tgsSpec, "valveSettings");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "valveSettings"
          );
          dispatchMachinesHandler(
            tgsSpec,
            "valveSettings",
            specificationLocationArr
          );
        }
        if (isEnable2) {
          dispatchAllHandler("gasType");
          dispatchLocationsHandler(tgsSpec, "gasType");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgs,
            "gasType"
          );
          dispatchMachinesHandler(tgsSpec, "gasType", specificationLocationArr);
        }
        if (tgs) {
          dispatchAllHandler("tgs");
          dispatchLocationsHandler(tgsSpec, "tgs");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "tgs"
          );
          dispatchMachinesHandler(tgsSpec, "tgs", specificationLocationArr);
        }
      }
    } else if (openHeaders[2]) {
      if (!selectedOne) {
        dispatchAllHandler("tes");
        dispatchLocationsHandler(tesSpec, "tes");

        const specificationLocationArr = dispatchSpecificLocationsHandler(
          tesSpec,
          "tes"
        );
        dispatchMachinesHandler(tesSpec, "tes", specificationLocationArr);
      }
    } else if (openHeaders[5]) {
      if (!selectedOne) {
        if (isEnable3) {
          dispatchAllHandler("forceGasAndElectricSys");
          dispatchLocationsHandler(tesSpec, "forceGasAndElectricSys");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tesSpec,
            "forceGasAndElectricSys"
          );
          dispatchMachinesHandler(
            tesSpec,
            "forceGasAndElectricSys",
            specificationLocationArr
          );
        }
        if (isEnable5) {
          dispatchAllHandler("outsideTemp");
          dispatchLocationsHandler(sysSpec, "outsideTemp");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            sysSpec,
            "outsideTemp"
          );
          dispatchMachinesHandler(sysSpec, "outsideTemp", specificationLocationArr);
        }
        if (isEnable6) {
          dispatchAllHandler("burningChamber");
          dispatchLocationsHandler(tgsSpec, "burningChamber");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "burningChamber"
          );
          dispatchMachinesHandler(
            tgsSpec,
            "burningChamber",
            specificationLocationArr
          );
        }
        if (isEnable7) {
          dispatchAllHandler("encloseTemp");
          dispatchLocationsHandler(sysSpec, "encloseTemp");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            sysSpec,
            "encloseTemp"
          );
          dispatchMachinesHandler(sysSpec, "encloseTemp", specificationLocationArr);
        }
        if (isEnable8) {
          dispatchAllHandler("currEss");
          dispatchLocationsHandler(essSpec, "currEss");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            essSpec,
            "currEss"
          );
          dispatchMachinesHandler(essSpec, "currEss", specificationLocationArr);
        }
        if (isEnable9) {
          dispatchAllHandler("currTgs");
          dispatchLocationsHandler(tgsSpec, "currTgs");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "currTgs"
          );
          dispatchMachinesHandler(tgsSpec, "currTgs", specificationLocationArr);
        }
        if (isEnable10) {
          dispatchAllHandler("currTes");
          dispatchLocationsHandler(tesSpec, "currTes");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tesSpec,
            "currTes"
          );
          dispatchMachinesHandler(tesSpec, "currTes", specificationLocationArr);
        }
      }
    }
















  }, [
    openHeaders,
    selectedOne,
    sys,
    ate,
    hp,
    isEnable1,
    isEnable2,
    isEnable3,
    isEnable4,
    isEnable5,
    isEnable6,
    isEnable7,
    isEnable8,
    isEnable9,
    isEnable10,
  ]);

  return;
};

export default useSelectLocationBox;
