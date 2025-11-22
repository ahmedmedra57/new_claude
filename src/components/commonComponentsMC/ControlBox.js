import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  useControlBoxTemperatures,
  useActivationStates,
  useControlBoxMessages,
} from '../../hooks';
import {
  convertFahrenheitToCelsius,
  formatTime,
  isAnotherSystemRunning,
} from '../../helpers/helpers';
import {
  createScheduleService,
  deleteScheduleService,
  updateScheduleService,
} from '../../services/schedule.service';

import MCConstantTemp from './controllers/MCConstantTemp';
import MCDisplayBoxWrapper from './controllers/MCDisplayBoxWrapper';
import MCHeatingSchedule from './controllers/MCHeatingSchedule';
import MCInstantHeat from './controllers/MCInstantHeat';
import MCSnowSensor from './controllers/MCSnowSensor';
import MCWindFactor from './controllers/MCWindFactor';
import MCFanOnly from './controllers/MCFanOnly';
import InputTempMessage from '../userMessages/inputTempMessage';
import ConflictMessage from '../masterControl/userMessages/ConflictMessage';
import MachineTelemetry from './MachineTelemetry';
import HeaterStatus from './HeaterStatus';

import { selectUserPermissions } from '../store/slices/userSlice';
import { systemConfigs } from './systemConfigs';
import {
  Wrapper,
  SectionMobileSwitches,
  MobileSwitchesInner,
  SectionLogo,
  Button,
  ButtonHole,
  ButtonTop,
  IconImg,
  SectionController,
  SectionHeader,
  HeaderHatSvg,
  HeaderTitleWrapper,
  Title,
  SectionMain,
  MainInnerWrapper,
  MessageBoxWrapper,
} from './ControlBox.styles';

/**
 * Generic ControlBox component for ESS, TGS, and TES systems
 * Replaces EssControlBox, TgsControlBox, and TesControlBox
 */
