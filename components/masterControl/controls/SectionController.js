import { useEffect, useState } from 'react';
import { useMCCommandStore, useMCStore, useUnitsStore } from '../../zustand-stores';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectMC } from '../../store/slices/mCSlice';
import selectedMachinesSlice, {
  AddScheduleHandlerTempo,
  constantHeatHandlerTempo,
  fanOnlyHandlerTempo,
  handleClearScheduler,
  instantHeatHandlerTempo,
  selectedMachinesState,
  snowSensorHandlerTempo,
  windFactorHandlerTempo,
} from '../../store/slices/selectedMachinesSlice';
import styled, { css } from 'styled-components';
import { flexBoxCenter } from '../../styles/commonStyles';
import InputTempMessage from '../../userMessages/inputTempMessage';
import HeatingScheduler from '../controls/heatingScheduler/HeatingScheduler';
import InstantHeat from '../controls/instantHeat/instantHeat';
import OptionalConstantTemp from '../controls/optionalConstantTemp/OptionalConstantTemp';
import SnowSensor from '../controls/snowSensor/SnowSensor';
import WindFactor from '../controls/windFactor/WindFactor';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import { selectMCCommand } from '../../store/slices/mCCommandSlice';
import SnowSensorAndWindFactor from './snowSensorAndWindFactor/SnowSensorAndWindFactor';

