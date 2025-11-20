import styled, { css } from "styled-components";
import { useTranslation } from 'react-i18next';
import {
import { useESSDataConsumptionStore, useHPDataConsumptionStore, useHPElectricSwitchStore, useHPGasSwitchStore, useTESDataConsumptionStore, useTGSDataConsumptionStore, useTelemetryChartDataStore } from '../zustand-stores';
import { useMasterControlSelectStore } from '../zustand-stores';
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerADark,
  layerB,
} from "../../styles/commonStyles";
import SearchButton from "./SearchButton";
import SelectSystem from "./SelectSystem";
import SelectDates from "./SelectDates";
import SelectSwitches from "./SelectSwitches";
import { useCallback, useState } from "react";
import { useESSSwitchStore, useMCStore, useMasterControlSelectStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../../zustand-stores';
import {
  essSpecificLocationUnselectMachinesHandler,
  handleUnSelectIndividualMachine,
  selectEssSwitch,
} from "../../store/slices/essSwitchSlice";
import {
  selectTgsSwitch,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,
} from "../../store/slices/tgsSwitchSlice";
import {
  selectTesSwitch,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,
} from "../../store/slices/tesSwitchSlice";
import { useEffect } from "react";
import {
  // handleSelectEss,
  handleSelectTelemetrySystem,
  // handleSelectTes,
  // handleSelectTgs,
  handleUnselectAllSystem,
  selectMC,
} from "../../store/slices/mCSlice";
import {
  handleDisplaySelectBox,
  handleLocationSelect,
  handleMachineSelect,
  handleResetAllSelect,
  handleSelectAll,
  handleSpecificLocationSelect,
  selectMasterControls,
} from "../../store/slices/masterControlSelectSlice";
import {
  handleAuditLogData,
  handleSearchTelemetrySystem,
  handleTotalConsumptionTelemetry,
  handleTotalHoursTelemetry,
} from "../../store/slices/telemetrySlice";
import {
  hpEcHandleUnSelectIndividualMachine,
  hpEcSpecificLocationUnselectMachinesHandler,
  selectHpElectricSwitch,
} from "../../store/slices/hpElectricSwitchSlice";
import {
  hpGcHandleUnSelectIndividualMachine,
  hpGcSpecificLocationUnselectMachinesHandler,
  selectHpGasSwitch,
} from "../../store/slices/hpGasSwitchSlice";
import {
  essDataConsumptionHandleUnSelectIndividualMachine,
  essDataConsumptionSpecificLocationUnselectMachineHandler,
  // essDcHandleUnSelectIndividualMachine,
  selectEssDataConsumption,
} from "../../store/slices/essDataConsumptionSlice";
import {
  selectTesDataConsumption,
  // selecttesDataConsumption,
  // tesDataConsumptionHandleSelectIndividualMachine,
  tesDataConsumptionHandleUnSelectIndividualMachine,
  tesDataConsumptionSpecificLocationUnselectMachineHandler,
} from "../../store/slices/tesDataConsumptionSlice";
import {
  selectTgsDataConsumption,
  // selecttgsDataConsumption,
  tgsDataConsumptionHandleUnSelectIndividualMachine,
  tgsDataConsumptionSpecificLocationUnselectMachineHandler,
} from "../../store/slices/tgsDataConsumptionSlice";
import {
  hpDataConsumptionHandleUnSelectIndividualMachine,
  hpDataConsumptionSpecificLocationUnselectMachinesHandler,
  selectHpDataConsumption,
  // selecthpDataConsumption,
} from "../../store/slices/hpDataConsumptionSlice";
import {
  selectTelemetryChartData,
  setTelemetryChartData,
  setTelemetryIntervalUnit,
} from "../../store/slices/telemetryChartDataSlice";
import {
  formatTelemetryChartData,
  formatTime,
  // getAuditLogData,
  // getConsumptionValue,
  // getLocationDataByDeviceId,
  getMachineDataByInhandId,
  getSelectedDeviceIds,
  getTotalMachineValues,
  getTotalSearchValues,
} from "../../../helpers/helpers";
import {
  getDataConsumptionService,
  getTelemetryService,
} from "../../../services";
// import { sum } from 'lodash';
const MainSelections = ({
  selectedSystemTitle,
  setSelectedSystemTitle,
  setControlSelectionDisplay,
  setTelemetryData,
  setTelemetryDataKeys,
  setCopyTelemetryState,
  setCopyTelemetryStateKeys,
  setCopyTelemetryDailyState,
  scheduleData,
  setScheduleData,
}) => {
  const { t } = useTranslation();
  // **********************************buttons names************************
  const buttonsTitle = ["clear", "apply"];
  // ******************************this should come from backend***********************
  const selectConsumptionType = [
    "data consumption",
    t('telemetry.energyConsumption'),
    "gas consumption",
  ];

  const dataConsumption = [
    "ess - electric switch systems - dc",
    "tgs - typhoon gas systems - dc",
    "tes - typhoon electric systems - dc",
    "hp - heating platform - dc",
  ];

  const electricConsumption = [
    "ess - electric switch systems - ec",
    "tes - typhoon electric systems - ec",
    "hp - heating platform - ec",
  ];

  const gasConsumption = [
    "tgs - typhoon gas systems - gc",
    "hp - heating platform - gc",
  ];

  // **************************redux***************************
  
  const { isF } = useUnitsStore();
  const selectedSwitch = useMCStore();
  const { essDc, tgsTesDc, hpDc, tgs, hpGc, ess, tes, hpEc } =
    selectedSwitch.selectSystem;
  const masterControlSelects = useMasterControlSelectStore();

  const { displaySelectBox } = masterControlSelects;
  const { selectedOne } = ess
    ? masterControlSelects.ess
    : tes
    ? masterControlSelects.tes
    : tgs
    ? masterControlSelects.tgs
    : essDc
    ? masterControlSelects.essDc
    : tgsTesDc
    ? masterControlSelects.tgsTesDc
    : hpDc
    ? masterControlSelects.hpDc
    : hpEc
    ? masterControlSelects.hpEc
    : hpGc && masterControlSelects.hpGc;

  const selectedSwitches = ess
    ? masterControlSelects.ess.selectedOne
    : tes
    ? masterControlSelects.tes.selectedOne
    : tgs
    ? masterControlSelects.tgs.selectedOne
    : essDc
    ? masterControlSelects.essDc.selectedOne
    : tgsTesDc
    ? masterControlSelects.tgsTesDc.selectedOne
    : hpDc
    ? masterControlSelects.hpDc.selectedOne
    : hpEc
    ? masterControlSelects.hpEc.selectedOne
    : hpGc
    ? masterControlSelects.hpGc.selectedOne
    : false;

  // ess || tes || teg ||  essDc || tgsDc || tesDc || hpDc || hpEc || hpGc
  const { essSwitch, flatEssSwitch } = useESSSwitchStore();
  const { tesSwitch, flatTesSwitch } = useTESSwitchStore();
  const { tgsSwitch, flatTgsSwitch } = useTGSSwitchStore();
  const hpElectricSwitch = useHPElectricSwitchStore();
  const hpGasSwitch = useHPGasSwitchStore();
  const { essDataConsumptionSwitch, essDataConsumptionSwitchSpecificLocation } =
    useESSDataConsumptionStore();
  const { tesDataConsumptionSwitch, tesDataConsumptionSwitchSpecificLocation } =
    useTESDataConsumptionStore();
  const { tgsDataConsumptionSwitch, tgsDataConsumptionSwitchSpecificLocation } =
    useTGSDataConsumptionStore();
  const hpDataConsumptionSwitch = useHPDataConsumptionStore();
  const chartData = useTelemetryChartDataStore();
  const {
    // essDataConsumpData,
    // tesDataConsumpData,
    // tgsDataConsumpData,
    hpDataConsumpData,
    essSwitchData,
    // tesSwitchData,
    // tgsSwitchData,
    hpElectricData,
    hpGasData,
  } = chartData;
  // ********************************************select system states******************************
  const [systemGreenCircle, setSystemGreenCircle] = useState(null);
  const [openSelections, setOpenSelections] = useState(false);
  const [isExpanded, setIsExpanded] = useState([false, false, false]);
  const [abrSelectedSystemTitle, setAbrSelectedSystemTitle] = useState(null);

  const unSelectSpecificLocationMachines = (
    swt,
    specificLocationKeys,
    machinesData,
    location
  ) => {
    specificLocationKeys.forEach((specificLocation) => {
      machinesData.forEach((machine) => {
        const machineKey = Object.keys(machine)[0];
        const dispatchOjb = {
          location,
          specificLocation,
          machine: machineKey,
        };
        if (swt === "ess") {
          useESSSwitchStore().essSpecificLocationUnselectMachine(dispatchOjb);
        } else if (swt === "tes") {
          useTESSwitchStore().tesSpecificLocationUnselectMachine(dispatchOjb);
        } else if (swt === "tgs") {
          useTGSSwitchStore().tgsSpecificLocationUnselectMachine(dispatchOjb);
        } else if (swt === "essDc") {
          useESSDataConsumptionStore().unselectSpecificLocationMachine(dispatchOjb);
        } else if (swt === "tgsTesDc") {
          useTESDataConsumptionStore().unselectSpecificLocationMachine(dispatchOjb);
          useTGSDataConsumptionStore().unselectSpecificLocationMachine(dispatchOjb);
        } else if (swt === "hpEc") {
          useHPElectricSwitchStore().hpEcSpecificLocationUnselectMachine(dispatchOjb);
        } else if (swt === "hpGc") {
          useHPGasSwitchStore().hpGcSpecificLocationUnselectMachine(dispatchOjb);
        } else if (swt === "hpDc") {
          useHPDataConsumptionStore().unselectSpecificLocationMachine(dispatchOjb);
        }
      });
    });
  };

  const handleUnSelectMachines = (location, swt, switchData) => {
    if (!location || !switchData) return;
    const el = Object.keys(switchData[location]);
    const elValue = Object.values(switchData[location]);
    if (elValue[0]?.machineType) {
      el.forEach((machine) => {
        if (swt === "ess") {
          useMasterControlSelectStore().unselectMachine({ location, machine });
        } else if (swt === "tes") {
          setUnSelectIndividualMachine({ location, machine });
        } else if (swt === "tgs") {
          setUnSelectIndividualMachine({ location, machine });
        } else if (swt === "hpEc") {
          useHPElectricSwitchStore().unselectIndividualMachine({ location, machine });
        } else if (swt === "hpGc") {
          useHPElectricSwitchStore().unselectIndividualMachine({ location, machine });
        } else if (swt === "essDc") {
          useESSDataConsumptionStore().unselectIndividualMachine({
              location,
              machine,
            });
        } else if (swt === "tgsTesDc") {
          useTESDataConsumptionStore().unselectIndividualMachine({
              location,
              machine,
            });
          useTGSDataConsumptionStore().unselectIndividualMachine({
              location,
              machine,
            });
        } else if (swt === "hpDc") {
          useHPDataConsumptionStore().unselectIndividualMachine({
              location,
              machine,
            });
        }
      });
    } else if (elValue.length > 0) {
      unSelectSpecificLocationMachines(swt, el, elValue, location);
    }

    
  };

  // **************************select system energy consumption or data consumption

  const loopAllMachinesHandler = (selectedSwitches, selectedSys) => {
    const locations = selectedSwitches && Object.keys(selectedSwitches);
    locations.map((location) =>
      handleUnSelectMachines(location, selectedSys, selectedSwitches);
  };

  useEffect(() => {
    // this resets all switches when system is changed

    useMasterControlSelectStore().resetAllSelect();
    if (ess) {
      loopAllMachinesHandler(flatEssSwitch, "ess");

     
    } else if (tes) {
      loopAllMachinesHandler(flatTesSwitch, "tes");

      // const locations = tesSwitch && Object.keys(tesSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'tes');
    } else if (tgs) {
      loopAllMachinesHandler(flatTgsSwitch, "tgs");

      // const locations = tgsSwitch && Object.keys(tgsSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'tgs');
    } else if (hpEc) {
      loopAllMachinesHandler(hpElectricSwitch, "hpEc");

      // const locations = hpElectricSwitch && Object.keys(hpElectricSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'hpEc');
    } else if (hpGc) {
      const locations = hpGasSwitch && Object.keys(hpGasSwitch);
      locations.map((location) => handleUnSelectMachines(location, "hpGc");
    } else if (essDc) {
      loopAllMachinesHandler(essDataConsumptionSwitch, "essDc");

      // const locations =
      //   essDataConsumptionSwitch && Object.keys(essDataConsumptionSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'essDc');
    } else if (tgsTesDc) {
      loopAllMachinesHandler(tesDataConsumptionSwitch, "tgsTesDc");
      loopAllMachinesHandler(tgsDataConsumptionSwitch, "tgsTesDc");

      // const locations =
      //   tesDataConsumptionSwitch && Object.keys(tesDataConsumptionSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'tgsTesDc');
    } else if (tgsTesDc) {
      // const locations =
      //   tgsDataConsumptionSwitch && Object.keys(tgsDataConsumptionSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'tgsTesDc');
    } else if (hpDc) {
      loopAllMachinesHandler(hpDataConsumptionSwitch, "hpDc");

      // const locations =
      //   hpDataConsumptionSwitch && Object.keys(hpDataConsumptionSwitch);
      // locations.map((location) => handleUnSelectMachines(location, 'hpDc');
    }
    // this is to reset the chart when system is changed
    return () => {
      useTelemetryStore().setSearchSystem(false);
    };
  }, [ess, tes, tgs, essDc, tgsTesDc, hpDc, hpGc, hpEc]);

  // ***********select switches******************************



  const presetSelectBoxArr = (swt, swtData) => {
    // isAllSelected
    const essLocations = Object.keys(swtData);
    useMasterControlSelectStore().selectAll({ switch: swt, status: false });
    // isLocationSelected
    const locationArr = essLocations.map((location) => false);
    useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: swt });
    // isMachineSelected
    const specificLocationArr = [];
    const machineArr = Object.values(swtData).map((location) => {
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

    //isSpecificLocationSelected
    useMasterControlSelectStore().selectSpecificLocation({
        arr: specificLocationArr,
        switch: swt,
      });

    // isMachineSelected
    useMasterControlSelectStore().selectMachine({ arr: machineArr, switch: swt });
  };

  useEffect(() => {
    if (ess) {
      if (!selectedOne) {
        
        presetSelectBoxArr("ess", essSwitch);
      }
    } else if (tes) {
      if (!selectedOne) {
      

        presetSelectBoxArr("tes", tesSwitch);
      }
    } else if (tgs) {
      if (!selectedOne) {
        presetSelectBoxArr("tgs", tgsSwitch);
        
        // );
      }
    } else if (essDc) {
      if (!selectedOne) {
        presetSelectBoxArr("essDc", essDataConsumptionSwitchSpecificLocation);

        
      }
    } else if (tgsTesDc) {
      if (!selectedOne) {
        presetSelectBoxArr(
          "tgsTesDc",
          tesDataConsumptionSwitchSpecificLocation
        );

       
      }
    } else if (tgsTesDc) {
      if (!selectedOne) {
        presetSelectBoxArr(
          "tgsTesDc",
          tgsDataConsumptionSwitchSpecificLocation
        );

     
      }
    } else if (hpDc) {
      if (!selectedOne) {
        presetSelectBoxArr("hpDc", hpDataConsumptionSwitch);

        
      }
    } else if (hpEc) {
      if (!selectedOne) {
        presetSelectBoxArr("hpEc", hpElectricSwitch);

       
      }
    } else if (hpGc) {
      if (!selectedOne) {
        presetSelectBoxArr("hpGc", hpGasSwitch);

       
      }
    }

    return () => {};
  }, [
    selectedOne,
    selectedSwitch,
    ess,
    tes,
    tgs,
    essDc,
    tgsTesDc,
    hpDc,
    hpGc,
    hpEc,
  ]);

  // *****************************onClick handle expansion of data, energy or gas consumption******************
  // '/images/masterCtr-select-btn.svg'
  const [arrowImg, setArrowImg] = useState([
    "/images/white-triangle-pointing-right.svg",
    "/images/white-triangle-pointing-right.svg",
    "/images/white-triangle-pointing-right.svg",
  ]);

  const handleExpansion = (idx) => {
    const copyArrowImg = [...arrowImg];
    const copyIsExpanded = [...isExpanded];

    copyIsExpanded[idx] = !isExpanded[idx];
    setIsExpanded(copyIsExpanded);

    if (isExpanded[idx] === true) {
      copyArrowImg[idx] = "/images/white-triangle-pointing-right.svg";
    } else copyArrowImg[idx] = "/images/masterCtr-select-btn.svg";
    setArrowImg(copyArrowImg);
  };

  // ************************************onClick of green circle to select system *********************************

  const onSelectSystem = (index) => {
    switch (index) {
      case 0:
        setSelectedSystemTitle("ess - dc");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("essDc");
        setControlSelectionDisplay(false);
        break;
      case 1:
        setSelectedSystemTitle("tgs/tes - dc");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("tgsTesDc");
        setControlSelectionDisplay(false);
        break;
      case 2:
        setSelectedSystemTitle("tgs/tes - dc");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("tgsTesDc");
        setControlSelectionDisplay(false);
        break;
      case 3:
        setSelectedSystemTitle("hp - heating platform - dc");
        setSystemGreenCircle(null);
        // setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("hpDc");
        setControlSelectionDisplay(false);
        break;
      case 4:
        setSelectedSystemTitle("ess - electric switch systems - ec");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("ess");
        setControlSelectionDisplay(false);
        break;
      case 5:
        setSelectedSystemTitle("tes - typhoon electric systems - ec");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("tes");
        setControlSelectionDisplay(false);
        break;
      case 6:
        setSelectedSystemTitle("hp - heating platform - ec");
        setSystemGreenCircle(null);
        // setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("hpEc");
        setControlSelectionDisplay(false);
        break;
      case 7:
        setSelectedSystemTitle("tgs - typhoon gas systems - gc");
        setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("tgs");
        setControlSelectionDisplay(false);
        break;
      case 8:
        setSelectedSystemTitle("hp - heating platform - gc");
        setSystemGreenCircle(null);
        // setSystemGreenCircle(index);
        setAbrSelectedSystemTitle("hpGc");
        setControlSelectionDisplay(false);
        break;
      default:
        break;
    }
  };

  // ***********************************onClick of the buttons(edit or apply)for select system**********************************
  const handleSelectSystemsButton = useCallback(
    (index) => {
      switch (index) {
        case 0:
          setSelectedSystemTitle(null);
          setSystemGreenCircle(null);
          useMCStore().unselectAllSystem();
          break;
        case 1:
          useTelemetryStore().selectSystem(abrSelectedSystemTitle);
          setOpenSelections(false);
          break;
        default:
          break;
      }
    },
    [abrSelectedSystemTitle]
  );

  // ******************************************it handles the select switch location*******************************
  const handleButtonClick = () => {
    useMasterControlSelectStore().toggleDisplaySelectBox();
  };

  // *********************************************handles search button***********************
  const getTelemetryData = (swtName, isDc, category) => {
    const startDate = formatTime(scheduleData.start, true);
    const endDate = formatTime(scheduleData.end, true);
    const swtSwitch = ess ? flatEssSwitch : tes ? flatTesSwitch : flatTgsSwitch;
    const swtSwitchE = ess ? essSwitch : tes ? tesSwitch : tgsSwitch;
    const deviceIds = getSelectedDeviceIds(
      masterControlSelects,
      swtSwitchE,
      swtName
    );
    if (ess || tes || tgs) {
      getTelemetryService({ deviceIds, startDate, endDate, category }).then(
        ({ data, unit }) => {
          const { intervalData, intervalKeys } = formatTelemetryChartData(
            data,
            swtName,
            swtSwitch,
            isF
          );
          const totalHours = getTotalSearchValues(data, "hourOfUsage");
          const totalConsumption = getTotalSearchValues(
            data,
            "consumption",
            swtName,
            isF
          );
    //       console.log("📊 Raw data:", data);
    // console.log("⏱️ Interval Keys (X-axis):", intervalKeys);
    // console.log("📈 Interval Data (values):", intervalData);
    // console.log("🕒 Total Usage Hours:", totalHours);
    // console.log("⚡ Total Consumption:", totalConsumption);
          const auditLogData = {
            actionType: "GLOBAL_TELEMETRY_OVERVIEW",
            deviceIds,
            deviceType: swtName.toUpperCase(),
            data: {
              startDate,
              endDate,
              isDataConsumption: isDc,
              totalUsageHours: totalHours,
              totalConsumption: totalConsumption,
              data: intervalData.map((machine) => {
                return {
                  deviceId: machine.machine,
                  usageHours: machine.totalUsageHours,
                  consumption: machine.totalConsumption,
                };
              }),
            },
          };

          useTelemetryChartDataStore().setTelemetryChartData({
              swtName: `${swtName}SwitchData`,
              data: {
                monthlyData: intervalData,
                monthlyKeys: intervalKeys,
              },
            });
          useTelemetryStore().setIntervalUnit(unit);
          useTelemetryStore().setTotalHours(totalHours);
          useTelemetryStore().setTotalConsumption(totalConsumption);
          setTelemetryData(intervalData);
          setCopyTelemetryState(intervalData);
          setCopyTelemetryDailyState(essSwitchData.dailyData);
          setTelemetryDataKeys(intervalKeys);
          setCopyTelemetryStateKeys(intervalKeys);
          useTelemetryStore().setAuditLogData(auditLogData);
        }
      ).catch((error) => {
      });

    }

    if (essDc || tgsTesDc) {
      const swtSwitch = essDc
        ? essDataConsumptionSwitch
        : tgsTesDc
        ? tesDataConsumptionSwitch
        : tgsDataConsumptionSwitch;
      const inhandIds = Object.values(swtSwitch)
        .map((zone) => {
          return Object.values(zone).map((machine) => {
            return machine.inhandId;
          });
        })
        .flat()
        .filter((el) => el);
      if (inhandIds.length) {
        getDataConsumptionService({ inhandIds, startDate, endDate }).then(
          (res) => {
            const intervalData = Object.values(res).map((machine, index) => {
              const machineData = getMachineDataByInhandId(
                Object.keys(res)[index],
                swtSwitch
              );
              return {
                machine: machineData.machineMac,
                switch: `${machineData.locationName} - ${machineData.machineName}`,
                isSelected: true,
                totalUsageHours: getTotalMachineValues(machine, "hourOfUsage"),
                totalConsumption: getTotalMachineValues(machine, "total"),
                barColor: "#FF0080",
                ...machine
                  .filter((el) => el.start_date)
                  .map((el, index) => {
                    const intervalName = el.start_date;
                    return {
                      [intervalName]: el.total || 0,
                      [`${intervalName}TEC`]: `${Math.floor(el.total || 0)} mb`,
                      [`${intervalName}THU`]: `${Math.floor(
                        el.hourOfUsage || 0
                      )} hours`,
                      [`${intervalName}Color`]:
                        index % 2 === 0 ? "#FF0080" : "#FF00D5",
                    };
                  })
                  .reduce((cur, result) => {
                    return { ...result, ...cur };
                  }, {}),
              };
            });

            const intervalKeys = [
              ...new Set(
                Object.values(res)
                  .map((machine) => {
                    return machine
                      .filter((el) => el.start_date)
                      .map((el) => el.start_date);
                  })
                  .flat()
              ),
            ];

            const totalHours = getTotalSearchValues(
              Object.values(res),
              "hourOfUsage",
              null,
              null,
              isDc
            );
            const totalConsumption = getTotalSearchValues(
              Object.values(res),
              "total",
              null,
              null,
              isDc
            );
            const auditLogData = {
              actionType: "GLOBAL_DATA_TELEMETRY_OVERVIEW",
              deviceIds: intervalData.map((machine) => machine.machine),
              deviceType: swtName.toUpperCase(),
              data: {
                startDate,
                endDate,
                isDataConsumption: isDc,
                totalUsageHours: totalHours,
                totalConsumption: totalConsumption,
                data: intervalData.map((machine) => {
                  return {
                    deviceId: machine.machine,
                    usageHours: machine.totalUsageHours,
                    consumption: machine.totalConsumption,
                  };
                }),
              },
            };

            useTelemetryChartDataStore().setTelemetryChartData({
                swtName: `${swtName}DataConsumpData`,
                data: {
                  monthlyData: intervalData,
                  monthlyKeys: intervalKeys,
                },
              });
            useTelemetryStore().setIntervalUnit("months");
            useTelemetryStore().setTotalHours(totalHours);
            useTelemetryStore().setTotalConsumption(totalConsumption);
            setTelemetryData(intervalData);
            setTelemetryDataKeys(intervalKeys);
            useTelemetryStore().setAuditLogData(auditLogData);
          }
        );
      } else {
        useTelemetryStore().setTotalHours(0);
        useTelemetryStore().setTotalConsumption(0);
        setTelemetryData([]);
        setTelemetryDataKeys([]);
      }
    }
  };

  const handleClickSearch = () => {
    if (
      (ess || tgs || tes || essDc || tgsTesDc || hpDc || hpGc || hpEc) &&
      selectedSwitches
    ) {
      useTelemetryStore().setSearchSystem(true);
      setControlSelectionDisplay(true);
      if (ess) {
        getTelemetryData("ess", false, "energy");
      } else if (tgs) {
        getTelemetryData("tgs", false, "fuel");
      } else if (tes) {
        getTelemetryData("tes", false, "energy");
      } else if (essDc) {
        getTelemetryData("ess", true);
      } else if (tgsTesDc) {
        getTelemetryData("tgs", true);
      } else if (tgsTesDc) {
        getTelemetryData("tes", true);
      } else if (hpDc) {
        return (
          setTelemetryData(hpDataConsumpData.dailyData),
          setCopyTelemetryState(hpDataConsumpData.dailyData),
          setTelemetryDataKeys(hpDataConsumpData.dailyKeys);
      } else if (hpGc) {
        return (
          setTelemetryData(hpGasData.monthlyData),
          setCopyTelemetryState(hpGasData.monthlyData),
          setCopyTelemetryDailyState(hpGasData.dailyData),
          setTelemetryDataKeys(hpGasData.monthlyKeys);
      } else if (hpEc) {
        return (
          setTelemetryData(hpElectricData.monthlyData),
          setCopyTelemetryState(hpElectricData.monthlyData),
          setCopyTelemetryDailyState(hpElectricData.dailyData),
          setTelemetryDataKeys(hpElectricData.monthlyKeys);
      }
    }
  };

  return (
    <ShadowWrapper>
      <Wrapper>
        <IndentWrapper>
          <SelectSystem
            gasSystems={gasConsumption}
            electricSystems={electricConsumption}
            dataSystems={dataConsumption}
            buttons={buttonsTitle}
            title={selectedSystemTitle}
            systemIndex={systemGreenCircle}
            onSelect={onSelectSystem}
            onClickButton={handleSelectSystemsButton}
            openSelections={openSelections}
            setOpenSelections={setOpenSelections}
            selectConsumptionType={selectConsumptionType}
            handleExpansion={handleExpansion}
            isExpanded={isExpanded}
            arrowImg={arrowImg}
          />

          <SelectSwitches
            selectedOne={selectedOne}
            ess={ess}
            tgs={tgs}
            tes={tes}
            essDc={essDc}
            tgsTesDc={tgsTesDc}
            // tesDc={tesDc}
            hpDc={hpDc}
            hpGc={hpGc}
            hpEc={hpEc}
            displaySelectBox={displaySelectBox}
            essSwitch={essSwitch}
            tesSwitch={tesSwitch}
            tgsSwitch={tgsSwitch}
            // tgsSwitch={testTgsSwitch}
            hpElectricSwitch={hpElectricSwitch}
            hpGasSwitch={hpGasSwitch}
            essDataConsumptionSwitch={essDataConsumptionSwitchSpecificLocation}
            tesDataConsumptionSwitch={tesDataConsumptionSwitchSpecificLocation}
            tgsDataConsumptionSwitch={tgsDataConsumptionSwitchSpecificLocation}
            hpDataConsumptionSwitch={hpDataConsumptionSwitch}
            handleButtonClick={handleButtonClick}
          />

          <SelectDates
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
          />
        </IndentWrapper>
        <WrapperButton>
          <SearchButton title={"search"} onClick={handleClickSearch} />
        </WrapperButton>
      </Wrapper>
    </ShadowWrapper>
  );
};

export default MainSelections;

const ShadowWrapper = styled.div`
  width: 1216px;
  height: 86px;
  margin-top: 8px;
  margin-bottom: 8px;

  ${layerB}

  border-radius: 49px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1212px;
  height: 82px;

  ${layerA180Deg}

  border-radius: 47px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
`;

const IndentWrapper = styled.div`
  width: 1099px;
  height: 69px;
  margin-right: 9px;

  ${layerADark}

  border-radius: 41px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
`;

const WrapperButton = styled.div`
  width: auto;
  height: auto;
`;