const ControlBox = ({
  systemType,
  isMobile,
  location,
  machine,
  swtName,
  setTemp,
  indivLocationName,
}) => {
  const config = systemConfigs[systemType];
  const dispatch = useDispatch();

  // Get system-specific state
  const switchState = useSelector(config.selectSwitch);
  // Property names are flatEssSwitch, flatTgsSwitch, flatTesSwitch (lowercase after 'flat')
  const flatSwitchKey = `flat${config.systemType.charAt(0)}${config.systemType.slice(1).toLowerCase()}Switch`;
  const flatSwitch = switchState[flatSwitchKey];
  const switchStatus = flatSwitch[location][machine];

  const {
    deviceMac,
    deviceStatus,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingScheduleList,
    heatingSchedule,
    windFactor,
    fanOnly,
    currentTemp,
    mobileSelectedProgram,
    isDisabled,
    isFanDisabled,
    isWifi,
    displayConflictMessage,
    devicesConflicts,
    currentRun,
  } = switchStatus;

  const permissions = useSelector(selectUserPermissions);
  const disable = !permissions.WRITE;

  // Use shared hooks for temperature state management
  const {
    instantHeatTemp,
    constantTemp,
    schedulerTemp,
    snowSensorTemp,
    unit,
    isF,
    setInstantHeatTemp,
    setConstantTemp,
    setSchedulerTemp,
    setSnowSensorTemp,
  } = useControlBoxTemperatures(switchStatus, systemType);

  // Use shared hooks for activation states
  const {
    heatingScheduleActivated,
    snowSensorActivated,
    instantHeatActivated,
    windFactorActivated,
    constantTempActivated,
    fanOnlyActivated,
  } = useActivationStates(switchStatus, systemType);

  // Use shared hooks for message box state
  const {
    openMessageBox,
    message,
    programName,
    messageTitle,
    showMessage,
    closeMessageBox,
    setOpenMessageBox,
    setMessage,
    setProgramName,
    setMessageTitle,
  } = useControlBoxMessages();

  // Keep local state for ready (used in TGS component logic)
  const [ready, setReady] = useState(false);

  // Keep heating schedule ready state dispatch
  useEffect(() => {
    const readyAction = config.actions.handleReadyHeatingSchedule;
    if (readyAction) {
      if (heatingScheduleList[0].inputTemp > 0) {
        dispatch(readyAction({ location, machine, state: true }));
        setReady(true);
      } else {
        dispatch(readyAction({ location, machine, state: false }));
        setReady(false);
      }
    }
  }, [heatingScheduleList, dispatch, location, machine, config.actions]);

  // Integrated button handler
  const integratedButtonHandler = (id, state, temp, data, index) => {
    switch (id) {
      case 'instantHeat':
        instantHeatHandler(state, temp);
        break;
      case 'snowSensor':
        snowSensorHandler(state);
        break;
      case 'constantTemp':
        constantTempHandler(state, temp);
        break;
      case 'fanOnly':
        fanOnlyHandler(state);
        break;
      case 'windFactor':
        windFactorHandler(state);
        break;
      case 'heatingSchedule':
        heatingScheduleHandler(state, temp, data, index);
        break;
      default:
        break;
    }
  };

  // Check for conflicts (TGS/TES only)
  const checkConflict = (commandTarget, extraData = null) => {
    if (systemType === 'tgs' && isAnotherSystemRunning(currentRun, 'electrical')) {
      const activateAction = config.actions.tgsActivateConflictMessage;
      const setConflictsAction = config.actions.tgsSetDevicesConflicts;

      dispatch(activateAction({ location, machine }));
      dispatch(setConflictsAction({
        location,
        machine,
        currentSwitch: 'tes-typhoon electric system',
        desiredSwitch: 'tgs-typhoon gas system',
        systemTarget: 'gas',
        commandTarget,
        extraData,
      }));
      return true;
    }

    if (systemType === 'tes' && isAnotherSystemRunning(currentRun, 'gas')) {
      const activateAction = config.actions.tesActivateConflictMessage;
      const setConflictsAction = config.actions.tesSetDevicesConflicts;

      dispatch(activateAction({ location, machine }));
      dispatch(setConflictsAction({
        location,
        machine,
        currentSwitch: 'tgs-typhoon gas system',
        desiredSwitch: 'tes-typhoon electric system',
        systemTarget: 'electrical',
        commandTarget,
        extraData,
      }));
      return true;
    }

    return false;
  };

  // Handler functions
  const heatingScheduleHandler = (state, temp, data, index) => {
    const clearAction = config.actions.handleClearHeatingSchedule;
    const addAction = config.actions.handleAddHeatingSchedule;

    if (state === 'off') {
      const data = [{
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
      }];
      dispatch(clearAction({ location, machine, data }));
    } else if (state === 'clear') {
      let data;
      if (heatingSchedule.length === 2) {
        data = [{
          start: { date: null, time: null },
          end: { date: null, time: null },
          inputTemp: null,
          isF: null,
          id: null,
        }];
        deleteScheduleService(heatingScheduleList[index]?.id)
          .then(() => {
            dispatch(clearAction({ location, machine, data }));
          })
          .catch((err) => {});
      } else if (heatingScheduleList.length - 1 === index) {
      } else {
        data = heatingScheduleList.filter((schedule, idx) => index !== idx && schedule);
        deleteScheduleService(heatingScheduleList[index]?.id)
          .then(() => {
            dispatch(clearAction({ location, machine, data }));
          })
          .catch((err) => {});
      }
    } else {
      // Check conflict for TGS/TES
      if (checkConflict('schedule', { start: data.start, end: data.end, temp, index })) {
        return;
      }

      const startDate = formatTime({ ...data.start });
      const endDate = formatTime({ ...data.end });
      const threshold = isF ? convertFahrenheitToCelsius(temp) : temp;
      const scheduleData = {
        deviceId: deviceMac,
        deviceType: config.systemType,
        startDate,
        endDate,
        threshold,
      };

      if (heatingScheduleList[index]?.id) {
        updateScheduleService(heatingScheduleList[index]?.id, scheduleData)
          .then((res) => {
            dispatch(addAction({
              location,
              machine,
              start: data.start,
              end: data.end,
              index,
              inputTemp: temp,
              isF,
              id: res.id,
            }));
          })
          .catch((e) => {});
      } else {
        createScheduleService(scheduleData)
          .then((res) => {
            dispatch(addAction({
              location,
              machine,
              start: data.start,
              end: data.end,
              index,
              inputTemp: temp,
              isF,
              id: res.id,
            }));
          })
          .catch((e) => {});
      }
    }
  };

  const instantHeatHandler = (state, temp) => {
    if (state === 'on') {
      // Check conflict for TGS/TES
      if (checkConflict('on_switch', isF ? convertFahrenheitToCelsius(temp) : temp)) {
        return;
      }

      config.postCommand(deviceMac, 'instant_temp', isF ? convertFahrenheitToCelsius(temp) : temp);
      config.postCommand(deviceMac, 'on_switch', 1);
      dispatch(config.actions.handleInstantHeatReady({ location, machine, isF, temp }));
    } else if (state === 'off') {
      config.postCommand(deviceMac, 'on_switch', 0);
      dispatch(config.actions.handleInstantHeatOff({ location, machine }));
    } else {
      setInstantHeatTemp && setInstantHeatTemp('');
      setProgramName(systemType === 'ess' ? 'instant heat' : 'instant heat program');
      handleMessageBox(state, 'instant heat');
    }
  };

  const constantTempHandler = (state, temp) => {
    if (!config.hasFanOnly) {
      const readyAction = config.actions.handleOptionalConstantTempReady;
      const offAction = config.actions.handleMachineOptionalConstantTempOff;

      if (state === 'on') {
        config.postCommand(deviceMac, 'constant_temp', isF ? convertFahrenheitToCelsius(temp) : temp);
        config.postCommand(deviceMac, 'on_constant', 1);
        dispatch(readyAction({ location, machine, isF, temp }));
      } else if (state === 'off') {
        config.postCommand(deviceMac, 'on_constant', 0);
        dispatch(offAction({ location, machine }));
      } else {
        setProgramName('optional constant temp.');
        handleMessageBox(state, 'optional constant temp');
      }
    }
  };

  const fanOnlyHandler = (state) => {
    if (config.hasFanOnly) {
      const fanOnlyAction = config.actions.handleFanOnly;

      if (state === 'on') {
        config.postCommand(deviceMac, 'fan', 1);
        dispatch(fanOnlyAction({ location, machine, state: true }));
      } else {
        if (
          instantHeat.isActivated ||
          snowSensor.isActivated ||
          windFactor.isActivated ||
          heatingSchedule.isActivated
        ) {
          handleMessageBox('fanOnly');
        } else {
          config.postCommand(deviceMac, 'fan', 0);
          dispatch(fanOnlyAction({ location, machine, state: false }));
        }
      }
    }
  };

  const snowSensorHandler = (state) => {
    if (state === 'off') {
      config.postCommand(deviceMac, 'snow_enabled', 0);
      dispatch(config.actions.handleSnowSensorOff({ location, machine }));
    } else if (state === 'on') {
      // Check conflict for TGS/TES
      if (checkConflict('snow_enabled')) {
        return;
      }

      config.postCommand(deviceMac, 'snow_enabled', 1);
      dispatch(config.actions.handleSnowSensor({ location, machine }));
    } else {
      setProgramName('snow sensor program');
      handleMessageBox(state, 'snow sensor program');
    }
  };

  const windFactorHandler = (state) => {
    if (state === 'off') {
      config.postCommand(deviceMac, 'wind', 0);
      dispatch(config.actions.handleWindFactorOff({ location, machine }));
    } else {
      // Check conflict for TGS/TES
      if (checkConflict('wind')) {
        return;
      }

      config.postCommand(deviceMac, 'wind', 1);
      dispatch(config.actions.handleWindFactor({ location, machine }));
    }
  };

  const handleMessageBox = (id, program) => {
    if (systemType === 'tgs') {
      setMessageTitle('switch control');
    }

    switch (id) {
      case 'tempA':
        setMessage([
          systemType === 'ess' ? `in order to finalize ${program} ` : 'wrong temperature',
          'please input your temperature',
          '( the minimum temperature is 121°C - 250°F )',
          '( the maximum temperature is 999°C - 1830°F )',
        ]);
        setOpenMessageBox(true);
        break;
      case 'tempB':
        setMessage([
          `in order to finalize ${program} `,
          'please input your temperature',
          '( the minimum temperature is 25°C - 77°F )',
          '( the maximum temperature is 120°C - 248°F )',
        ]);
        setOpenMessageBox(true);
        break;
      case 'tempMissing':
        setMessage(['temperature missing', 'please input temperature']);
        setOpenMessageBox(true);
        break;
      case 'selectA':
        setMessage(['please select locations first']);
        setOpenMessageBox(true);
        break;
      case 'selectB':
        setMessage([systemType === 'ess' ? 'please select locations and a schedule first' : 'please select locations and schedule first']);
        setOpenMessageBox(true);
        break;
      case 'fanOnly':
        setMessage(['the fan should always run while the heater is running in tgs']);
        setOpenMessageBox(true);
        break;
      default:
        throw new Error('unknown error', id);
    }
  };

  // For mobile
  const handleSwitchController = (program) => {
    const unselectAction = config.actions.handleUnselectAllProgram;
    const selectAction = config.actions.handleSelectProgram;

    if (program === 'unselect') {
      dispatch(unselectAction({ location, machine }));
    } else {
      if (mobileSelectedProgram[program]) {
        dispatch(unselectAction({ location, machine }));
      } else {
        dispatch(unselectAction({ location, machine }));
        dispatch(selectAction({ location, machine, program }));
      }
    }
  };

  // Conflict handlers (TGS/TES only)
  const handleCancelConflictMessage = () => {
    if (systemType === 'tgs') {
      dispatch(config.actions.tgsDeactivateConflictMessage({ location, machine }));
    } else if (systemType === 'tes') {
      dispatch(config.actions.tesDeactivateConflictMessage({ location, machine }));
    }
  };

  const handleConfirmConflictMessage = () => {
    if (devicesConflicts.commandTarget === 'on_switch') {
      config.postCommand(deviceMac, 'instant_temp', devicesConflicts.extraData);
      config.postCommand(deviceMac, 'on_switch', 1);
      dispatch(config.actions.handleInstantHeatReady({
        location,
        machine,
        isF,
        temp: devicesConflicts.extraData,
      }));
    }
    if (devicesConflicts.commandTarget === 'fan') {
      config.postCommand(deviceMac, 'fan', 1);
      dispatch(config.actions.handleFanOnly({ location, machine, state: true }));
    }
    if (devicesConflicts.commandTarget === 'snow_enabled') {
      config.postCommand(deviceMac, 'snow_enabled', 1);
      dispatch(config.actions.handleSnowSensor({ location, machine }));
    }
    if (devicesConflicts.commandTarget === 'wind') {
      config.postCommand(deviceMac, 'wind', 1);
      dispatch(config.actions.handleWindFactor({ location, machine }));
    }
    if (devicesConflicts.commandTarget === 'schedule') {
      const startDate = formatTime({ ...devicesConflicts.extraData.start });
      const endDate = formatTime({ ...devicesConflicts.extraData.end });
      const threshold = +devicesConflicts.extraData.temp;
      const scheduleData = {
        deviceId: deviceMac,
        deviceType: config.systemType,
        startDate,
        endDate,
        threshold,
      };
      const dispatchData = (res) =>
        dispatch(config.actions.handleAddHeatingSchedule({
          location,
          machine,
          start: devicesConflicts.extraData.start,
          end: devicesConflicts.extraData.end,
          index: devicesConflicts.extraData.index,
          inputTemp: devicesConflicts.extraData.temp,
          isF,
          id: res.id,
        }));

      if (heatingScheduleList[devicesConflicts.extraData.index]?.id) {
        updateScheduleService(
          heatingScheduleList[devicesConflicts.extraData.index]?.id,
          scheduleData
        )
          .then((res) => dispatchData(res))
          .catch((e) => {});
      } else {
        createScheduleService(scheduleData)
          .then((res) => dispatchData(res))
          .catch((e) => {});
      }
    }

    if (systemType === 'tgs') {
      dispatch(config.actions.tgsDeactivateConflictMessage({ location, machine }));
    } else if (systemType === 'tes') {
      dispatch(config.actions.tesDeactivateConflictMessage({ location, machine }));
    }
  };

  // Render mobile programs
  const mobileProgramIcons = [
    { key: 'instantHeat', src: '/images/logo-instantHeat.svg', state: instantHeat },
    config.hasFanOnly
      ? { key: 'fanOnly', src: '/images/tgs-fanOnly.svg', state: fanOnly }
      : { key: 'optionalConstantTemp', src: '/images/logo-constantTemp.svg', state: optionalConstantTemp },
    { key: 'snowSensor', src: '/images/logo-snowSensor.svg', state: snowSensor },
    { key: 'heatingSchedule', src: '/images/logo-schedule.svg', state: heatingSchedule },
    { key: 'windFactor', src: '/images/logo-windFactor.svg', state: windFactor },
  ];

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <SectionMobileSwitches
            isExpanded={Object.values(mobileSelectedProgram).includes(true)}
          >
            <MobileSwitchesInner>
              <SectionLogo>
                <Button
                  noButton={!Object.values(mobileSelectedProgram).some((select) => select === true)}
                  onClick={() => handleSwitchController('unselect')}
                >
                  <ButtonHole>
                    <ButtonTop>
                      <IconImg src='/images/mc-title.svg' isMc={true} />
                    </ButtonTop>
                  </ButtonHole>
                </Button>
              </SectionLogo>

              <SectionController>
                {mobileProgramIcons.map((icon) => (
                  <SectionLogo key={icon.key}>
                    <Button
                      isActivated={icon.state?.isActivated || icon.state}
                      isReady={icon.state?.isReady}
                      isSelected={mobileSelectedProgram[icon.key]}
                      onClick={() => handleSwitchController(icon.key)}
                    >
                      <ButtonHole isActivated={icon.state?.isActivated || icon.state}>
                        <IconImg src={icon.src} />
                      </ButtonHole>
                    </Button>
                  </SectionLogo>
                ))}
              </SectionController>
            </MobileSwitchesInner>
          </SectionMobileSwitches>

          {mobileSelectedProgram.instantHeat && (
            <MCInstantHeat
              isMobile={isMobile}
              handleOnClick={integratedButtonHandler}
              isActivated={instantHeat.isActivated}
              setTempInput={setInstantHeatTemp}
              tempInput={instantHeatTemp}
              setMessage={setMessage}
              isDisabled={isDisabled || disable}
              isReady={instantHeat.isReady}
            />
          )}

          {mobileSelectedProgram.snowSensor && (
            <MCSnowSensor
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={snowSensorActivated}
              isReady={snowSensor.isReady}
              defaultTemp={snowSensorTemp}
              isDisabled={isDisabled || disable}
            />
          )}

          {mobileSelectedProgram.optionalConstantTemp && !config.hasFanOnly && (
            <MCConstantTemp
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={optionalConstantTemp.isActivated}
              isReady={optionalConstantTemp.isReady}
              setTempInput={setConstantTemp}
              tempInput={constantTemp}
              isDisabled={isDisabled || disable}
            />
          )}

          {mobileSelectedProgram.fanOnly && config.hasFanOnly && (
            <MCFanOnly
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={fanOnly}
              isWifi={isWifi}
              isDisabled={isDisabled || disable}
              isFanDisabled={isFanDisabled}
            />
          )}

          {mobileSelectedProgram.windFactor && (
            <MCWindFactor
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={windFactorActivated}
              isReady={windFactor.isReady}
              isDisabled={isDisabled || disable}
            />
          )}

          {mobileSelectedProgram.heatingSchedule && (
            <MCHeatingSchedule
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              heatingScheduleList={heatingScheduleList}
              isActivated={heatingScheduleActivated}
              isReady={heatingSchedule.isReady}
              tempInput={schedulerTemp}
              setTempInput={setSchedulerTemp}
              isDisabled={isDisabled || disable}
            />
          )}

          <MachineTelemetry
            swtName={systemType}
            location={location}
            machine={machine}
            setTemp={setTemp}
          />

          {systemType === 'ess' && (
            <HeaterStatus
              isMobile={true}
              swtName={systemType}
              location={location}
              machine={machine}
              isFaults={isFaults}
              isOff={isOff}
              indivLocationName={indivLocationName}
            />
          )}

          {displayConflictMessage && (
            <ConflictMessage
              currentSwitch={devicesConflicts?.currentSwitch}
              DesiredSwitch={devicesConflicts?.desiredSwitch}
              handleCancel={handleCancelConflictMessage}
              handleConfirm={handleConfirmConflictMessage}
            />
          )}
        </Wrapper>
      ) : (
        <Wrapper>
          <SectionHeader>
            <HeaderHatSvg
              src={
                isFaults
                  ? '/images/controller-hat-faults.svg'
                  : '/images/controller-hat.svg'
              }
            />
            <HeaderTitleWrapper>
              <Title right={true}>
                {swtName}
                -controls
              </Title>
              <Title right={false}>id : {deviceStatus === 'NOT_LINKED' ? '' : deviceMac}</Title>
            </HeaderTitleWrapper>
          </SectionHeader>

          <SectionMain isFaults={isFaults}>
            <MainInnerWrapper>
              <MCInstantHeat
                handleOnClick={integratedButtonHandler}
                isActivated={instantHeatActivated}
                setTempInput={setInstantHeatTemp}
                tempInput={instantHeatTemp}
                setMessage={setMessage}
                isDisabled={isDisabled || disable}
                isReady={instantHeat.isReady}
                swtName={swtName}
                location={location}
                machine={machine}
              />
              <MCSnowSensor
                handleOnClick={integratedButtonHandler}
                isActivated={snowSensorActivated}
                isReady={snowSensor.isReady}
                defaultTemp={snowSensorTemp}
                isDisabled={isDisabled || disable}
                swtName={swtName}
                location={location}
                machine={machine}
              />
              {!config.hasFanOnly && (
                <MCConstantTemp
                  handleOnClick={integratedButtonHandler}
                  isActivated={optionalConstantTemp.isActivated}
                  isReady={optionalConstantTemp.isReady}
                  setTempInput={setConstantTemp}
                  tempInput={constantTemp}
                  isDisabled={isDisabled || disable}
                  swtName={swtName}
                  location={location}
                  machine={machine}
                />
              )}

              <MCHeatingSchedule
                handleOnClick={integratedButtonHandler}
                heatingScheduleList={heatingScheduleList}
                isActivated={heatingScheduleActivated}
                isReady={heatingSchedule.isReady}
                tempInput={schedulerTemp}
                setTempInput={setSchedulerTemp}
                isDisabled={isDisabled || disable}
                swtName={swtName}
                location={location}
                machine={machine}
              />

              <MCWindFactor
                handleOnClick={integratedButtonHandler}
                isActivated={windFactorActivated}
                isReady={windFactor.isReady}
                isDisabled={isDisabled || disable}
                swtName={swtName}
                location={location}
                machine={machine}
              />
              <MCDisplayBoxWrapper
                swtName={swtName}
                location={location}
                machine={machine}
              />
            </MainInnerWrapper>
          </SectionMain>

          {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                messages={message}
                title={programName}
              />
            </MessageBoxWrapper>
          )}

          {displayConflictMessage && (
            <ConflictMessage
              currentSwitch={devicesConflicts?.currentSwitch}
              DesiredSwitch={devicesConflicts?.desiredSwitch}
              handleCancel={handleCancelConflictMessage}
              handleConfirm={handleConfirmConflictMessage}
            />
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ControlBox;