const SectionControllers = ({
  isReady,
  handleSelectController,
  selectedController,
  // controllersStatus,
  // false : editable || true : unable to edit
  // commandConfirmed,
  handleCreateNewCommandMessageBox,
  isDialSysDisabled,
}) => {
  // Global States
  const selectedSwitch = useMCStore();
  const { ess, tgs, tes, hp } = selectedSwitch.selectSystem;

  const selectsState = useSelector(selectedMachinesState);

  const { controllersStatus, isNewCommandCreated } =
    useMCCommandStore();
  // const selectedMachineStates = useSelector(selectedMachinesState);
  // const { mCOff } = selectedMachineStates;

  const {
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingSchedule,
    heatingScheduleList,
    windFactor,
    isFanOnly,
    mCOff,
  } = selectsState;

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Local States
  const [displayMessageBox, setDisplayMessageBox] = useState(false);
  const [message, setMessage] = useState([]);
  const [messageTitle, setMessageTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const [instantHeatTemp, setInstantHeatTemp] = useState('');
  const [optionalTemp, setOptionalTemp] = useState('');
  const [schedulerTemp, setSchedulerTemp] = useState('');

  const [isShutOff, setIsShutOff] = useState(false);

  
  useEffect(() => {
    const willShutOff = Object.values(mCOff).some((state) => state === true);
    willShutOff ? setIsShutOff(true) : setIsShutOff(false);
  }, [mCOff]);

  useEffect(() => {
    instantHeat.temp !== 0
      ? setInstantHeatTemp(instantHeat.temp)
      : setInstantHeatTemp('');
    optionalConstantTemp.temp !== 0
      ? setOptionalTemp(optionalConstantTemp.temp)
      : setOptionalTemp('');
    heatingScheduleList[0].inputTemp !== 0
      ? setSchedulerTemp(heatingScheduleList[0].inputTemp)
      : setSchedulerTemp('');
  }, [selectsState]);

  useEffect(() => {
    if (tgs) {
      if (instantHeat.ready || optionalConstantTemp.ready) {
        fanOnlyHandler('on');
      }
    }
  }, [selectsState]);

  const integratedHandler = (btnName, state, data = null) => {
    switch (btnName) {
      case 'instantHeat':
        instantHeatHandler(state);
        // fanOnlyHandler(state);
        break;
      case 'fanOnly':
        fanOnlyHandler(state);
        break;
      case 'snowSensor':
        snowSensorHandler(state);
        break;
      case 'constantTemp':
        constantTempHandler(state);
        break;
      case 'heatingSchedule':
        heatingScheduleHandler(state, data);
        break;
      case 'windFactor':
        windFactorHandler(state);
        break;
      default:
        break;
    }
  };

  const instantHeatHandler = (state) => {
    if (state === 'on') {
      // turn on
      dispatch(
        instantHeatHandlerTempo({ temp: instantHeatTemp, isF, state: true });
    } else if (state === 'off') {
      // turn off
      dispatch(instantHeatHandlerTempo({ temp: 0, isF, state: false });
    } else {
      // message
      handleMessageBox('instant heat program', [
        `in order to finalize instant heat program,`,
        'please input your temperature first',
        '( the minimum temperature is 121°C - 250°F )',
        '( the maximum temperature is 999°C - 1830°F )',
      ]);
    }
  };

  const constantTempHandler = (state) => {
    if (state === 'on') {
      dispatch(
        constantHeatHandlerTempo({ temp: optionalTemp, isF, state: true });
    } else if (state === 'off') {
      // turn off
      dispatch(constantHeatHandlerTempo({ temp: 0, isF, state: false });
    } else {
      // message
      handleMessageBox('optional constant temp.', [
        `in order to finalize instant heat program,`,
        'please input your temperature first',
        '( the minimum temperature is 25°C - 77°F )',
        '( the maximum temperature is 120°C - 248°F )',
      ]);
    }
  };

  const heatingScheduleHandler = (state, data = null) => {
    if (state === 'on') {
      // turn on
      dispatch(AddScheduleHandlerTempo(data);
    } else if (state === 'off') {
      dispatch(handleClearScheduler();
    } else {
      // message
      handleMessageBox('heating schedule program', [
        `in order to finalize heating schedule program,`,
        'please input your temperature first',
        '( the minimum temperature is 121°C - 250°F )',
        '( the maximum temperature is 999°C - 1830°F )',
      ]);
    }
  };

  const fanOnlyHandler = (state) => {
    if (state === 'on') {
      dispatch(fanOnlyHandlerTempo(true);
    } else {
      dispatch(fanOnlyHandlerTempo(false);
    }
  };
  const snowSensorHandler = (state) => {
    if (state === 'on') {
      dispatch(snowSensorHandlerTempo(true);
    } else if (state === 'off') {
      dispatch(snowSensorHandlerTempo(false);
    } else {
      handleMessageBox('snow sensor program', []);
    }
  };
  const windFactorHandler = (state) => {
    if (state === 'on') {
      // turn on
      dispatch(windFactorHandlerTempo(true);
    } else if (state === 'off') {
      // turn off
      dispatch(windFactorHandlerTempo(false);
    } else {
      // message
      handleMessageBox('wind factor program', []);
    }
  };

  const handleMessageBox = (swtName, message, subtitle) => {
    setMessage(message);
    setMessageTitle(swtName);
    setSubtitle(subtitle);
    setDisplayMessageBox(true);
  };

  return (
    <Wrapper isReady={isReady}>
      <InstantHeat
        // isSelected={selectedController[0] && !commandConfirmed}
        // isEditable={!commandConfirmed}
        isSelected={selectedController[0] && isNewCommandCreated}
        isEditable={isNewCommandCreated}
        handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
        isReadyToDispatch={instantHeat.ready}
        isFanOnlyReadyToDispatch={isFanOnly}
        handleSelect={() => isShutOff || handleSelectController(1)}
        buttonHandler={integratedHandler}
        tempInput={instantHeatTemp}
        setTempInput={setInstantHeatTemp}
        isActivated={controllersStatus[0]}
        isFanOnlyActivated={controllersStatus[2]}
        isTgs={tgs}
        setDisplayMessageBox={setDisplayMessageBox}
        setMessage={setMessage}
        setMessageTitle={setMessageTitle}
        isDialSysDisabled={isDialSysDisabled}
        setSubtitle={setSubtitle}

        // later implement with states fater final dispatch
      />
      {!hp ? (
        <>
          <SnowSensor
            // isSelected={selectedController[1] && !commandConfirmed}
            // isEditable={!commandConfirmed}
            isSelected={selectedController[1] && isNewCommandCreated}
            isEditable={isNewCommandCreated}
            handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
            handleSelect={() => isShutOff || handleSelectController(2)}
            buttonHandler={integratedHandler}
            isReady={controllersStatus[1]}
            isReadyToDispatch={snowSensor.ready}
            isDialSysDisabled={isDialSysDisabled}
            handleMessageBox={handleMessageBox}
            isF={isF}
          />
          <OptionalConstantTemp
            // isSelected={selectedController[2] && !commandConfirmed}
            // isEditable={!commandConfirmed}
            isSelected={selectedController[2] && isNewCommandCreated}
            isEditable={isNewCommandCreated}
            handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
            handleSelect={() => {
              isShutOff || handleSelectController(3);
            }}
            buttonHandler={integratedHandler}
            tempInput={optionalTemp}
            setTempInput={setOptionalTemp}
            isTgs={tgs}
            isActivated={controllersStatus[2]}
            isInstantHeatActive={instantHeat.ready}
            isReadyToDispatch={optionalConstantTemp.ready}
            setDisplayMessageBox={setDisplayMessageBox}
            setMessage={setMessage}
            setMessageTitle={setMessageTitle}
            isDialSysDisabled={isDialSysDisabled}
            setSubtitle={setSubtitle}
          />
        </>
      ) : (
        <SnowSensorAndWindFactor />
      )}
      <HeatingScheduler
        // isSelected={selectedController[3] && !commandConfirmed}
        // isEditable={!commandConfirmed}
        isSelected={selectedController[3] && isNewCommandCreated}
        isEditable={isNewCommandCreated}
        handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
        handleSelect={() => isShutOff || handleSelectController(4)}
        buttonHandler={integratedHandler}
        tempInput={schedulerTemp}
        setTempInput={setSchedulerTemp}
        heatingScheduleList={selectsState.heatingScheduleList[0]}
        isReady={controllersStatus[3]}
        isReadyToDispatch={heatingSchedule.ready}
        setDisplayMessageBox={setDisplayMessageBox}
        setMessage={setMessage}
        setMessageTitle={setMessageTitle}
        isDialSysDisabled={isDialSysDisabled}
        setSubtitle={setSubtitle}
      />

      {!hp && (
        <WindFactor
          // isSelected={selectedController[4] && !commandConfirmed}
          // isEditable={!commandConfirmed}
          isSelected={selectedController[4] && isNewCommandCreated}
          isEditable={isNewCommandCreated}
          handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
          handleSelect={() => isShutOff || handleSelectController(5)}
          buttonHandler={integratedHandler}
          isReady={controllersStatus[4]}
          isReadyToDispatch={selectsState.windFactor.ready}
          isDialSysDisabled={isDialSysDisabled}
          handleMessageBox={handleMessageBox}
        />
      )}

      {displayMessageBox && (
        <MessageBoxWrapper>
          <InputTempMessage
            onClose={() => setDisplayMessageBox(false)}
            title={messageTitle}
            messages={message}
            subtitle={subtitle}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default SectionControllers;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${(p) =>
    p.isReady ||
    css`
      visibility: hidden;
    `}
`;

const MessageBoxWrapper = styled.div`
  width: 1216px;
  height: 300px;

  ${flexBoxCenter}
  padding-right: 300rem;

  position: absolute;
  top: 0;
  z-index: 100;
`;
