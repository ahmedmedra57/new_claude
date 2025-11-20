import { useState } from 'react';
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../zustand-stores';
import { useMobileMasterControlStore } from '../zustand-stores';

import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
} from '../styles/commonStyles';

import ScheduleCalendar from './controls/heatingScheduler/ScheduleCalendar';
import Ats from '../masterControlSwitches/Ats';
import ShutOff from '../masterControlSwitches/ShutOff';
import { setInitialStateSelectBoxHandler } from '../../helpers/ess-tgs-tes-mc/setInitialStateSelectBoxHandler';

const ProgramsComponent = ({
  isApply,
  setIsApply,
  selectionDispatchHandler,
}) => {
  // !! TODO: implement specific location
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const unit = isF ? '°F' : '°C';

  const MCStatus = useMobileMasterControlStore();
  const { selectedSwt, isProgramSelected } = MCStatus;

  const { essSwitch } = useESSSwitchStore();
  const { tgsSwitch } = useTGSSwitchStore();
  const { tesSwitch } = useTESSwitchStore();

  const [instantHeatTemp, setInstantHeatTemp] = useState('');
  const [constantTemp, setConstantTemp] = useState('');
  const [schedulerTemp, setSchedulerTemp] = useState('');
  const [openScheduler, setOpenScheduler] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
    inputTemp: schedulerTemp,
    isF: null,
  });

  const { start, end } = scheduleData;

  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : ' -----------------';

  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : ' -----------------';

  
  const handleCleanUp = () => {
    dispatch(handleCleanUpSelectedOne();
    // unselect program
    // dispatch(handleUnselectProgram();
    // initialize select location
    if (selectedSwt === 'ess') {
      selectionDispatchHandler(selectedSwt, essSwitch);
    } else if (selectedSwt === 'tes') {
      selectionDispatchHandler(selectedSwt, tesSwitch);
    } else if (selectedSwt === 'tgs') {
      selectionDispatchHandler(selectedSwt, tgsSwitch);
    }
  };

  // const handleInitializeSelectLocation = () => {
  //   dispatch(handleCleanUpSelectedOne();

  //   if (selectedSwt === 'ess') {
  //     const essLocations = Object.keys(essSwitch);
  //     useMasterControlSelectStore().selectAll({ switch: 'ess', status: false });
  //     const locationArr = essLocations.map((location) => false);
  //     useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'ess' });

  //     const machineArr = Object.values(essSwitch).map((location) =>
  //       Object.keys(location).map((machine) => false)
  //     );
  //     dispatch(handleMachineSelect({ arr: machineArr, switch: 'ess' });

  //     // setAtsSrc('/images/select-ats-disabled.svg');
  //   } else if (selectedSwt === 'tes') {
  //     const tesLocations = Object.keys(tesSwitch);
  //     useMasterControlSelectStore().selectAll({ status: false, switch: 'tss' });
  //     const locationArr = tesLocations.map((location) => false);
  //     useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'tes' });

  //     const machineArr = Object.values(tesSwitch).map((location) =>
  //       Object.keys(location).map((machine) => false)
  //     );
  //     dispatch(handleMachineSelect({ arr: machineArr, switch: 'tes' });

  //     // setAtsSrc('/images/select-ats-disabled.svg');
  //   } else if (selectedSwt === 'tgs') {
  //     // setAtsSrc('/images/select-ats-active.svg');
  //     const tgsLocations = Object.keys(tgsSwitch);
  //     useMasterControlSelectStore().selectAll({ status: false, switch: 'ess' });
  //     const locationArr = tgsLocations.map((location) => false);
  //     useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'tgs' });

  //     const machineArr = Object.values(tgsSwitch).map((location) =>
  //       Object.keys(location).map((machine) => false)
  //     );
  //     dispatch(handleMachineSelect({ arr: machineArr, switch: 'tgs' });
  //   }
  // };

  // const handleCleanUp = () => {
  //   // unselect program
  //   // dispatch(handleUnselectProgram();
  //   // initialize select location
  //   handleInitializeSelectLocation();
  // };

  const dispatchUnselectMachinesHandler = (
    swt,
    location,
    specificLocation,
    machine
  ) => {
    const dispatchObj = {
      location,
      specificLocation,
      machine,
    };
    switch (swt) {
      case 'ess':
        dispatch(handleUnSelectIndividualMachine(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleUnSelectIndividualMachine(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleUnSelectIndividualMachine(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchInstantHeatHandler = (
    swt,
    location,
    specificLocation,
    machine,
    temp
  ) => {
    const dispatchObj = { location, specificLocation, machine, isF, temp };
    switch (swt) {
      case 'ess':
        dispatch(handleInstantHeatReady(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleInstantHeat(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleInstantHeat(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchSnowSensorHandler = (
    swt,
    location,
    specificLocation,
    machine
  ) => {
    const dispatchObj = { location, specificLocation, machine };
    switch (swt) {
      case 'ess':
        useMCStore().setSnowSensor(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleSnowSensor(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleSnowSensor(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchWindFactorHandler = (
    swt,
    location,
    specificLocation,
    machine
  ) => {
    const dispatchObj = { location, specificLocation, machine };
    switch (swt) {
      case 'ess':
        useMCStore().setWindFactor(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleWindFactor(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleWindFactor(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchOptionalConstantTempHandler = (
    swt,
    location,
    specificLocation,
    machine,
    temp
  ) => {
    const dispatchObj = { location, specificLocation, machine, isF, temp };
    switch (swt) {
      case 'ess':
        dispatch(handleOptionalConstantTempReady(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleOptionalConstantTemp(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchHeatingScheduleHandler = (
    swt,
    location,
    specificLocation,
    machine,
    data
  ) => {
    const dispatchObj = {
      location,
      specificLocation,
      machine,
      start: data.start,
      end: data.end,
      inputTemp: data.inputTemp,
      isF: data.isF,
      index: 0,
    };

    const dispatchObj2 = { location, specificLocation, machine, state: true };
    switch (swt) {
      case 'ess':
        dispatch(handleAddHeatingSchedule(dispatchObj);
        // ready
        dispatch(handleReadyHeatingSchedule(dispatchObj2);
        break;
      case 'tes':
        dispatch(tesHandleAddHeatingSchedule(dispatchObj);
        // ready
        dispatch(tesHandleReadyHeatingSchedule(dispatchObj2);
        break;
      case 'tgs':
        dispatch(tgsHandleAddHeatingSchedule(dispatchObj);
        // ready
        dispatch(tgsHandleReadyHeatingSchedule(dispatchObj2);
        break;
      default:
        break;
    }
  };

  const dispatchAtsHandler = (
    swt,
    location,
    specificLocation,
    machine,
    selection
  ) => {
    const dispatchObj = {
      location,
      specificLocation,
      machine,
      selection,
    };

    switch (swt) {
      case 'ess':
        dispatch(handleAtsSelection(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleAtsSelection(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleAtsSelection(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchShutOffHandler = (swt, location, specificLocation, machine) => {
    const dispatchObj = { location, specificLocation, machine };
    switch (swt) {
      case 'ess':
        dispatch(handleShutOff(dispatchObj);
        break;
      case 'tes':
        dispatch(tesHandleShutOff(dispatchObj);
        break;
      case 'tgs':
        dispatch(tgsHandleShutOff(dispatchObj);
        break;
      default:
        break;
    }
  };

  const dispatchSelectedHeatingSysHandler = (
    swt,
    heatingSys,
    location,
    specificLocation,
    machine,
    temp,
    data,
    selection
  ) => {
    switch (heatingSys) {
      case 'instantHeat':
        dispatchInstantHeatHandler(
          swt,
          location,
          specificLocation,
          machine,
          temp
        );
        break;
      case 'snowSensor':
        dispatchSnowSensorHandler(swt, location, specificLocation, machine);
        break;
      case 'windFactor':
        dispatchWindFactorHandler(swt, location, specificLocation, machine);

        break;
      case 'optionalConstantTemp':
        dispatchOptionalConstantTempHandler(
          swt,
          location,
          specificLocation,
          machine,
          temp
        );
        break;
      case 'heatingSchedule':
        dispatchHeatingScheduleHandler(
          swt,
          location,
          specificLocation,
          machine,
          data
        );
        break;
      case 'fanOnly':
        setFanOnly({ location, specificLocation, machine, state: true });
        break;
      case 'ats':
        dispatchAtsHandler(swt, location, specificLocation, machine, selection);
        break;
      case 'shutOff':
        dispatchShutOffHandler(swt, location, specificLocation, machine);
        break;
      default:
        break;
    }
  };

  const loopMachinesHandler = (
    swt,
    swtData,
    heatingSys,
    temp,
    data,
    selection
  ) => {
    Object.keys(swtData).forEach((location) =>
      Object.keys(swtData[location]).forEach((el) => {
        // no specific location
        if (swtData[location][el]?.deviceMac) {
          if (swtData[location][el].isSelected) {
            // unSelect individual machine as false
            dispatchUnselectMachinesHandler(swt, location, null, el);
            // set heating status
            dispatchSelectedHeatingSysHandler(
              swt,
              heatingSys,
              location,
              null,
              el,
              temp,
              data,
              selection
            );
          }
        } else {
          // has specific location
          Object.keys(swtData[location][el]).forEach((machine) => {
            if (swtData[location][el][machine].isSelected) {
              // unSelect individual machine as false
              dispatchUnselectMachinesHandler(swt, location, el, machine);
              // set heating status
              dispatchSelectedHeatingSysHandler(
                swt,
                heatingSys,
                location,
                el,
                machine,
                temp,
                data,
                selection
              );
            }
          });
        }
      });
  };

  // instant Heat handler
  const handleDispatchInstantHeat = () => {
    const temp = Number(instantHeatTemp);
    if (isF) {
      if (temp > 78 && temp < 1831) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(selectedSwt, essSwitch, 'instantHeat', temp);
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(selectedSwt, tesSwitch, 'instantHeat', temp);
        } else if (selectedSwt === 'tgs') {
          loopMachinesHandler(selectedSwt, tgsSwitch, 'instantHeat', temp);
        }
        // set state
        setInstantHeatTemp(`${temp} ${unit}`);
      } else {
        // message box
      }
    } else {
      if (temp > 26 && temp < 1000) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(selectedSwt, essSwitch, 'instantHeat', temp);
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(selectedSwt, tesSwitch, 'instantHeat', temp);
        } else if (selectedSwt === 'tgs') {
          loopMachinesHandler(selectedSwt, tgsSwitch, 'instantHeat', temp);
        }
        // set state
        setInstantHeatTemp(`${temp} ${unit}`);
      } else {
        // message box
      }
    }

    // Clean up
    // 1. display temperature
    setInstantHeatTemp('');
    // 2. global
    handleCleanUp();
    // 3.green contour around apply button
    setIsApply(true);
  };

  // snow sensor handler
  const handleDispatchSnowSensor = () => {
    if (selectedSwt === 'ess') {
      loopMachinesHandler(selectedSwt, essSwitch, 'snowSensor');
    } else if (selectedSwt === 'tes') {
      loopMachinesHandler(selectedSwt, tesSwitch, 'snowSensor');
    } else if (selectedSwt === 'tgs') {
      loopMachinesHandler(selectedSwt, tgsSwitch, 'snowSensor');
    }

    // 1.Clean up
    handleCleanUp();
    // 2.green contour around apply button
    setIsApply(true);
  };

  // wind factor handler
  const handleDispatchWindFactor = () => {
    if (selectedSwt === 'ess') {
      loopMachinesHandler(selectedSwt, essSwitch, 'windFactor');
    } else if (selectedSwt === 'tes') {
      loopMachinesHandler(selectedSwt, tesSwitch, 'windFactor');
    } else if (selectedSwt === 'tgs') {
      loopMachinesHandler(selectedSwt, tgsSwitch, 'windFactor');
    }
    // Clean up
    handleCleanUp();
    // 2.green contour around apply button
    setIsApply(true);
  };

  // optional constant temp handler
  const handleDispatchOptionalConstantTemp = () => {
    const temp = Number(constantTemp);
    if (isF) {
      if (temp > 78 && temp < 249) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(
            selectedSwt,
            essSwitch,
            'optionalConstantTemp',
            temp
          );
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(
            selectedSwt,
            tesSwitch,
            'optionalConstantTemp',
            temp
          );
        }
      } else {
        // message box
      }
    } else {
      if (temp > 26 && temp < 121) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(
            selectedSwt,
            essSwitch,
            'optionalConstantTemp',
            temp
          );
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(
            selectedSwt,
            tesSwitch,
            'optionalConstantTemp',
            temp
          );
        }
      } else {
        // message box
      }
    }
    setConstantTemp('');
    // Clean up
    handleCleanUp();
    // 2.green contour around apply button
    setIsApply(true);
  };

  // Heating schedule handler
  const handleClear = () => {};

  const handleClose = () => {
    // dispatch(handleCloseCalendar();
    setOpenScheduler(false);
  };

  const handleSetNewSchedule = (data) => {
    // data :object / index === schedule list's index
    setScheduleData(data);
    setOpenScheduler(false);
  };

  const handleDispatchHeatingSchedule = () => {
    const temp = Number(schedulerTemp);
    const data = {
      start: scheduleData.start,
      end: scheduleData.end,
      inputTemp: temp,
      isF: isF,
    };

    if (isF) {
      // fahrenheit(77°F/1830.200°F )
      if (temp > 76 && temp < 1831) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(
            selectedSwt,
            essSwitch,
            'heatingSchedule',
            null,
            data
          );
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(
            selectedSwt,
            tesSwitch,
            'heatingSchedule',
            null,
            data
          );
        } else if (selectedSwt === 'tgs') {
          loopMachinesHandler(
            selectedSwt,
            tgsSwitch,
            'heatingSchedule',
            null,
            data
          );
        }

        setSchedulerTemp(`${temp} °F`);
      } else {
        // message - minimum and maximum temperature!!!
        setSchedulerTemp('');
      }
    } else {
      // check celsius(25°C/999°C)
      if (temp > 24 && temp < 1000) {
        if (selectedSwt === 'ess') {
          loopMachinesHandler(
            selectedSwt,
            essSwitch,
            'heatingSchedule',
            null,
            data
          );
        } else if (selectedSwt === 'tes') {
          loopMachinesHandler(
            selectedSwt,
            tesSwitch,
            'heatingSchedule',
            null,
            data
          );
        } else if (selectedSwt === 'tgs') {
          loopMachinesHandler(
            selectedSwt,
            tgsSwitch,
            'heatingSchedule',
            null,
            data
          );
        }
        setSchedulerTemp(`${temp} °C`);
      } else {
        // message - minimum and maximum temperature!!!
      }
    }

    // ---
    setSchedulerTemp('');

    // Clean up
    handleCleanUp();
    // 2.green contour around apply button
    setIsApply(true);
  };

  // fan only handler
  const handleDispatchFanOnly = () => {
    loopMachinesHandler('tgs', tgsSwitch, 'fanOnly');
    // Clean up
    handleCleanUp();
    // 2.green contour around apply button
    setIsApply(true);
  };

  // ATS
  const handleDispatchAts = (selection) => {
    if (selectedSwt === 'ess') {
      loopMachinesHandler(selectedSwt, essSwitch, 'ats', null, null, selection);
    } else if (selectedSwt === 'tes') {
      loopMachinesHandler(selectedSwt, tesSwitch, 'ats', null, null, selection);
    } else if (selectedSwt === 'tgs') {
      loopMachinesHandler(selectedSwt, tgsSwitch, 'ats', null, null, selection);
    }

    // Clean up
    handleCleanUp();
  };

  // Shut off
  const handleDispatchShutOff = () => {
    if (selectedSwt === 'ess') {
      loopMachinesHandler(selectedSwt, essSwitch, 'shutOff');
    } else if (selectedSwt === 'tes') {
      loopMachinesHandler(selectedSwt, tesSwitch, 'shutOff');
    } else if (selectedSwt === 'tgs') {
      loopMachinesHandler(selectedSwt, tgsSwitch, 'shutOff');
    }
    // Clean up
    handleCleanUp();
  };

  return (
    <Wrapper>
      {/* instant Heat */}
      {isProgramSelected[0] && (
        <ContainerTypeA>
          <TitleWrapper>
            <Title>instant heat program</Title>
            <Icon src='/images/logo-instantHeat.svg' />
          </TitleWrapper>
          <SectionControllerTypeA>
            <InputWrapper>
              <Input
                value={instantHeatTemp}
                type='text'
                onChange={(e) => setInstantHeatTemp(e.target.value)}
                placeholder={isF ? '0 °F' : '0 °C'}
              />
            </InputWrapper>

            <InputWrapper isApply={isApply}>
              <ButtonTypeA onClick={handleDispatchInstantHeat}>
                <ButtonTypeATop>apply</ButtonTypeATop>
              </ButtonTypeA>
            </InputWrapper>
          </SectionControllerTypeA>
        </ContainerTypeA>
      )}
      {/* Fan Only */}
      {isProgramSelected[1] && selectedSwt === 'tgs' && (
        <ContainerTypeA>
          <TitleWrapper>
            <Title>fan only program</Title>
            <Icon src='/images/tgs-fanOnly.svg' />
          </TitleWrapper>
          <ButtonTypeB onClick={handleDispatchFanOnly}>
            <ButtonLayerA>
              <ButtonLayerB isApply={isApply}>
                <ButtonLayerC>
                  <ButtonTop>apply</ButtonTop>
                </ButtonLayerC>
              </ButtonLayerB>
            </ButtonLayerA>
          </ButtonTypeB>
        </ContainerTypeA>
      )}

      {/* snow Sensor that is tgs */}
      {isProgramSelected[2] && selectedSwt === 'tgs' && (
        <ContainerTypeC>
          <TitleWrapper>
            <Title>snow sensor program</Title>
            <Icon src='/images/logo-snowSensor.svg' />
          </TitleWrapper>
          <SectionControllerTypeC>
            <ConstantTempWrapper>
              <DisplayWrapper>
                <DisplayTitle>
                  default trigger <br></br>temperature
                </DisplayTitle>
                <Divider />
                <DisplayTemp>350 {isF ? '°F' : '°C'}</DisplayTemp>
              </DisplayWrapper>
              <BottomWrapper>
                <DisplaySpan isBig={true}>* </DisplaySpan>
                <DisplaySpan>change temperature in settings</DisplaySpan>
              </BottomWrapper>
            </ConstantTempWrapper>
          </SectionControllerTypeC>

          <ButtonTypeB onClick={handleDispatchSnowSensor}>
            <ButtonLayerA>
              <ButtonLayerB isApply={isApply}>
                <ButtonLayerC>
                  <ButtonTop>apply</ButtonTop>
                </ButtonLayerC>
              </ButtonLayerB>
            </ButtonLayerA>
          </ButtonTypeB>
        </ContainerTypeC>
      )}

      {/* snow sensor  that is not tgs*/}
      {isProgramSelected[1] && selectedSwt !== 'tgs' && (
        <ContainerTypeC>
          <TitleWrapper>
            <Title>snow sensor program</Title>
            <Icon src='/images/logo-snowSensor.svg' />
          </TitleWrapper>
          <SectionControllerTypeC>
            <ConstantTempWrapper>
              <DisplayWrapper>
                <DisplayTitle>
                  default trigger <br></br>temperature
                </DisplayTitle>
                <Divider />
                <DisplayTemp>350 {isF ? '°F' : '°C'}</DisplayTemp>
              </DisplayWrapper>
              <BottomWrapper>
                <DisplaySpan isBig={true}>* </DisplaySpan>
                <DisplaySpan>change temperature in settings</DisplaySpan>
              </BottomWrapper>
            </ConstantTempWrapper>
          </SectionControllerTypeC>

          <ButtonTypeB onClick={handleDispatchSnowSensor}>
            <ButtonLayerA>
              <ButtonLayerB isApply={isApply}>
                <ButtonLayerC>
                  <ButtonTop>apply</ButtonTop>
                </ButtonLayerC>
              </ButtonLayerB>
            </ButtonLayerA>
          </ButtonTypeB>
        </ContainerTypeC>
      )}

      {/* optional constant temp */}
      {isProgramSelected[2] && selectedSwt !== 'tgs' && (
        <ContainerTypeA>
          <TitleWrapper>
            <Title>optional constant temp program</Title>
            <Icon src='/images/logo-constantTemp.svg' />
          </TitleWrapper>
          <SectionControllerTypeA>
            <InputWrapper>
              <Input
                value={constantTemp}
                type='text'
                onChange={(e) => setConstantTemp(e.target.value)}
                placeholder={isF ? '0 °F' : '0 °C'}
              />
            </InputWrapper>

            <InputWrapper isApply={isApply}>
              <ButtonTypeA onClick={handleDispatchOptionalConstantTemp}>
                <ButtonTypeATop>apply</ButtonTypeATop>
              </ButtonTypeA>
            </InputWrapper>
          </SectionControllerTypeA>
        </ContainerTypeA>
      )}

      {/* heating schedule  */}
      {isProgramSelected[3] && (
        <ContainerTypeB>
          <TitleWrapper>
            <Title>heating schedule program</Title>
            <Icon src='/images/logo-schedule.svg' />
          </TitleWrapper>
          <SectionControllerTypeB>
            <ScheduleWrapper>
              <SectionSchedule>
                <SectionDisplay>
                  <ScheduleSpan>start date :</ScheduleSpan>
                  <DisplayDate>
                    <Date>{displayStart}</Date>
                  </DisplayDate>
                </SectionDisplay>
                <SectionDisplay>
                  <ScheduleSpan>end date :</ScheduleSpan>
                  <DisplayDate>
                    <Date>{displayEnd}</Date>
                  </DisplayDate>
                </SectionDisplay>
              </SectionSchedule>

              <SectionScheduleButton onClick={() => setOpenScheduler(true)}>
                <Icon src='/images/masterCtr-select-btn.svg' />
              </SectionScheduleButton>
            </ScheduleWrapper>
          </SectionControllerTypeB>

          <SectionControllerTypeA>
            <InputWrapper>
              <Input
                value={schedulerTemp}
                type='text'
                onChange={(e) => setSchedulerTemp(e.target.value)}
                placeholder={isF ? '0 °F' : '0 °C'}
              />
            </InputWrapper>

            <InputWrapper isApply={isApply}>
              <ButtonTypeA
                onClick={() => schedulerTemp && handleDispatchHeatingSchedule()}
              >
                <ButtonTypeATop>apply</ButtonTypeATop>
              </ButtonTypeA>
            </InputWrapper>
          </SectionControllerTypeA>
          {openScheduler && (
            <ScheduleCalendarWrapper isMobile={true}>
              <ScheduleCalendar
                handleScheduler={handleSetNewSchedule}
                handleClose={handleClose}
                handleClear={handleClear}
                scheduleList={scheduleData}
                unit={isF}
              />
            </ScheduleCalendarWrapper>
          )}
        </ContainerTypeB>
      )}

      {/* wind factor */}
      {isProgramSelected[4] && (
        <ContainerTypeA>
          <TitleWrapper>
            <Title>wind factor program</Title>
            <Icon src='/images/logo-windFactor.svg' />
          </TitleWrapper>
          <ButtonTypeB onClick={handleDispatchWindFactor}>
            <ButtonLayerA>
              <ButtonLayerB isApply={isApply}>
                <ButtonLayerC>
                  <ButtonTop>apply</ButtonTop>
                </ButtonLayerC>
              </ButtonLayerB>
            </ButtonLayerA>
          </ButtonTypeB>
        </ContainerTypeA>
      )}

      {/*ats select  */}
      {isProgramSelected[5] && (
        <Ats
          swtName={selectedSwt}
          disabled={selectedSwt !== 'tgs'}
          scope='switch'
          handleOnClick={handleDispatchAts}
          isMasterControl={true}
        />
      )}
      {/* deactivate */}
      {isProgramSelected[6] && (
        <ContainerTypeA>
          <TitleWrapper isCenter={true}>
            <Title isCenter={true}>mc. off</Title>
          </TitleWrapper>
          <ButtonTypeB onClick={handleDispatchShutOff}>
            <ButtonLayerA>
              <ButtonLayerB isApply={isApply}>
                <ButtonLayerC>
                  <ButtonTop>shut Off</ButtonTop>
                </ButtonLayerC>
              </ButtonLayerB>
            </ButtonLayerA>
          </ButtonTypeB>
        </ContainerTypeA>
      )}
    </Wrapper>
  );
};

export default ProgramsComponent;

const Wrapper = styled.div`
  margin: 4px 0 2px 0;
`;

const ContainerTypeA = styled.section`
  width: 312px;
  height: 93px;
  border-radius: 2px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px 0;
`;
const ContainerTypeB = styled.section`
  width: 312px;
  height: 180px;
  border-radius: 2px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px 0;

  position: relative;
`;
const ContainerTypeC = styled.section`
  width: 312px;
  height: 176px;
  border-radius: 2px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px 0;
`;
const TitleWrapper = styled.div`
  width: 303px;
  height: 32px;
  border-radius: 16px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 2px 0 14px;

  ${(p) =>
    p.isCenter &&
    css`
      ${flexBoxCenter};
    `};
`;

const Title = styled.span`
  text-align: left;
  font-size: 10px;

  ${(p) =>
    p.isCenter &&
    css`
      text-align: center;
    `};
`;

const Icon = styled.img`
  height: 100%;
`;

const SectionControllerTypeA = styled.section`
  width: 303px;
  height: 41px;
  border-radius: 24px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 4px;
`;

const SectionControllerTypeB = styled.section`
  width: 303px;
  height: 78px;
  border-radius: 39px;

  ${layerADark};
  ${flexBoxCenter};
`;

const ScheduleWrapper = styled.div`
  width: 299px;
  height: 74px;
  border-radius: 37px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 12px 0 10px;
`;

const SectionSchedule = styled.section`
  width: 236px;
  height: 100%;
  ${flexDirectionColumn};
  padding: 8px 0;
`;

const SectionDisplay = styled.section`
  width: 100%;
  ${justifyContentSpaceBetween}
`;
const ScheduleSpan = styled.span`
  width: 32%;
  font-size: 9px;
  text-align: right;
`;
const DisplayDate = styled.div`
  width: 158px;
  height: 28px;
  border-radius: 14px;
  ${layerA}
  ${flexBoxCenter};
`;

const Date = styled.span`
  text-align: center;
  font-size: 10px;
`;
const SectionScheduleButton = styled.button`
  width: 32px;
  height: 29px;
  ${flexBoxCenter};
`;

const SectionControllerTypeC = styled.section`
  width: 303px;
  height: 71px;
  border-radius: 23px;
  ${layerADark};

  ${flexBoxCenter};
`;

const ConstantTempWrapper = styled.div`
  width: 299px;
  height: 67px;
  border-radius: 21px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 5px 0;
`;

const DisplayWrapper = styled.div`
  width: 286px;
  height: 29px;
  border-radius: 22px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 23px 0 20px;
`;
const DisplayTitle = styled.span`
  width: 123px;
  font-size: 10px;
  line-height: 10px;
`;

const DisplayTemp = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
`;
const Divider = styled.div`
  height: 20px;
  width: 0;
  border: 1px solid #fff;
`;
const DisplaySpan = styled.span`
  font-size: 9px;
  ${(p) =>
    p.isBig &&
    css`
      font-size: 20px;
      margin-top: 4px;
    `}
`;
const BottomWrapper = styled.div`
  ${justifyContentSpaceBetween};
  width: 70%;
`;

const InputWrapper = styled.div`
  width: 142px;
  height: 34px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${({ isApply }) =>
    isApply &&
    css`
      border-color: #95ff45;
    `}
`;
const Input = styled.input`
  width: 134px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
  font-size: 12px;
  ::placeholder {
    color: #fff;
  }
`;

const ButtonTypeA = styled.button`
  width: 134px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
`;
const ButtonTypeATop = styled.div`
  width: 132px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 12px;
`;

const ButtonTypeB = styled.button`
  width: 303px;
  height: 42px;
  border-radius: 24px;
  ${layerA};
  ${flexBoxCenter};
`;
const ButtonLayerA = styled.div`
  width: 297px;
  height: 37px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
`;
const ButtonLayerB = styled.div`
  width: 295px;
  height: 35px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
  ${({ isApply }) =>
    isApply &&
    css`
      border-color: #95ff45;
    `}
`;
const ButtonLayerC = styled.div`
  width: 287px;
  height: 27px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 285px;
  height: 25px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
  font-size: 12px;
  text-align: center;
`;

const ScheduleCalendarWrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  position: absolute;
  top: -150px;
  left: 0;
  z-index: 105;
`;

//  // !! TODO: implement specific location
//   // instant Heat handler
//   const handleDispatchInstantHeat = () => {
//     const temp = Number(instantHeatTemp);
//     if (isF) {
//       if (temp > 78 && temp < 1831) {
//         // Dispatch
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(selectedSwt, essSwitch, 'instantHeat', temp);
//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((el) => {
//           //     // no specific location
//           //     if (essSwitch[location][el]?.deviceMac) {
//           //       if (essSwitch[location][el].isSelected) {
//           //         // unSelect individual machine as false
//           //         dispatch(
//           //           handleUnSelectIndividualMachine({ location, machine: el })
//           //         );
//           //         dispatch(
//           //           handleInstantHeatReady({ location, machine: el, isF, temp })
//           //         );
//           //         //   useMCStore().setInstantHeat({ location, machine, isF, temp });
//           //         // }
//           //       }
//           //     } else {
//           //       // with specific location
//           //       Object.keys(essSwitch[location][el]).forEach((machine) => {
//           //         if (essSwitch[location][el][machine].isSelected) {
//           //           // unSelect individual machine as false
//           //           dispatch(
//           //             handleUnSelectIndividualMachine({
//           //               location,
//           //               specificLocation: el,
//           //               machine,
//           //             })
//           //           );
//           //           dispatch(
//           //             handleInstantHeatReady({
//           //               location,
//           //               specificLocation: el,
//           //               machine,
//           //               isF,
//           //               temp,
//           //             })
//           //           );
//           //         }
//           //       });
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(selectedSwt, tesSwitch, 'instantHeat', temp);

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     if (tesSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tesHandleUnSelectIndividualMachine({ location, machine })
//           //       );
//           //       dispatch(
//           //         tesHandleInstantHeat({ location, machine, isF, temp })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tgs') {
//           loopMachinesHandler(selectedSwt, tgsSwitch, 'instantHeat', temp);

//           // Object.keys(tgsSwitch).forEach((location) =>
//           //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//           //     if (tgsSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tgsHandleUnSelectIndividualMachine({ location, machine })
//           //       );
//           //       // dispatch(
//           //       //   tgsHandleInstantHeatIsReady({
//           //       //     location,
//           //       //     specificLocation,
//           //       //     machine,
//           //       //     isF,
//           //       //     temp,
//           //       //   })
//           //       // );
//           //       dispatch(
//           //         tgsHandleInstantHeat({ location, machine, isF, temp })
//           //       );
//           //     }
//           //   })
//           // );
//         }
//         // set state
//         setInstantHeatTemp(`${temp} ${unit}`);
//       } else {
//         // message box
//       }
//     } else {
//       if (temp > 26 && temp < 1000) {
//         // Dispatch
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(selectedSwt, essSwitch, 'instantHeat', temp);

//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((machine) => {
//           //     if (essSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         handleUnSelectIndividualMachine({ location, machine })
//           //       );
//           //       // useMCStore().setInstantHeat({ location, machine, isF, temp });
//           //       dispatch(
//           //         handleInstantHeatReady({ location, machine, isF, temp })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(selectedSwt, tesSwitch, 'instantHeat', temp);

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     if (tesSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tesHandleUnSelectIndividualMachine({ location, machine })
//           //       );
//           //       dispatch(
//           //         tesHandleInstantHeat({ location, machine, isF, temp })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tgs') {
//           loopMachinesHandler(selectedSwt, tgsSwitch, 'instantHeat', temp);

//           // Object.keys(tgsSwitch).forEach((location) =>
//           //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//           //     if (tgsSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tgsHandleUnSelectIndividualMachine({ location, machine })
//           //       );
//           //       // dispatch(
//           //       //   tgsHandleInstantHeatIsReady({
//           //       //     location,
//           //       //     specificLocation,
//           //       //     machine,
//           //       //     isF,
//           //       //     temp,
//           //       //   })
//           //       // );
//           //       dispatch(
//           //         tgsHandleInstantHeat({ location, machine, isF, temp })
//           //       );
//           //     }
//           //   })
//           // );
//         }
//         // set state
//         setInstantHeatTemp(`${temp} ${unit}`);
//       } else {
//         // message box
//       }
//     }

//     // Clean up
//     // 1. display temperature
//     setInstantHeatTemp('');
//     // 2. global
//     handleCleanUp();
//     // 3.green contour around apply button
//     setIsApply(true);
//   };

//   // snow sensor handler
//   const handleDispatchSnowSensor = () => {
//     if (selectedSwt === 'ess') {
//       loopMachinesHandler(selectedSwt, essSwitch, 'snowSensor');

//       // Object.keys(essSwitch).forEach((location) =>
//       //   Object.keys(essSwitch[location]).forEach((machine) => {
//       //     if (essSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       dispatch(handleUnSelectIndividualMachine({ location, machine });
//       //       useMCStore().setSnowSensor({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tes') {
//       loopMachinesHandler(selectedSwt, tesSwitch, 'snowSensor');

//       // Object.keys(tesSwitch).forEach((location) =>
//       //   Object.keys(tesSwitch[location]).forEach((machine) => {
//       //     if (tesSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       setSnowSensor({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tgs') {
//       loopMachinesHandler(selectedSwt, tgsSwitch, 'snowSensor');

//       // Object.keys(tgsSwitch).forEach((location) =>
//       //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//       //     if (tgsSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       setSnowSensor({ location, machine });
//       //     }
//       //   })
//       // );
//     }

//     // 1.Clean up
//     handleCleanUp();
//     // 2.green contour around apply button
//     setIsApply(true);
//   };

//   // wind factor handler
//   const handleDispatchWindFactor = () => {
//     if (selectedSwt === 'ess') {
//       loopMachinesHandler(selectedSwt, essSwitch, 'windFactor');

//       // Object.keys(essSwitch).forEach((location) =>
//       //   Object.keys(essSwitch[location]).forEach((machine) => {
//       //     if (essSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       dispatch(handleUnSelectIndividualMachine({ location, machine });
//       //       useMCStore().setWindFactor({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tes') {
//       loopMachinesHandler(selectedSwt, tesSwitch, 'windFactor');

//       // Object.keys(tesSwitch).forEach((location) =>
//       //   Object.keys(tesSwitch[location]).forEach((machine) => {
//       //     if (tesSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       setWindFactor({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tgs') {
//       loopMachinesHandler(selectedSwt, tgsSwitch, 'windFactor');

//       // Object.keys(tgsSwitch).forEach((location) =>
//       //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//       //     if (tgsSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       setWindFactor({ location, machine });
//       //     }
//       //   })
//       // );
//     }

//     // Clean up
//     handleCleanUp();
//     // 2.green contour around apply button
//     setIsApply(true);
//   };

//   // optional constant temp handler
//   const handleDispatchOptionalConstantTemp = () => {
//     const temp = Number(constantTemp);
//     if (isF) {
//       if (temp > 78 && temp < 249) {
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(
//             selectedSwt,
//             essSwitch,
//             'optionalConstantTemp',
//             temp
//           );

//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((machine) => {
//           //     dispatch(handleUnSelectIndividualMachine({ location, machine });

//           //     if (essSwitch[location][machine].isSelected) {
//           //       // dispatch(
//           //       //   handleOptionalConstantTemp({ location, machine, isF, temp })
//           //       // );
//           //       dispatch(
//           //         handleOptionalConstantTempReady({
//           //           location,
//           //           machine,
//           //           isF,
//           //           temp,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(
//             selectedSwt,
//             tesSwitch,
//             'optionalConstantTemp',
//             temp
//           );

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     dispatch(
//           //       tesHandleUnSelectIndividualMachine({ location, machine })
//           //     );

//           //     if (tesSwitch[location][machine].isSelected) {
//           //       dispatch(
//           //         tesHandleOptionalConstantTemp({
//           //           location,
//           //           machine,
//           //           isF,
//           //           temp,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         }
//       } else {
//         // message box
//       }
//     } else {
//       if (temp > 26 && temp < 121) {
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(
//             selectedSwt,
//             essSwitch,
//             'optionalConstantTemp',
//             temp
//           );

//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((machine) => {
//           //     dispatch(handleUnSelectIndividualMachine({ location, machine });

//           //     if (essSwitch[location][machine].isSelected) {
//           //       // dispatch(
//           //       //   handleOptionalConstantTemp({ location, machine, isF, temp })
//           //       // );
//           //       dispatch(
//           //         handleOptionalConstantTempReady({
//           //           location,
//           //           machine,
//           //           isF,
//           //           temp,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(
//             selectedSwt,
//             tesSwitch,
//             'optionalConstantTemp',
//             temp
//           );

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     dispatch(
//           //       tesHandleUnSelectIndividualMachine({ location, machine })
//           //     );

//           //     if (tesSwitch[location][machine].isSelected) {
//           //       dispatch(
//           //         tesHandleOptionalConstantTemp({
//           //           location,
//           //           machine,
//           //           isF,
//           //           temp,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         }
//       } else {
//         // message box
//       }
//     }

//     setConstantTemp('');
//     // Clean up
//     handleCleanUp();
//     // 2.green contour around apply button
//     setIsApply(true);
//   };

//   // Heating schedule handler
//   const handleClear = () => {};

//   const handleClose = () => {
//     // dispatch(handleCloseCalendar();
//     setOpenScheduler(false);
//   };

//   const handleSetNewSchedule = (data) => {
//     // data :object / index === schedule list's index
//     setScheduleData(data);
//     setOpenScheduler(false);
//   };

//   const handleDispatchHeatingSchedule = () => {
//     const temp = Number(schedulerTemp);
//     const data = {
//       start: scheduleData.start,
//       end: scheduleData.end,
//       inputTemp: temp,
//       isF: isF,
//     };

//     if (isF) {
//       // fahrenheit(77°F/1830.200°F )
//       if (temp > 76 && temp < 1831) {
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(
//             selectedSwt,
//             essSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((machine) => {
//           //     if (essSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         handleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         handleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       // ready
//           //       dispatch(
//           //         handleReadyHeatingSchedule({ location, machine, state: true })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(
//             selectedSwt,
//             tesSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     if (tesSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tesHandleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         tesHandleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       dispatch(
//           //         tesHandleReadyHeatingSchedule({
//           //           location,
//           //           machine,
//           //           state: true,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tgs') {
//           loopMachinesHandler(
//             selectedSwt,
//             tgsSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(tgsSwitch).forEach((location) =>
//           //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//           //     if (tgsSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tgsHandleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         tgsHandleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       dispatch(
//           //         tgsHandleReadyHeatingSchedule({
//           //           location,
//           //           machine,
//           //           state: true,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         }

//         setSchedulerTemp(`${temp} °F`);
//       } else {
//         // message - minimum and maximum temperature!!!
//         setSchedulerTemp('');
//       }
//     } else {
//       // check celsius(25°C/999°C)
//       if (temp > 24 && temp < 1000) {
//         if (selectedSwt === 'ess') {
//           loopMachinesHandler(
//             selectedSwt,
//             essSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(essSwitch).forEach((location) =>
//           //   Object.keys(essSwitch[location]).forEach((machine) => {
//           //     if (essSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         handleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         handleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       dispatch(
//           //         handleReadyHeatingSchedule({ location, machine, state: true })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tes') {
//           loopMachinesHandler(
//             selectedSwt,
//             tesSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(tesSwitch).forEach((location) =>
//           //   Object.keys(tesSwitch[location]).forEach((machine) => {
//           //     if (tesSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tesHandleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         tesHandleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       dispatch(
//           //         tesHandleReadyHeatingSchedule({
//           //           location,
//           //           machine,
//           //           state: true,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         } else if (selectedSwt === 'tgs') {
//           loopMachinesHandler(
//             selectedSwt,
//             tgsSwitch,
//             'heatingSchedule',
//             null,
//             data
//           );

//           // Object.keys(tgsSwitch).forEach((location) =>
//           //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//           //     if (tgsSwitch[location][machine].isSelected) {
//           //       // unSelect individual machine as false
//           //       dispatch(
//           //         tgsHandleUnSelectIndividualMachine({ location, machine })
//           //       );

//           //       dispatch(
//           //         tgsHandleAddHeatingSchedule({
//           //           location,
//           //           machine,
//           //           start: data.start,
//           //           end: data.end,
//           //           inputTemp: data.inputTemp,
//           //           isF: data.isF,
//           //           index: 0,
//           //         })
//           //       );
//           //       dispatch(
//           //         tgsHandleReadyHeatingSchedule({
//           //           location,
//           //           machine,
//           //           state: true,
//           //         })
//           //       );
//           //     }
//           //   })
//           // );
//         }

//         setSchedulerTemp(`${temp} °C`);
//       } else {
//         // message - minimum and maximum temperature!!!
//       }
//     }

//     // ---
//     setSchedulerTemp('');

//     // Clean up
//     handleCleanUp();
//     // 2.green contour around apply button
//     setIsApply(true);
//   };

//   // fan only handler
//   const handleDispatchFanOnly = () => {
//     loopMachinesHandler('tgs', tgsSwitch, 'fanOnly');

//     // Object.keys(tgsSwitch).forEach((location) =>
//     //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//     //     if (tgsSwitch[location][machine].isSelected) {
//     //       // unSelect individual machine as false
//     //       setUnSelectIndividualMachine({ location, machine });
//     //       setFanOnly({ location, machine, state: true });
//     //     }
//     //   })
//     // );

//     // Clean up
//     handleCleanUp();
//     // 2.green contour around apply button
//     setIsApply(true);
//   };

//   // ATS
//   const handleDispatchAts = (selection) => {
//     if (selectedSwt === 'ess') {
//       loopMachinesHandler(selectedSwt, essSwitch, 'ats', null, null, selection);

//       // Object.keys(essSwitch).forEach((location) =>
//       //   Object.keys(essSwitch[location]).forEach((machine) => {
//       //     if (essSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       dispatch(handleUnSelectIndividualMachine({ location, machine });
//       //       dispatch(handleAtsSelection({ location, machine, selection });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tes') {
//       loopMachinesHandler(selectedSwt, tesSwitch, 'ats', null, null, selection);

//       // Object.keys(tesSwitch).forEach((location) =>
//       //   Object.keys(tesSwitch[location]).forEach((machine) => {
//       //     if (tesSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       dispatch(tesHandleAtsSelection({ location, machine, selection });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tgs') {
//       loopMachinesHandler(selectedSwt, tgsSwitch, 'ats', null, null, selection);

//     //   Object.keys(tgsSwitch).forEach((location) =>
//     //     Object.keys(tgsSwitch[location]).forEach((machine) => {
//     //       if (tgsSwitch[location][machine].isSelected) {
//     //         // unSelect individual machine as false
//     //         setUnSelectIndividualMachine({ location, machine });
//     //         dispatch(tgsHandleAtsSelection({ location, machine, selection });
//     //       }
//     //     })
//     //   );
//     // }

//     // Clean up
//     handleCleanUp();
//   };

//   // Shut off
//   const handleDispatchShutOff = () => {
//     if (selectedSwt === 'ess') {
//       loopMachinesHandler(selectedSwt, essSwitch, 'shutOff');

//       // Object.keys(essSwitch).forEach((location) =>
//       //   Object.keys(essSwitch[location]).forEach((machine) => {
//       //     if (essSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       dispatch(handleUnSelectIndividualMachine({ location, machine });
//       //       dispatch(handleShutOff({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tes') {
//       loopMachinesHandler(selectedSwt, tesSwitch, 'shutOff');

//       // Object.keys(tesSwitch).forEach((location) =>
//       //   Object.keys(tesSwitch[location]).forEach((machine) => {
//       //     if (tesSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       setShutOff({ location, machine });
//       //     }
//       //   })
//       // );
//     } else if (selectedSwt === 'tgs') {
//       loopMachinesHandler(selectedSwt, tgsSwitch, 'shutOff');

//       // Object.keys(tgsSwitch).forEach((location) =>
//       //   Object.keys(tgsSwitch[location]).forEach((machine) => {
//       //     if (tgsSwitch[location][machine].isSelected) {
//       //       // unSelect individual machine as false
//       //       setUnSelectIndividualMachine({ location, machine });
//       //       dispatch(tgsHandleShutOff({ location, machine });
//       //     }
//       //   })
//       // );
//     }

//     // Clean up
//     handleCleanUp();
//   };
