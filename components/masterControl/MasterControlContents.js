import { useEffect, useState, useCallback } from 'react';
import { useESSSwitchStore, useLocationsStore, useMCCommandStore, useMCStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore, useUserStore } from '../zustand-stores';
import { useMessageBoxesStore, useSelectedMachinesStore } from '../zustand-stores';

import styled from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
} from '../styles/commonStyles';
import DisplayDialAndSections from './controls/mainSelection/DisplayDialAndSections';
import ViewCommand from './userMessages/ViewCommand';
import SelectSystemApplyMessageBox from './userMessages/SelectSystemApplyMessageBox';
import MasterControlCommandMain from './M.C.Command/MasterControlCommandMain';
import moment from 'moment';
import {
  updateBlowersMasterControlService,
  updateSwitchesMasterControlService,
} from '../../services/masterControl.service';
import { convertFahrenheitToCelsius, formatTime } from '../../helpers/helpers';
import { getAuditTrailService } from '../../services';
import { clear } from '@testing-library/user-event/dist/clear';
import testData from '../../test_data/testData';

const MasterControlContents = ({
  // data,
  // selectStatus,
  setCommandConfirmed,
  handleCreateNewCommand,
  handleCreateNewCommandMessageBox,
  messageBoxOfCreateNewCommand,
  handleMessageBoxOfSelectSystem,
  // commandConfirmed,
  // controllersStatus,
  // setControllersStatus,
}) => {
  // redux
    const mCCommandState = useMCCommandStore();
  const number = mCCommandState.commandNumber;
  const messageBoxesState = useMessageBoxesStore();
  const selectedMachines = useSelectedMachinesStore();
  const { flatEssSwitch } = useESSSwitchStore();
  const { flatTesSwitch } = useTESSwitchStore();
  const { flatTgsSwitch } = useTGSSwitchStore();
  const selectedSwitch = useMCStore();
  const UserState = useUserStore();
  const { user } = UserState;
  const { viewCommand } = mCCommandState;
  const { applyButton } = messageBoxesState;
  const instantHeatState = selectedMachines.instantHeat;
  const { ready, defaultTemp } = selectedMachines.snowSensor;
  const constantTempState = selectedMachines.optionalConstantTemp;
  const heatingScheduleState = selectedMachines.heatingSchedule.ready;
  const heatingScheduleTemp = selectedMachines.heatingScheduleList[0].inputTemp;
  const heatingScheduleStart = selectedMachines.heatingScheduleList[0].start;
  const heatingScheduleEnd = selectedMachines.heatingScheduleList[0].end;
  const heatingScheduleIsF = selectedMachines.heatingScheduleList[0].isF;
  const scheduleDates = selectedMachines.heatingScheduleList[0];
  const isWindFactorState = selectedMachines.windFactor.ready;
  const isFanOnlyState = selectedMachines.isFanOnly;
  const { ess, tgs, tes, hp } = selectedSwitch.selectSystem;
  const {
    isFanOnly,
    heatingSchedule,
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    windFactor,
  } = selectedMachines.mCOff;

  const { atsState } = selectedMachines;
  const { swt, selections } = atsState;
  const unitState = useUnitsStore();
  const { isF } = unitState;
  // useState
  const [messageBoxContent, setMessageBoxContent] = useState({});
  const [componentTitle, setComponentTitle] = useState(null);
  // saves all the selected switches and locations
  const [selectedSwitches, setSelectedSwitches] = useState([]);
  // state to change the colors of controllers after confirmed the command's changes

  const date = moment().format('DDMMYY');

  useEffect(() => {
    if (ess) {
      setComponentTitle('ess');
    } else if (tes) {
      setComponentTitle('tes');
    } else if (tgs) {
      setComponentTitle('tgs');
    } else if (hp) {
      setComponentTitle('hp');
    } else {
      setComponentTitle(null);
    }
  }, [selectedSwitch]);
  let apiCallMade = false;

  const heatingProgramHandler = (
    location,
    machine,
    specificLocation,
    system,
    deviceIds,
    newData
  ) => {
  

    // instant Heat
    if (instantHeat) {
      // **if Deactivate for instant heat is TRUE, then the code below will be executed
      switch (system) {
        case 'ess':
          useESSSwitchStore().resetInstantHeat({
              location,
              machine,
              specificLocation,
            });
          break;
        case 'tgs':
          useTGSSwitchStore().resetInstantHeat({ location, machine, specificLocation });
          break;
        case 'tes':
          useTESSwitchStore().resetInstantHeat({ location, machine, specificLocation });
          break;
        default:
          break;
      }
    } else if (instantHeatState.ready) {
      // else if the instant heat is selected, the code below will be executed
      useMCStore().setControllersStatus(0);

      switch (system) {
        case 'ess':
          useESSSwitchStore().setInstantHeatIsReady({
              location,
              specificLocation,
              machine,
              isF: instantHeatState.isF,
              temp: instantHeatState.temp,
            });

          break;
        case 'tgs':
          useTGSSwitchStore().setInstantHeatIsReady({
              location,
              specificLocation,
              machine,
              isF: instantHeatState.isF,
              temp: instantHeatState.temp,
            });

          break;
        case 'tes':
          setInstantHeatIsReady({
              location,
              specificLocation,
              machine,
              isF: instantHeatState.isF,
              temp: instantHeatState.temp,
            });
          break;
        default:
          break;
      }
    } else {
    }
    // snow sensor
    if (snowSensor) {
      // **if Deactivate for snow sensor is TRUE, then the code below will be executed

      switch (system) {
        case 'ess':
          useESSSwitchStore().resetSnowSensor({
              location,
              specificLocation,
              machine,
            });
          break;
        case 'tgs':
          useTGSSwitchStore().resetSnowSensor({ location, specificLocation, machine });
          break;
        case 'tes':
          useTESSwitchStore().resetSnowSensor({ location, specificLocation, machine });
          break;
        default:
          break;
      }
    } else if (ready) {
      // else if the snow sensor is selected, the code below will be executed
      useMCStore().setControllersStatus(1);

      switch (system) {
        case 'ess':
          useMCStore().setSnowSensor({ location, specificLocation, machine });
          break;
        case 'tgs':
          setSnowSensor({ location, specificLocation, machine });
          break;
        case 'tes':
          setSnowSensor({ location, specificLocation, machine });
          break;
        default:
          break;
      }
    }
    //  fan only
    if (system === 'tgs') {
      if (isFanOnly) {
        // **if Deactivate for fan only is TRUE, then the code below will be executed
        setFanOnly({
            location,
            machine,
            specificLocation,
            state: false,
          });
      } else if (isFanOnlyState) {
        // else if the fan only is selected, the code below will be executed
        useMCStore().setControllersStatus(2);
        setFanOnly({
            location,
            machine,
            specificLocation,
            state: true,
          });
      }
    }
    // optional constant temperature
    if (system !== 'tgs') {
      if (optionalConstantTemp) {
        // **if Deactivate for optional constant temperature is TRUE, then the code below will be executed
        if (system === 'ess') {
          useESSSwitchStore().resetOptionalConstantTemp({
              location,
              specificLocation,
              machine,
            });
        } else if (system === 'tes') {
          useTESSwitchStore().resetOptionalConstantTemp({
              location,
              specificLocation,
              machine,
            });
        }
      } else if (constantTempState.ready) {
        // else if optional constant temperature is selected, the code below will be executed
        useMCStore().setControllersStatus(2);
        if (system === 'ess') {
          useESSSwitchStore().setOptionalConstantTempReady({
              location,
              specificLocation,
              machine,
              isF: constantTempState.isF,
              temp: constantTempState.temp,
            });
        } else if (system === 'tes') {
          setOptionalConstantTempIsReady({
              location,
              specificLocation,
              machine,
              isF: constantTempState.isF,
              temp: constantTempState.temp,
            });
        }
      }
    }
    // heating schedule
    if (heatingSchedule) {
      // **if Deactivate for heating schedule is TRUE, then the code below will be executed
      switch (system) {
        case 'ess':
          useESSSwitchStore().resetHeatingSchedule({
              location,
              specificLocation,
              machine,
            });

          break;
        case 'tgs':
          useTGSSwitchStore().resetHeatingSchedule({
              location,
              specificLocation,
              machine,
            });

          break;
        case 'tes':
          useTESSwitchStore().resetHeatingSchedule({
              location,
              specificLocation,
              machine,
            });
          break;
        default:
          break;
      }
    } else if (heatingScheduleState) {
      // else if heating schedule is selected, the code below will be executed
      useMCStore().setControllersStatus(3);

      switch (system) {
        case 'ess':
          useESSSwitchStore().setReadyHeatingSchedule({
              location,
              machine,
              specificLocation,
              state: true,
            });
          useESSSwitchStore().addHeatingSchedule({
              location,
              specificLocation,
              machine,
              start: heatingScheduleStart,
              end: heatingScheduleEnd,
              inputTemp: heatingScheduleTemp,
              isF: heatingScheduleIsF,
              index: 0,
            });

          break;
        case 'tgs':
          setReadyHeatingSchedule({
              location,
              machine,
              specificLocation,
              state: true,
            });
          setAddHeatingSchedule({
              location,
              specificLocation,
              machine,
              start: heatingScheduleStart,
              end: heatingScheduleEnd,
              inputTemp: heatingScheduleTemp,
              isF: heatingScheduleIsF,
              index: 0,
            });

          break;
        case 'tes':
          setReadyHeatingSchedule({
              location,
              specificLocation,
              machine,
              state: true,
            });
          setAddHeatingSchedule({
              location,
              specificLocation,
              machine,
              start: heatingScheduleStart,
              end: heatingScheduleEnd,
              inputTemp: heatingScheduleTemp,
              isF: heatingScheduleIsF,
              index: 0,
            });
          break;
        default:
          break;
      }
    }
    // wind factor
    if (windFactor) {
      // **if Deactivate for wind factor is TRUE, then the code below will be executed

      switch (system) {
        case 'ess':
          useESSSwitchStore().resetWindFactor({ location, specificLocation, machine });
          break;
        case 'tgs':
          useTGSSwitchStore().resetWindFactor({ location, specificLocation, machine });
          break;
        case 'tes':
          useTESSwitchStore().resetWindFactor({ location, specificLocation, machine });
          break;
        default:
          break;
      }
    } else if (isWindFactorState) {
      // else if wind factor is selected, the code below will be executed
      useMCStore().setControllersStatus(4);

      switch (system) {
        case 'ess':
          useMCStore().setWindFactor({ location, specificLocation, machine });
          break;
        case 'tgs':
          setWindFactor({ location, specificLocation, machine });
          break;
        case 'tes':
          setWindFactor({ location, specificLocation, machine });
          break;
        default:
          break;
      }
    }
    // select ATS
    if (swt) {
      switch (system) {
        case 'ess':
          useESSSwitchStore().setAtsSelection({
              location,
              machine,
              specificLocation,
              selection: selections,
            });

          break;
        case 'tgs':
          useTGSSwitchStore().setAtsSelection({
              location,
              machine,
              specificLocation,
              selection: selections,
            });

          break;
        case 'tes':
          useTESSwitchStore().setAtsSelection({
              location,
              machine,
              specificLocation,
              selection: selections,
            });
          break;
        default:
          break;
      }
    }

    // !! for backend
    if (!apiCallMade) {
      // Check if the API call has already been made
      apiCallMade = true; // Mark the API call as made
      if (system === 'ess') {
        updateSwitchesMasterControlService(deviceIds, 'ESS', newData).then(
          () => {
            getAuditTrailService({
              actionType: 'GLOBAL_MASTER_CONTROL',
            }).then((res) => {
              useMCCommandStore().setCommandInfo({
                  data: res,
                  user,
                  isF,
                  flatEssSwitch,
                  flatTgsSwitch,
                  flatTesSwitch,
                });
            });
          }
        );
      } else {
        const verifiedSystem = system === 'tgs' ? 'TGS' : 'TES';
        updateBlowersMasterControlService(
          deviceIds,
          verifiedSystem,
          newData
        ).then(() => {
          getAuditTrailService({
            actionType: 'GLOBAL_MASTER_CONTROL',
          }).then((res) => {
            useMCCommandStore().setCommandInfo({
                data: res,
                user,
                isF,
                flatEssSwitch,
                flatTgsSwitch,
                flatTesSwitch,
              });
          });
        });
      }
    }

    // !! extra
    // switch (system) {
    //   case 'ess':
    //    updateSwitchesMasterControlService(deviceIds, 'ESS', newData).then(() => {
    //     getAuditTrailService({
    //       actionType: 'GLOBAL_MASTER_CONTROL',
    //     }).then((res) => {
    //       dispatch(
    //         handleCommandInfo({
    //           data: res,
    //           user,
    //           isF,
    //           flatEssSwitch,
    //           flatTgsSwitch,
    //           flatTesSwitch,
    //         })
    //       );
    //     });
    //   });
    //     break;
    //   case 'tgs':
    //    updateBlowersMasterControlService(deviceIds, 'TGS', newData).then(() => {
    //     getAuditTrailService({
    //       actionType: 'GLOBAL_MASTER_CONTROL',
    //     }).then((res) => {
    //       dispatch(
    //         handleCommandInfo({
    //           data: res,
    //           user,
    //           isF,
    //           flatEssSwitch,
    //           flatTgsSwitch,
    //           flatTesSwitch,
    //         })
    //       );
    //     });
    //   });
    //     break;
    //   case 'tes':
    //     updateBlowersMasterControlService(deviceIds, 'TES', newData).then(() => {
    //     getAuditTrailService({
    //       actionType: 'GLOBAL_MASTER_CONTROL',
    //     }).then((res) => {
    //       dispatch(
    //         handleCommandInfo({
    //           data: res,
    //           user,
    //           isF,
    //           flatEssSwitch,
    //           flatTgsSwitch,
    //           flatTesSwitch,
    //         })
    //       );
    //     });
    //   });
    //     break;
    //   default:
    //     break;
    // }
  };

  const saveCommandHandler = (
    userId,
    commandKey,
    locations,
    specificLocations,
    machines,
    sumOfSwitches,
    system,
    option,
    option2
  ) => {
    const keyValue = Object.entries(option)[0];
    const keyValueAts = Object.entries(option2)[0];
    // to create a new command
    useMCCommandStore().saveCommand({
        user: userId,
        commandData: {
          [`${commandKey}`]: {
            locations,
            specificLocations,
            machines,
            system,
            switches: sumOfSwitches,
            [keyValueAts[0]]: keyValueAts[1],
            deactivate: {
              instantHeat,
              isFanOnly,
              heatingSchedule,
              optionalConstantTemp,
              snowSensor,
              windFactor,
            },
            isF,
            parameters: {
              instantHeat: instantHeatState.ready
                ? instantHeatState.isF
                  ? `active ${instantHeatState.temp}°F`
                  : `active ${instantHeatState.temp}°C`
                : null,
              // fanOnly: isFanOnlyState ? 'ready' : null,
              [keyValue[0]]: keyValue[1],
              snowSensor: ready ? 'ready' : null,
              heatingSchedule: heatingScheduleState
                ? heatingScheduleIsF
                  ? `ready ${heatingScheduleTemp}°F`
                  : `ready ${heatingScheduleTemp}°C`
                : null,
              windFactor: isWindFactorState ? 'ready' : null,
            },
          },
        },
      });
  };

  const loopAllMachinesToDispatchProgramsHandler = (
    switches,
    system,
    deviceIds,
    newData
  ) => {
    Object.keys(switches).forEach((location) =>
      Object.keys(switches[location]).forEach((el) => {
        if (switches[location][el]?.machineType) {
          if (switches[location][el]?.isSelected) {
            heatingProgramHandler(
              location,
              el,
              null,
              system,
              deviceIds,
              newData
            );
          }
        } else {
          Object.keys(switches[location][el]).forEach((machine) => {
            if (switches[location][el][machine]?.isSelected) {
              heatingProgramHandler(
                location,
                machine,
                el,
                system,
                deviceIds,
                newData
              );
            }
          });
        }
      });
  };

  // !! TEST DATA!!
  // const locations = useLocationsStore();
  // const { testEssSwitch, testTgsSwitch } = testData(
  //   flatEssSwitch,
  //   flatTgsSwitch,
  //   locations
  // );

  const handleCreateCommand = useCallback(() => {
    // to create a new command to the format of mCCommandSlice.js
    let sumOfSwitches = 0;
    const machines = [];
    const specificLocations = [];
    const deviceIds = [];
    const locations = selectedSwitches.map((value) => {
      const newLocations = Object.keys(value)[0];
      const locationValue = Object.values(value)[0];
      const machineValue = Object.values(locationValue);
      let newMachines;
      // let newDeviceIds;

      if (machineValue.some((el) => el?.deviceMac)) {
        specificLocations.push([]);
        newMachines = Object.keys(locationValue).map((el) => el);
        // newDeviceIds = machineValue.map((el) => el?.deviceMac);
      } else {
        const newSpecificLocations = Object.keys(locationValue);
        specificLocations.push(newSpecificLocations);
        newMachines = Object.keys(Object.values(locationValue)[0]).map(
          (el) => el
        );
        // newDeviceIds = Object.values(Object.values(locationValue)[0]).map(
        //   (el) => el?.deviceMac
        // );
      }

      sumOfSwitches += newMachines.length;
      machines.push(newMachines);
      deviceIds.push(...newMachines);
      // deviceIds.push(...newDeviceIds);
      return newLocations;
    });

    const newData = {
      commandNumber: number,
      actionType: 'GLOBAL_MASTER_CONTROL',
      ...(instantHeatState.ready && {
        instant_temp: instantHeatState.ready
          ? instantHeatState.isF
            ? convertFahrenheitToCelsius(+instantHeatState.temp)
            : +instantHeatState.temp
          : null,
      }),
      ...(instantHeatState.ready && { on_switch: 1 }),
      ...(instantHeat === true && { on_switch: 0 }),
      ...(constantTempState.ready && {
        constant_temp: constantTempState.ready
          ? constantTempState.isF
            ? convertFahrenheitToCelsius(+constantTempState.temp)
            : +constantTempState.temp
          : null,
      }),
      ...(constantTempState.ready && { on_constant: 1 }),
      ...(optionalConstantTemp === true && { on_constant: 0 }),
      ...(ready && { snow_enabled: 1 }),
      ...(snowSensor === true && { snow_enabled: 0 }),
      ...(isWindFactorState && { wind: 1 }),
      ...(windFactor === true && { wind: 0 }),
      ...(heatingScheduleState && {
        schedule: {
          startDate: formatTime(heatingScheduleStart),
          endDate: formatTime(heatingScheduleEnd),
          threshold: heatingScheduleState
            ? heatingScheduleIsF
              ? convertFahrenheitToCelsius(+heatingScheduleTemp)
              : +heatingScheduleTemp
            : null,
        },
      }),
      ...(heatingSchedule === true && {
        deleteCurrentSchedule: heatingSchedule === true,
      }),
      ...(isFanOnlyState && { fan: 1 }),
      ...(isFanOnly === true && { fan: 0 }),
      ...(selections.indexOf(true) !== -1 && { EBP: selections.indexOf(true) }),
    };

    const commandKey = `mca-${user.user_id}-${date}-${
      number < 10 ? `${'0' + number} ` : number
    }`;

    const userId = user.user_id;

    if (tgs) {
      // tgs switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = tgsSwitchSlice (ex:instant heat program set to 150c and applied)
      const fanOnly = isFanOnlyState ? 'ready' : null;
      const option = {
        fanOnly,
      };
      const ats = selections[0]
        ? { reactivate: true, block: false }
        : selections[1]
        ? { reactivate: false, block: true }
        : { reactivate: false, block: false };
      const option2 = { ats };

      saveCommandHandler(
        userId,
        commandKey,
        locations,
        specificLocations,
        machines,
        sumOfSwitches,
        'tgs-typhoon gas system',
        option,
        option2
      );

      loopAllMachinesToDispatchProgramsHandler(
        flatTgsSwitch,
        'tgs',
        deviceIds,
        newData
      );

      //!! testTgsLocationsAll
      // loopAllMachinesToDispatchProgramsHandler(
      //   testTgsSwitch,
      //   'tgs',
      //   deviceIds,
      //   newData
      // );
      // !!
    } else if (tes) {
      // tes switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = tesSwitchSlice (ex:instant heat program set to 150c and applied)
      const optionalConstantTemp = constantTempState.ready
        ? constantTempState.isF
          ? `ready ${constantTempState.temp}°F`
          : `ready ${constantTempState.temp}°C`
        : null;
      const option = {
        optionalConstantTemp,
      };

      const ats = selections[2]
        ? { activateTgs: true, reactivate: false, block: false }
        : selections[0]
        ? { activateTgs: false, reactivate: true, block: false }
        : selections[1]
        ? { activateTgs: false, reactivate: false, block: true }
        : { activateTgs: false, reactivate: false, block: false };

      const option2 = {
        ats,
      };
      saveCommandHandler(
        userId,
        commandKey,
        locations,
        specificLocations,
        machines,
        sumOfSwitches,
        'tes-typhoon electric system',
        option,
        option2
      );

      loopAllMachinesToDispatchProgramsHandler(
        flatTesSwitch,
        'tes',
        deviceIds,
        newData
      );
    } else if (ess) {
      // ess switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = essSwitchSlice (ex:instant heat program set to 150c and applied)
      const optionalConstantTemp = constantTempState.ready
        ? constantTempState.isF
          ? `ready ${constantTempState.temp}°F`
          : `ready ${constantTempState.temp}°C`
        : null;
      const option = {
        optionalConstantTemp,
      };

      const ats = selections[0]
        ? { reactivate: true, block: false }
        : selections[1]
        ? { reactivate: false, block: true }
        : { reactivate: false, block: false };

      const option2 = {
        ats,
      };
     
      saveCommandHandler(
        userId,
        commandKey,
        locations,
        specificLocations,
        machines,
        sumOfSwitches,
        'ess-typhoon electric system',
        option,
        option2
      );

      loopAllMachinesToDispatchProgramsHandler(
        flatEssSwitch,
        'ess',
        deviceIds,
        newData
      );

      //!! testEssLocationsAll
      // loopAllMachinesToDispatchProgramsHandler(
      //   testEssSwitch,
      //   'ess',
      //   deviceIds,
      //   newData
      // );
      // !!
    }
  }, [
    ess,
    tgs,
    tes,
    instantHeatState,
    ready,
    defaultTemp,
    constantTempState,
    heatingScheduleState,
    heatingScheduleTemp,
    heatingScheduleStart,
    heatingScheduleEnd,
    heatingScheduleIsF,
    isWindFactorState,
    isFanOnlyState,
    selections,
    isFanOnly,
    heatingSchedule,
    instantHeat,
    optionalConstantTemp,
    snowSensor,
    windFactor,
    selectedSwitches,
  ]);

  const handleDispatchAfterClickApplyButton = () => {
    useMCCommandStore().setApplyMessageBox(false);
    setCommandConfirmed(true);
    useMCCommandStore().applyCommand(true);
  };

  // 2 buttons of message box (edit and confirm) that appears after clicking on apply button
  const handleCommandMessageBoxButtons = (e, index) => {
    switch (index) {
      // *****Edit button. it closes the message box
      case 0: {
        useMCCommandStore().setApplyMessageBox(false);
        break;
      }
      // *****Confirm button. it closes the message box, creates a new command and sends the changes to backend.
      case 1: {
        handleCreateCommand();
        // handleCreateNewCommand(e,index,false)
        // TODO
        handleDispatchAfterClickApplyButton();

        break;
      }
      default:
        break;
    }
  };

  // check if the scheduler is ready
  const checkSchedulerStatus = heatingScheduleState;
  // time and date
  const start = scheduleDates.start;
  const end = scheduleDates.end;
  const startTime =
    checkSchedulerStatus &&
    `${start.time.hour}:${start.time.minute}${start.time.division}`;
  const startDate =
    checkSchedulerStatus && `${start.date.toLocaleDateString()}`;
  const endTime =
    checkSchedulerStatus &&
    `${end.time.hour}:${end.time.minute}${end.time.division}`;
  const endDate = checkSchedulerStatus && `${end.date.toLocaleDateString()}`;

  // Ess, Tgs and Tes : message box showing what was changed after clicking on apply button
  const handleMessageBox = () => {
    const messageDescription = 'confirm parameters to be applied';
    const selectedSystem = ess
      ? 'ess - electric switch system'
      : tgs
      ? 'tgs - typhoon gas system'
      : tes
      ? 'tes - typhoon electric system'
      : '';

    const selectedLocationsAndMachines = selectedSwitches;

    const messageInstantHeat = {
      title: 'instant heat program',
      state: instantHeat
        ? 'off'
        : instantHeatState.ready === false
        ? '------'
        : 'active' + ' ' + instantHeatState.temp,
    };

    const messageSnowSensor = {
      title: 'snow sensor program',
      state: snowSensor
        ? 'off'
        : ready
        ? 'ready' + ' ' + defaultTemp
        : '------',
    };

    const messageFanOnly = {
      title: ' fan only program',
      state: isFanOnly ? 'off' : isFanOnlyState ? 'active' : '------',
    };

    const messageOptionalTemp = {
      title: ' optional constant temp. program',
      state: optionalConstantTemp
        ? 'off'
        : constantTempState.ready === false
        ? '------'
        : 'ready' + ' ' + constantTempState.temp,
    };

    const messageHeatingScheduleTemp = {
      title: 'heating schedule program',
      state: heatingSchedule
        ? 'off'
        : heatingScheduleState === false
        ? '------'
        : `ready ${heatingScheduleTemp}`,
      scheduleDates:
        startDate && `${startTime} ${startDate}-${endTime} ${endDate}`,
    };

    const messageWindFactor = {
      title: 'wind factor program',
      state: windFactor ? 'off' : isWindFactorState ? 'ready' : '------',
    };
    return setMessageBoxContent({
      selectedSystem,
      selectedLocationsAndMachines,
      title: [
        messageInstantHeat,
        tgs ? messageFanOnly : messageSnowSensor,
        tgs ? messageSnowSensor : messageOptionalTemp,
        messageHeatingScheduleTemp,
        messageWindFactor,
      ],
      content: messageDescription,
    });
  };
  return (
    <Wrapper onClick={handleCreateNewCommandMessageBox}>
      <TitleContainer>
        <TitleWrapper>
          <Title>
            master control {componentTitle && `- ${componentTitle}`}
          </Title>
        </TitleWrapper>
      </TitleContainer>

      <MainSection onClick={handleMessageBoxOfSelectSystem}>
        {viewCommand && <ViewCommand />}

        {applyButton && (
          <WrapperMessageBox>
            <SelectSystemApplyMessageBox
              title={'master control command'}
              message={messageBoxContent}
              handleButtons={handleCommandMessageBoxButtons}
            />
          </WrapperMessageBox>
        )}

        <DisplayDialAndSections
          // data={data}
          // selectStatus={selectStatus}
          // controllersStatus={controllersStatus}
          // commandConfirmed={commandConfirmed}
          handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
          messageBoxOfCreateNewCommand={messageBoxOfCreateNewCommand}
          // isViewCommand={viewCommand}
        />

        <MasterControlCommandMain
          handleMessageBox={handleMessageBox}
          selectedSwitches={selectedSwitches}
          setSelectedSwitches={setSelectedSwitches}
          handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
          // commandConfirmed={commandConfirmed}
        />
      </MainSection>
    </Wrapper>
  );
};
export default MasterControlContents;

// // TODO: this code was in handleCreateCommand function
//   // tgs switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = tgsSwitchSlice (ex:instant heat program set to 150c and applied)
//   if (tgs) {
//     // to create a new command
//     // dispatch(
//     //   handleSaveCommand({
//     //     user: userId,
//     //     commandData: {
//     //       [`${commandKey}`]: {
//     //         locations,
//     //         specificLocations,
//     //         machines,
//     //         system: 'tgs-typhoon gas system',
//     //         switches: sumOfSwitches,
//     //         ats: selections[0]
//     //           ? { reactivate: true, block: false }
//     //           : selections[1]
//     //           ? { reactivate: false, block: true }
//     //           : { reactivate: false, block: false },
//     //         deactivate: {
//     //           instantHeat,
//     //           isFanOnly,
//     //           heatingSchedule,
//     //           optionalConstantTemp,
//     //           snowSensor,
//     //           windFactor,
//     //         },
//     //         isF,
//     //         parameters: {
//     //           instantHeat: instantHeatState.ready
//     //             ? instantHeatState.isF
//     //               ? `active ${instantHeatState.temp}°F`
//     //               : `active ${instantHeatState.temp}°C`
//     //             : null,
//     //           fanOnly: isFanOnlyState ? 'ready' : null,
//     //           snowSensor: ready ? 'ready' : null,
//     //           heatingSchedule: heatingScheduleState
//     //             ? heatingScheduleIsF
//     //               ? `ready ${heatingScheduleTemp}°F`
//     //               : `ready ${heatingScheduleTemp}°C`
//     //             : null,
//     //           windFactor: isWindFactorState ? 'ready' : null,
//     //         },
//     //       },
//     //     },
//     //   })
//     // );
//     const fanOnly = isFanOnlyState ? 'ready' : null;
//     const option = {
//       fanOnly,
//     };
//     const ats = selections[0]
//       ? { reactivate: true, block: false }
//       : selections[1]
//       ? { reactivate: false, block: true }
//       : { reactivate: false, block: false };
//     const option2 = { ats };

//     saveCommandHandler(
//       userId,
//       commandKey,
//       locations,
//       specificLocations,
//       machines,
//       sumOfSwitches,
//       'tgs-typhoon gas system',
//       option,
//       option2
//     );

//     // loopAllMachinesToDispatchProgramsHandler(
//     //   flatTgsSwitch,
//     //   'tgs',
//     //   deviceIds,
//     //   newData
//     // );

//     // Object.keys(flatTgsSwitch).forEach((location) =>
//     //   Object.keys(flatTgsSwitch[location]).forEach((el) => {
//     //     if (flatTgsSwitch[location][el]?.machineType) {
//     //       if (flatTgsSwitch[location][el]?.isSelected) {
//     //         heatingProgramHandler(
//     //           location,
//     //           el,
//     //           null,
//     //           'tgs',
//     //           deviceIds,
//     //           newData
//     //         );
//     //       }
//     //     } else {
//     //       Object.keys(flatTgsSwitch[location][el]).forEach((machine) => {
//     //         if (flatTgsSwitch[location][el][machine]?.isSelected) {
//     //           heatingProgramHandler(
//     //             location,
//     //             machine,
//     //             el,
//     //             'tgs',
//     //             deviceIds,
//     //             newData
//     //           );
//     //         }
//     //       });
//     //     }
//     //   })
//     // );

//     // Object.keys(flatTgsSwitch).forEach((location) =>
//     //   Object.keys(flatTgsSwitch[location]).forEach((machine) => {
//     //     if (flatTgsSwitch[location][machine].isSelected) {
//     //       // instant heat
//     //       if (instantHeat) {
//     //         useTGSSwitchStore().resetInstantHeat({ location, machine });
//     //       } else if (instantHeatState.ready) {
//     //         // else if the instant heat is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(0);
//     //         dispatch(
//     //           tgsHandleInstantHeatIsReady({
//     //             location,
//     //             machine,
//     //             isF: instantHeatState.isF,
//     //             temp: instantHeatState.temp,
//     //           })
//     //         );
//     //       }
//     //       //  fan only
//     //       if (isFanOnly) {
//     //         // **if Deactivate for fan only is TRUE, then the code below will be executed
//     //         dispatch(
//     //           tgsHandleFanOnly({
//     //             location,
//     //             machine,
//     //             state: false,
//     //           })
//     //         );
//     //       } else if (isFanOnlyState) {
//     //         // else if the fan only is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(0);
//     //         dispatch(
//     //           tgsHandleFanOnly({
//     //             location,
//     //             machine,
//     //             state: true,
//     //           })
//     //         );
//     //       }
//     //       // snowSensor
//     //       if (snowSensor) {
//     //         // **if Deactivate for snow sensor is TRUE, then the code below will be executed
//     //         useTGSSwitchStore().resetSnowSensor({ location, machine });
//     //       } else if (ready) {
//     //         // else if the snow sensor is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(1);
//     //         setSnowSensor({ location, machine });
//     //       }
//     //     }
//     //     // heating scheduler
//     //     if (heatingSchedule) {
//     //       // **if Deactivate for heating scheduler is TRUE, then the code below will be executed
//     //       useTGSSwitchStore().resetHeatingSchedule({ location, machine });
//     //     } else if (heatingScheduleState) {
//     //       // else if the heating scheduler is selected, the code below will be executed
//     //       useMCStore().setControllersStatus(3);
//     //       dispatch(
//     //         tgsHandleReadyHeatingSchedule({ location, machine, state: true })
//     //       );
//     //       dispatch(
//     //         tgsHandleAddHeatingSchedule({
//     //           location,
//     //           machine,
//     //           start: heatingScheduleStart,
//     //           end: heatingScheduleEnd,
//     //           inputTemp: heatingScheduleTemp,
//     //           isF: heatingScheduleIsF,
//     //           index: 0,
//     //         })
//     //       );
//     //     }
//     //     //  wind factor
//     //     if (windFactor) {
//     //       // **if Deactivate for wind factor is TRUE, then the code below will be executed
//     //       useTGSSwitchStore().resetWindFactor({ location, machine });
//     //     } else if (isWindFactorState) {
//     //       // else if the wind factor is selected, the code below will be executed
//     //       useMCStore().setControllersStatus(4);
//     //       setWindFactor({ location, machine });
//     //     }
//     //     // select ATS
//     //     if (swt) {
//     //       dispatch(
//     //         tgsHandleAtsSelection({
//     //           location,
//     //           machine,
//     //           selection: selections,
//     //         })
//     //       );
//     //       // Object.keys(flatTgsSwitch).forEach((location) =>
//     //       //   Object.keys(flatTgsSwitch[location]).forEach((machine) => {
//     //       //     if (flatTgsSwitch[location][machine].isSelected) {
//     //       //       dispatch(
//     //       //         tgsHandleAtsSelection({
//     //       //           location,
//     //       //           machine,
//     //       //           selection: selections,
//     //       //         })
//     //       //       );
//     //       //     }
//     //       //   })
//     //       // );
//     //     }
//     //   })
//     // );

//     // updateBlowersMasterControlService(deviceIds, 'TGS', newData).then(() => {
//     //   getAuditTrailService({
//     //     actionType: 'GLOBAL_MASTER_CONTROL',
//     //   }).then((res) => {
//     //     dispatch(
//     //       handleCommandInfo({
//     //         data: res,
//     //         user,
//     //         isF,
//     //         flatEssSwitch,
//     //         flatTgsSwitch,
//     //         flatTesSwitch,
//     //       })
//     //     );
//     //   });
//     // });
//   }
//   // tes switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = tesSwitchSlice (ex:instant heat program set to 150c and applied)
//   else if (tes) {
//     // dispatch(
//     //   handleSaveCommand({
//     //     user: userId,
//     //     commandData: {
//     //       [`${commandKey}`]: {
//     //         locations,
//     //         specificLocations,
//     //         machines,
//     //         system: 'tes-typhoon electric system',
//     //         switches: sumOfSwitches,
//     //         ats: selections[2]
//     //           ? { activateTgs: true, reactivate: false, block: false }
//     //           : selections[0]
//     //           ? { activateTgs: false, reactivate: true, block: false }
//     //           : selections[1]
//     //           ? { activateTgs: false, reactivate: false, block: true }
//     //           : { activateTgs: false, reactivate: false, block: false },
//     //         deactivate: {
//     //           heatingSchedule,
//     //           instantHeat,
//     //           optionalConstantTemp,
//     //           snowSensor,
//     //           windFactor,
//     //         },
//     //         isF,
//     //         parameters: {
//     //           instantHeat: instantHeatState.ready
//     //             ? instantHeatState.isF
//     //               ? `active ${instantHeatState.temp}°F`
//     //               : `active ${instantHeatState.temp}°C`
//     //             : null,
//     //           optionalConstantTemp: constantTempState.ready
//     //             ? constantTempState.isF
//     //               ? `ready ${constantTempState.temp}°F`
//     //               : `ready ${constantTempState.temp}°C`
//     //             : null,
//     //           snowSensor: ready ? 'ready' : null,
//     //           heatingSchedule: heatingScheduleState
//     //             ? heatingScheduleIsF
//     //               ? `ready ${heatingScheduleTemp}°F`
//     //               : `ready ${heatingScheduleTemp}°C`
//     //             : null,
//     //           windFactor: isWindFactorState ? 'ready' : null,
//     //         },
//     //       },
//     //     },
//     //   })
//     // );
//     const optionalConstantTemp = constantTempState.ready
//       ? constantTempState.isF
//         ? `ready ${constantTempState.temp}°F`
//         : `ready ${constantTempState.temp}°C`
//       : null;
//     const option = {
//       optionalConstantTemp,
//     };

//     const ats = selections[2]
//       ? { activateTgs: true, reactivate: false, block: false }
//       : selections[0]
//       ? { activateTgs: false, reactivate: true, block: false }
//       : selections[1]
//       ? { activateTgs: false, reactivate: false, block: true }
//       : { activateTgs: false, reactivate: false, block: false };

//     const option2 = {
//       ats,
//     };
//     saveCommandHandler(
//       userId,
//       commandKey,
//       locations,
//       specificLocations,
//       machines,
//       sumOfSwitches,
//       'tes-typhoon electric system',
//       option,
//       option2
//     );

//     loopAllMachinesToDispatchProgramsHandler(
//       flatTesSwitch,
//       'tes',
//       deviceIds,
//       newData
//     );

//     // Object.keys(flatTesSwitch).forEach((location) =>
//     //   Object.keys(flatTesSwitch[location]).forEach((el) => {
//     //     if (flatTesSwitch[location][el]?.machineType) {
//     //       if (flatTesSwitch[location][el]?.isSelected) {
//     //         heatingProgramHandler(
//     //           location,
//     //           el,
//     //           null,
//     //           'tes',
//     //           deviceIds,
//     //           newData
//     //         );
//     //       }
//     //     } else {
//     //       Object.keys(flatTesSwitch[location][el]).forEach((machine) => {
//     //         if (flatTesSwitch[location][el][machine]?.isSelected) {
//     //           heatingProgramHandler(
//     //             location,
//     //             machine,
//     //             el,
//     //             'tes',
//     //             deviceIds,
//     //             newData
//     //           );
//     //         }
//     //       });
//     //     }
//     //   })
//     // );

//     // Object.keys(flatTesSwitch).forEach((location) =>
//     //   Object.keys(flatTesSwitch[location]).forEach((machine) => {
//     //     if (flatTesSwitch[location][machine].isSelected) {
//     //       // instant heat
//     //       if (instantHeat) {
//     //         // **if Deactivate for instant heat is TRUE, then the code below will be executed
//     //         useTESSwitchStore().resetInstantHeat({ location, machine });
//     //       } else if (instantHeatState.ready) {
//     //         // else if the instant heat is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(0);
//     //         dispatch(
//     //           tesHandleInstantHeatIsReady({
//     //             location,
//     //             machine,
//     //             isF: instantHeatState.isF,
//     //             temp: instantHeatState.temp,
//     //           })
//     //         );
//     //       }
//     //       // snow sensor
//     //       if (snowSensor) {
//     //         // **if Deactivate for snow sensor is TRUE, then the code below will be executed
//     //         useTESSwitchStore().resetSnowSensor({ location, machine });
//     //       } else if (ready) {
//     //         // else if the snow sensor is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(1);
//     //         setSnowSensor({ location, machine });
//     //       }
//     //       // optional constant temperature
//     //       if (optionalConstantTemp) {
//     //         // **if Deactivate for optional constant temp is TRUE, then the code below will be executed
//     //         dispatch(
//     //           tesHandleOptionalConstantTempReset({ location, machine })
//     //         );
//     //       } else if (constantTempState.ready) {
//     //         // else if the optional constant temp is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(2);
//     //         dispatch(
//     //           tesHandleOptionalConstantTempIsReady({
//     //             location,
//     //             machine,
//     //             isF: constantTempState.isF,
//     //             temp: constantTempState.temp,
//     //           })
//     //         );
//     //       }
//     //       // heating scheduler
//     //       if (heatingSchedule) {
//     //         // **if Deactivate for heating scheduler is TRUE, then the code below will be executed
//     //         useTESSwitchStore().resetHeatingSchedule({ location, machine });
//     //       } else if (heatingScheduleState) {
//     //         // else if the heating scheduler is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(3);
//     //         dispatch(
//     //           tesHandleReadyHeatingSchedule({
//     //             location,
//     //             machine,
//     //             state: true,
//     //           })
//     //         );
//     //         dispatch(
//     //           tesHandleAddHeatingSchedule({
//     //             location,
//     //             machine,
//     //             start: heatingScheduleStart,
//     //             end: heatingScheduleEnd,
//     //             inputTemp: heatingScheduleTemp,
//     //             isF: heatingScheduleIsF,
//     //             index: 0,
//     //           })
//     //         );
//     //       }
//     //       // wind factor
//     //       if (windFactor) {
//     //         // **if Deactivate for wind factor is TRUE, then the code below will be executed
//     //         useTESSwitchStore().resetWindFactor({ location, machine });
//     //       } else if (isWindFactorState) {
//     //         // else if the wind factor is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(4);
//     //         setWindFactor({ location, machine });
//     //       }
//     //       // select ATS
//     //       if (swt) {
//     //         dispatch(
//     //           tesHandleAtsSelection({
//     //             location,
//     //             machine,
//     //             selection: selections,
//     //           })
//     //         );
//     //       }
//     //     }
//     //   })
//     // );

//     // updateBlowersMasterControlService(deviceIds, 'TES', newData).then(() => {
//     //   getAuditTrailService({
//     //     actionType: 'GLOBAL_MASTER_CONTROL',
//     //   }).then((res) => {
//     //     dispatch(
//     //       handleCommandInfo({
//     //         data: res,
//     //         user,
//     //         isF,
//     //         flatEssSwitch,
//     //         flatTgsSwitch,
//     //         flatTesSwitch,
//     //       })
//     //     );
//     //   });
//     // });
//   }
//   // ess switch system => check every selected location and selected machine and check what was set to ready at selectedMachinesSlice and send what was programmed to the backend = essSwitchSlice (ex:instant heat program set to 150c and applied)
//   else if (ess) {
//     // dispatch(
//     //   handleSaveCommand({
//     //     user: userId,
//     //     commandData: {
//     //       [`${commandKey}`]: {
//     //         locations,
//     //         specificLocations,
//     //         machines,
//     //         system: 'ess-typhoon electric system',
//     //         switches: sumOfSwitches,
//     //         ats: selections[0]
//     //           ? { reactivate: true, block: false }
//     //           : selections[1]
//     //           ? { reactivate: false, block: true }
//     //           : { reactivate: false, block: false },
//     //         deactivate: {
//     //           heatingSchedule,
//     //           instantHeat,
//     //           optionalConstantTemp,
//     //           snowSensor,
//     //           windFactor,
//     //         },
//     //         isF,
//     //         parameters: {
//     //           instantHeat: instantHeatState.ready
//     //             ? instantHeatState.isF
//     //               ? `active ${instantHeatState.temp}°F`
//     //               : `active ${instantHeatState.temp}°C`
//     //             : null,
//     //           optionalConstantTemp: constantTempState.ready
//     //             ? constantTempState.isF
//     //               ? `ready ${constantTempState.temp}°F`
//     //               : `ready ${constantTempState.temp}°C`
//     //             : null,
//     //           snowSensor: ready ? 'ready' : null,
//     //           heatingSchedule: heatingScheduleState
//     //             ? heatingScheduleIsF
//     //               ? `ready ${heatingScheduleTemp}°F`
//     //               : `ready ${heatingScheduleTemp}°C`
//     //             : null,
//     //           windFactor: isWindFactorState ? 'ready' : null,
//     //         },
//     //       },
//     //     },
//     //   })
//     // );
//     const optionalConstantTemp = constantTempState.ready
//       ? constantTempState.isF
//         ? `ready ${constantTempState.temp}°F`
//         : `ready ${constantTempState.temp}°C`
//       : null;
//     const option = {
//       optionalConstantTemp,
//     };

//     const ats = selections[0]
//       ? { reactivate: true, block: false }
//       : selections[1]
//       ? { reactivate: false, block: true }
//       : { reactivate: false, block: false };

//     const option2 = {
//       ats,
//     };
//     saveCommandHandler(
//       userId,
//       commandKey,
//       locations,
//       specificLocations,
//       machines,
//       sumOfSwitches,
//       'ess-typhoon electric system',
//       option,
//       option2
//     );

//     loopAllMachinesToDispatchProgramsHandler(
//       flatEssSwitch,
//       'ess',
//       deviceIds,
//       newData
//     );

//     //!! testEssLocationsAll
//     // loopAllMachinesToDispatchProgramsHandler(
//     //   testEssSwitch,
//     //   'ess',
//     //   deviceIds,
//     //   newData
//     // );
//     // !!
//     // Object.keys(testEssSwitch).forEach((location) =>
//     //   Object.keys(testEssSwitch[location]).forEach((el) => {
//     //     if (testEssSwitch[location][el]?.machineType) {
//     //       if (testEssSwitch[location][el]?.isSelected) {
//     //         heatingProgramHandler(
//     //           location,
//     //           el,
//     //           null,
//     //           'ess',
//     //           deviceIds,
//     //           newData
//     //         );
//     //       }
//     //     } else {
//     //       Object.keys(testEssSwitch[location][el]).forEach((machine) => {
//     //         if (testEssSwitch[location][el][machine]?.isSelected) {
//     //           heatingProgramHandler(
//     //             location,
//     //             machine,
//     //             el,
//     //             'ess',
//     //             deviceIds,
//     //             newData
//     //           );
//     //         }
//     //       });
//     //     }
//     //   })
//     // );

//     // ======================
//     // Object.keys(flatEssSwitch).forEach((location) =>
//     //   Object.keys(flatEssSwitch[location]).forEach((el) => {
//     //     if (flatEssSwitch[location][el]?.machineType) {
//     //       if (flatEssSwitch[location][el]?.isSelected) {
//     //         heatingProgramHandler(
//     //           location,
//     //           el,
//     //           null,
//     //           'ess',
//     //           deviceIds,
//     //           newData
//     //         );
//     //       }
//     //     } else {
//     //       Object.keys(flatEssSwitch[location][el]).forEach((machine) => {
//     //         if (flatEssSwitch[location][el][machine]?.isSelected) {
//     //           heatingProgramHandler(
//     //             location,
//     //             machine,
//     //             el,
//     //             'ess',
//     //             deviceIds,
//     //             newData
//     //           );
//     //         }
//     //       });
//     //     }
//     //   })
//     // );

//     // Object.keys(flatEssSwitch).forEach((location) =>
//     //   Object.keys(flatEssSwitch[location]).forEach((machine) => {
//     //     if (flatEssSwitch[location][machine].isSelected) {
//     //       // instant Heat
//     //       if (instantHeat) {
//     //         // **if Deactivate for instant heat is TRUE, then the code below will be executed
//     //         // useESSSwitchStore().setInstantHeatOff({ location, machine });
//     //         useESSSwitchStore().resetInstantHeat({ location, machine });
//     //       } else if (instantHeatState.ready) {
//     //         // else if the instant heat is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(0);
//     //         dispatch(
//     //           handleInstantHeatReady({
//     //             location,
//     //             machine,
//     //             isF: instantHeatState.isF,
//     //             temp: instantHeatState.temp,
//     //           })
//     //         );
//     //       }
//     //       // snow sensor
//     //       if (snowSensor) {
//     //         // **if Deactivate for snow sensor is TRUE, then the code below will be executed
//     //         // useESSSwitchStore().setSnowSensorOff({ location, machine });
//     //         // dispatch(
//     //         //   handleSnowSensorIsActivatedOff({
//     //         //     location,
//     //         //     machine,
//     //         //   })
//     //         // );
//     //         dispatch(
//     //           handleSnowSensorReset({
//     //             location,
//     //             machine,
//     //           })
//     //         );
//     //       } else if (ready) {
//     //         // else if the snow sensor is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(1);
//     //         useMCStore().setSnowSensor({ location, machine });
//     //       }
//     //       // optional constant temperature
//     //       if (optionalConstantTemp) {
//     //         // **if Deactivate for optional constant temperature is TRUE, then the code below will be executed
//     //         // useESSSwitchStore().setMachineOptionalConstantTempOff({ location, machine });
//     //         // dispatch(
//     //         //   handleOptionalConstantTempReadyOff({ location, machine })
//     //         // );
//     //         useESSSwitchStore().resetOptionalConstantTemp({ location, machine });
//     //       } else if (constantTempState.ready) {
//     //         // else if optional constant temperature is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(2);
//     //         dispatch(
//     //           handleOptionalConstantTempReady({
//     //             location,
//     //             machine,
//     //             isF: constantTempState.isF,
//     //             temp: constantTempState.temp,
//     //           })
//     //         );
//     //       }
//     //       // heating schedule
//     //       if (heatingSchedule) {
//     //         // **if Deactivate for heating schedule is TRUE, then the code below will be executed
//     //         // dispatch(
//     //         //   handleReadyHeatingSchedule({ location, machine, state: false })
//     //         // );
//     //         // dispatch(
//     //         //   handleActivateHeatingSchedule({
//     //         //     location,
//     //         //     machine,
//     //         //     state: false,
//     //         //   })
//     //         // );
//     //         // const data = [
//     //         //   {
//     //         //     start: { date: null, time: null },
//     //         //     end: { date: null, time: null },
//     //         //     inputTemp: null,
//     //         //     isF: null,
//     //         //   },
//     //         // ];
//     //         // useESSSwitchStore().clearHeatingSchedule({ location, machine, data });
//     //         useESSSwitchStore().resetHeatingSchedule({ location, machine });
//     //       } else if (heatingScheduleState) {
//     //         // else if heating schedule is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(3);
//     //         dispatch(
//     //           handleAddHeatingSchedule({
//     //             location,
//     //             machine,
//     //             start: heatingScheduleStart,
//     //             end: heatingScheduleEnd,
//     //             inputTemp: heatingScheduleTemp,
//     //             isF: heatingScheduleIsF,
//     //             index: 0,
//     //           })
//     //         );
//     //         dispatch(
//     //           handleReadyHeatingSchedule({ location, machine, state: true })
//     //         );
//     //       }
//     //       // wind factor
//     //       if (windFactor) {
//     //         // **if Deactivate for wind factor is TRUE, then the code below will be executed
//     //         // dispatch(
//     //         //   handleWindFactorIsActivatedOff({
//     //         //     location,
//     //         //     machine,
//     //         //   })
//     //         // );
//     //         // dispatch(
//     //         //   handleWindFactorOff({
//     //         //     location,
//     //         //     machine,
//     //         //   })
//     //         // );
//     //         useESSSwitchStore().resetWindFactor({ location, machine });
//     //       } else if (isWindFactorState) {
//     //         // else if wind factor is selected, the code below will be executed
//     //         useMCStore().setControllersStatus(4);
//     //         useMCStore().setWindFactor({ location, machine });
//     //       }
//     //       // select ATS
//     //       if (swt) {
//     //         dispatch(
//     //           handleAtsSelection({
//     //             location,
//     //             machine,
//     //             selection: selections,
//     //           })
//     //         );
//     //       }
//     //     } else if ('') {
//     //     }
//     //   })
//     // );
//     // updateSwitchesMasterControlService(deviceIds, 'ESS', newData).then(() => {
//     //   getAuditTrailService({
//     //     actionType: 'GLOBAL_MASTER_CONTROL',
//     //   }).then((res) => {
//     //     dispatch(
//     //       handleCommandInfo({
//     //         data: res,
//     //         user,
//     //         isF,
//     //         flatEssSwitch,
//     //         flatTgsSwitch,
//     //         flatTesSwitch,
//     //       })
//     //     );
//     //   });
//     // });

const Wrapper = styled.div`
  width: 983px;
  height: 613px;
  border-radius: 10px;

  ${layerA180Deg}
  ${flexDirectionColumn}  
  
  padding: 6.5rem 0;
`;
const TitleContainer = styled.div`
  width: 968px;
  height: 32px;
  border-radius: 16px;

  ${layerADark}

  ${flexBoxCenter}
  padding: 5rem 10rem;
`;
const TitleWrapper = styled.div`
  width: 100%;
  height: 90%;
  border-bottom: 2px solid #fff;
  display: flex;
  align-items: center;
`;
const Title = styled.span`
  font-size: 16px;
`;

const MainSection = styled.div`
  width: 100%;
  height: 100%;

  ${justifyContentSpaceBetween}
  padding: 8rem;
`;

const WrapperMessageBox = styled.div`
  position: absolute;

  top: 0%;
  right: 0%;
  z-index: 200;
`;
