import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState , useMemo} from 'react';
import {
  tgsHandleInstantHeatOff,
  selectTgsSwitch,
  tgsHandleInstantHeat,
  tgsHandleSnowSensorOff,
  tgsHandleSnowSensor,
  tgsHandleWindFactor,
  tgsHandleWindFactorOff,
  tgsHandleAddHeatingSchedule,
  tgsHandleReadyHeatingSchedule,
  tgsHandleFanOnly,
  tgsHandleClearHeatingSchedule,
  tgsHandleUnselectAllProgram,
  tgsHandleSelectProgram,
  tgsDeactivateConflictMessage,
  tgsActivateConflictMessage,
  tgsSetDevicesConflicts,
} from '../store/slices/tgsSwitchSlice';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerA,
  justifyContentSpaceBetween,
  readyTop180Deg,
  activeInput,
  activeLayer180Deg,
  layerB,
  layerC,
} from '../styles/commonStyles';

import MCDisplayBoxWrapper from '../commonComponentsMC/controllers/MCDisplayBoxWrapper';
import MCHeatingSchedule from '../commonComponentsMC/controllers/MCHeatingSchedule';
import MCInstantHeat from '../commonComponentsMC/controllers/MCInstantHeat';
import MCSnowSensor from '../commonComponentsMC/controllers/MCSnowSensor';
import MCWindFactor from '../commonComponentsMC/controllers/MCWindFactor';

import InputTempMessage from '../userMessages/inputTempMessage';
import MCFanOnly from '../commonComponentsMC/controllers/MCFanOnly';
import MachineTelemetry from '../commonComponentsMC/MachineTelemetry';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { selectUserPermissions } from '../store/slices/userSlice';

import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  formatTime,
  isAnotherSystemRunning,
} from '../../helpers/helpers';
import { postTgsCommand } from '../../services/sendCommand.service';
import {
  createScheduleService,
  deleteScheduleService,
  updateScheduleService,
} from '../../services/schedule.service';
import ConflictMessage from '../masterControl/userMessages/ConflictMessage';
import {
  useControlBoxTemperatures,
  useActivationStates,
  useControlBoxMessages,
} from '../../hooks';

const TgsControlBox = ({ location, machine, swtName, setTemp, isMobile }) => {
  // Global
  const { flatTgsSwitch } = useSelector(selectTgsSwitch);
  const switchStatus = flatTgsSwitch[location][machine];
  const {
    deviceMac,
    deviceStatus,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
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
  } = flatTgsSwitch[location][machine];
  const permissions = useSelector(selectUserPermissions);
  const disable = !permissions.WRITE;
  const dispatch = useDispatch();

  // Use shared hooks for temperature state management (replaces ~80 lines)
  const {
    instantHeatTemp,
    schedulerTemp,
    snowSensorTemp,
    unit,
    isF,
    setInstantHeatTemp,
    setSchedulerTemp,
    setSnowSensorTemp,
  } = useControlBoxTemperatures(switchStatus, 'tgs');

  // Use shared hooks for activation states (replaces ~25 lines)
  const {
    heatingScheduleActivated,
    snowSensorActivated,
    instantHeatActivated,
    windFactorActivated,
    fanOnlyActivated,
  } = useActivationStates(switchStatus, 'tgs');

  // Use shared hooks for message box state (replaces ~15 lines)
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

  // Keep local state for ready (used in component logic)
  const [ready, setReady] = useState(false);

  // Keep heating schedule ready state dispatch (business logic not in hook)
  useEffect(() => {
    if (heatingScheduleList[0].inputTemp > 0) {
      dispatch(
        tgsHandleReadyHeatingSchedule({ location, machine, state: true })
      );
      setReady(true);
    } else {
      dispatch(
        tgsHandleReadyHeatingSchedule({ location, machine, state: false })
      );
      setReady(false);
    }
  }, [heatingScheduleList, dispatch, location, machine]);

  const integratedButtonHandler = (id, state, temp, data, index) => {
    switch (id) {
      case 'instantHeat':
        instantHeatHandler(state, temp);
        break;
      case 'snowSensor':
        snowSensorHandler(state);
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

  // Functions for Individual controllers
  const fanOnlyHandler = (state) => {
    if (state === 'on') {
      postTgsCommand(deviceMac, 'fan', 1);
      dispatch(tgsHandleFanOnly({ location, machine, state: true }));
    } else {
      if (
        instantHeat.isActivated ||
        snowSensor.isActivated ||
        windFactor.isActivated ||
        heatingSchedule.isActivated
      ) {
        // message
        handleMessageBox('fanOnly');
      } else {
        postTgsCommand(deviceMac, 'fan', 0);
        dispatch(tgsHandleFanOnly({ location, machine, state: false }));
      }
    }
  };

  const heatingScheduleHandler = (state, temp, data, index) => {
    if (state === 'off') {
      const data = [
        {
          start: { date: null, time: null },
          end: { date: null, time: null },
          inputTemp: null,
          isF: null,
        },
      ];
      dispatch(tgsHandleClearHeatingSchedule({ location, machine, data }));
    } else if (state === 'clear') {
      // delete
      let data;
      if (heatingSchedule.length === 2) {
        data = [
          {
            start: { date: null, time: null },
            end: { date: null, time: null },
            inputTemp: null,
            isF: null,
            id: null,
          },
        ];
        deleteScheduleService(heatingScheduleList[index]?.id)
          .then(() => {
            dispatch(
              tgsHandleClearHeatingSchedule({ location, machine, data })
            );
          })
          .catch((err) => {
          });
      } else if (heatingScheduleList.length - 1 === index) {
      } else {
        data = heatingScheduleList.filter(
          (schedule, idx) => index !== idx && schedule
        );
        deleteScheduleService(heatingScheduleList[index]?.id)
          .then(() => {
            dispatch(
              tgsHandleClearHeatingSchedule({ location, machine, data })
            );
          })
          .catch((err) => {
          });
      }
    } else {
      // state === 'on' set new schedule
      // data :object / index === schedule list's index
      const startDate = formatTime({ ...data.start });
      const endDate = formatTime({ ...data.end });
      const threshold = isF ? convertFahrenheitToCelsius(temp) : temp;
      const scheduleData = {
        deviceId: deviceMac,
        deviceType: 'TGS',
        startDate,
        endDate,
        threshold,
      };
      if (isAnotherSystemRunning(currentRun, 'electrical')) {
        dispatch(tgsActivateConflictMessage({ location, machine }));
        dispatch(
          tgsSetDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tes-typhoon electric system',
            desiredSwitch: 'tgs-typhoon gas system',
            systemTarget: 'gas',
            commandTarget: 'schedule',
            extraData: {
              start: data.start,
              end: data.end,
              temp,
              index,
            },
          })
        );
        return;
      }
      if (heatingScheduleList[index]?.id) {
        updateScheduleService(heatingScheduleList[index]?.id, scheduleData)
          .then((res) => {
            dispatch(
              tgsHandleAddHeatingSchedule({
                location,
                machine,
                start: data.start,
                end: data.end,
                index,
                inputTemp: temp,
                isF,
                id: res.id,
              })
            );
          })
          .catch((e) => {
          });
      } else {
        createScheduleService(scheduleData)
          .then((res) => {
            dispatch(
              tgsHandleAddHeatingSchedule({
                location,
                machine,
                start: data.start,
                end: data.end,
                index,
                inputTemp: temp,
                isF,
                id: res.id,
              })
            );
          })
          .catch((e) => {
          });
      }
    }
  };

  const instantHeatHandler = (state, temp) => {
    if (state === 'on') {
      if (isAnotherSystemRunning(currentRun, 'electrical')) {
        dispatch(tgsActivateConflictMessage({ location, machine }));
        dispatch(
          tgsSetDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tes-typhoon electric system',
            desiredSwitch: 'tgs-typhoon gas system',
            systemTarget: 'gas',
            commandTarget: 'on_switch',
            extraData: isF ? convertFahrenheitToCelsius(temp) : temp,
          })
        );
        return;
      }

      // turn on
      postTgsCommand(
        deviceMac,
        'instant_temp',
        isF ? convertFahrenheitToCelsius(temp) : temp
      );
      postTgsCommand(deviceMac, 'on_switch', 1);
      dispatch(tgsHandleInstantHeat({ location, machine, isF, temp }));
    } else if (state === 'off') {
      // turn off
      postTgsCommand(deviceMac, 'on_switch', 0);
      dispatch(tgsHandleInstantHeatOff({ location, machine }));
    } else {
      // state === 'message'
      setInstantHeatTemp('');
      setProgramName('instant heat program');
      handleMessageBox(state, 'instant heat');
    }
  };

  const snowSensorHandler = (state) => {
    if (state === 'off') {
      postTgsCommand(deviceMac, 'snow_enabled', 0);
      dispatch(tgsHandleSnowSensorOff({ location, machine }));
    } else if (state === 'on') {
      if (isAnotherSystemRunning(currentRun, 'electrical')) {
        dispatch(tgsActivateConflictMessage({ location, machine }));
        dispatch(
          tgsSetDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tes-typhoon electric system',
            desiredSwitch: 'tgs-typhoon gas system',
            systemTarget: 'gas',
            commandTarget: 'snow_enabled',
          })
        );
        return;
      }
      postTgsCommand(deviceMac, 'snow_enabled', 1);
      dispatch(tgsHandleSnowSensor({ location, machine }));
    } else {
      setProgramName('snow sensor program');
      handleMessageBox(state, 'snow sensor program');
    }
  };
  const windFactorHandler = (state) => {
    if (state === 'off') {
      postTgsCommand(deviceMac, 'wind', 0);
      // !! TODO: add specificLocation
      dispatch(tgsHandleWindFactorOff({ location, machine }));
    } else {
      if (isAnotherSystemRunning(currentRun, 'electrical')) {
        dispatch(tgsActivateConflictMessage({ location, machine }));
        dispatch(
          tgsSetDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tes-typhoon electric system',
            desiredSwitch: 'tgs-typhoon gas system',
            systemTarget: 'gas',
            commandTarget: 'wind',
          })
        );
        return;
      }
      postTgsCommand(deviceMac, 'wind', 1);
      dispatch(tgsHandleWindFactor({ location, machine }));
    }
  };

  const handleMessageBox = (id, program) => {
    setMessageTitle('switch control');

    switch (id) {
      case 'tempA':
        // instantHeat, heating schedule
        setMessage([
          'wrong temperature',
          'please input your temperature',
          '( the minimum temperature is 121°C - 250°F )',
          '( the maximum temperature is 999°C - 1830°F )',
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
        // scheduler
        setMessage(['please select locations and schedule first']);
        setOpenMessageBox(true);
        break;
      case 'fanOnly':
        // fan only
        setMessage([
          'the fan should always run while the heater is running in tgs',
        ]);
        setOpenMessageBox(true);
        break;
      default:
        throw new Error('unknown error', id);
    }
  };

  // !! TODO: add specific location
  // for mobile
  const handleSwitchController = (program) => {
    if (program === 'unselect') {
      dispatch(tgsHandleUnselectAllProgram({ location, machine }));
    } else {
      if (mobileSelectedProgram[program]) {
        dispatch(tgsHandleUnselectAllProgram({ location, machine }));
      } else {
        dispatch(tgsHandleUnselectAllProgram({ location, machine }));
        dispatch(tgsHandleSelectProgram({ location, machine, program }));
      }
    }
  };

  const handleCancelConflictMessage = () => {
    dispatch(tgsDeactivateConflictMessage({ location, machine }));
  };

  const handleConfirmConflictMessage = () => {
    if (devicesConflicts.commandTarget === 'on_switch') {
      postTgsCommand(deviceMac, 'instant_temp', devicesConflicts.extraData);
      postTgsCommand(deviceMac, 'on_switch', 1);
      dispatch(
        tgsHandleInstantHeat({
          location,
          machine,
          isF,
          temp: devicesConflicts.extraData,
        })
      );
    }
    if (devicesConflicts.commandTarget === 'fan') {
      postTgsCommand(deviceMac, 'fan', 1);
      dispatch(tgsHandleFanOnly({ location, machine, state: true }));
    }
    if (devicesConflicts.commandTarget === 'snow_enabled') {
      postTgsCommand(deviceMac, 'snow_enabled', 1);
      dispatch(tgsHandleSnowSensor({ location, machine }));
    }
    if (devicesConflicts.commandTarget === 'wind') {
      postTgsCommand(deviceMac, 'wind', 1);
      dispatch(tgsHandleWindFactor({ location, machine }));
    }
    if (devicesConflicts.commandTarget === 'schedule') {
      const startDate = formatTime({ ...devicesConflicts.extraData.start });
      const endDate = formatTime({ ...devicesConflicts.extraData.end });
      const threshold = +devicesConflicts.extraData.temp;
      const scheduleData = {
        deviceId: deviceMac,
        deviceType: 'TGS',
        startDate,
        endDate,
        threshold,
      };
      const dispatchData = (res) =>
        dispatch(
          tgsHandleAddHeatingSchedule({
            location,
            machine,
            start: devicesConflicts.extraData.start,
            end: devicesConflicts.extraData.end,
            index: devicesConflicts.extraData.index,
            inputTemp: devicesConflicts.extraData.temp,
            isF,
            id: res.id,
          })
        );
      if (heatingScheduleList[devicesConflicts.extraData.index]?.id) {
        updateScheduleService(
          heatingScheduleList[devicesConflicts.extraData.index]?.id,
          scheduleData
        )
          .then((res) => dispatchData(res))
          .catch((e) => {
          });
      } else {
        createScheduleService(scheduleData)
          .then((res) => dispatchData(res))
          .catch((e) => {
          });
      }
    }

    dispatch(tgsDeactivateConflictMessage({ location, machine }));
  };

  return (
    <>
      {isMobile ? (
        <Wrapper>
          <SectionMobileSwitches
            isExpanded={Object.values(mobileSelectedProgram).includes(true)}
          >
            <MobileSwitchesInner>
              <SectionLogo>
                <Button
                  noButton={
                    !Object.values(mobileSelectedProgram).some(
                      (select) => select === true
                    )
                  }
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
                <SectionLogo>
                  <Button
                    isActivated={instantHeat.isActivated}
                    isSelected={mobileSelectedProgram.instantHeat}
                    onClick={() => {
                      handleSwitchController('instantHeat');
                    }}
                  >
                    <ButtonHole isActivated={instantHeat.isActivated}>
                      <IconImg src='/images/logo-instantHeat.svg' />
                    </ButtonHole>
                  </Button>
                </SectionLogo>

                <SectionLogo>
                  <Button
                    isActivated={fanOnly}
                    isSelected={mobileSelectedProgram.fanOnly}
                    onClick={() => handleSwitchController('fanOnly')}
                  >
                    <ButtonHole isActivated={fanOnly}>
                      <IconImg src='/images/tgs-fanOnly.svg' />
                    </ButtonHole>
                  </Button>
                </SectionLogo>

                <SectionLogo>
                  <Button
                    isActivated={snowSensor.isActivated}
                    isReady={snowSensor.isReady}
                    isSelected={mobileSelectedProgram.snowSensor}
                    onClick={() => {
                      handleSwitchController('snowSensor');
                    }}
                  >
                    <ButtonHole isActivated={snowSensor.isActivated}>
                      <IconImg src='/images/logo-snowSensor.svg' />
                    </ButtonHole>
                  </Button>
                </SectionLogo>

                <SectionLogo>
                  <Button
                    isActivated={heatingSchedule.isActivated}
                    isReady={heatingSchedule.isReady}
                    isSelected={mobileSelectedProgram.heatingSchedule}
                    onClick={() => handleSwitchController('heatingSchedule')}
                  >
                    <ButtonHole isActivated={heatingSchedule.isActivated}>
                      <IconImg src='/images/logo-schedule.svg' />
                    </ButtonHole>
                  </Button>
                </SectionLogo>

                <SectionLogo>
                  <Button
                    isActivated={windFactor.isActivated}
                    isReady={windFactor.isReady}
                    isSelected={mobileSelectedProgram.windFactor}
                    onClick={() => handleSwitchController('windFactor')}
                  >
                    <ButtonHole isActivated={windFactor.isActivated}>
                      <IconImg src='/images/logo-windFactor.svg' />
                    </ButtonHole>
                  </Button>
                </SectionLogo>
              </SectionController>
            </MobileSwitchesInner>
          </SectionMobileSwitches>

          {mobileSelectedProgram.instantHeat && (
            <MCInstantHeat
              handleOnClick={integratedButtonHandler}
              isActivated={instantHeatActivated}
              isReady={instantHeat.isReady}
              setTempInput={setInstantHeatTemp}
              tempInput={instantHeatTemp}
              setMessage={setMessage}
              isMobile={true}
              isDisabled={isDisabled || disable}
            />
          )}
          {mobileSelectedProgram.fanOnly && (
            <MCFanOnly
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={fanOnly}
              isWifi={isWifi}
              isDisabled={isDisabled || disable}
              isFanDisabled={isFanDisabled}
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
          {mobileSelectedProgram.windFactor && (
            <MCWindFactor
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={windFactorActivated}
              isReady={windFactor.isReady}
              isDisabled={isDisabled || disable}
            />
          )}
          <MachineTelemetry
            swtName='tgs'
            location={location}
            machine={machine}
            setTemp={setTemp}
          />

          {/* {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                messages={message}
                title={programName}
              />
            </MessageBoxWrapper>
          )} */}

          {displayConflictMessage && (
            <ConflictMessage
              currentSwitch={devicesConflicts.currentSwitch}
              DesiredSwitch={devicesConflicts.desiredSwitch}
              handleCancel={handleCancelConflictMessage}
              handleConfirm={handleConfirmConflictMessage}
            />
          )}

          {/* {disabledBox && (
            <DisabledWholePage
              onClick={() => {
                setDisplayFaultsMessageBox(true);
              }}
            ></DisabledWholePage>
          )} */}

          {/* {displayFaultsMessageBox && (
            <SettingConfirmedMessage
              alert={true}
              onClose={() => setDisplayFaultsMessageBox(false)}
              title={faultsType ? faultsType : 'faults'}
              message='SYSTEM OFF
          UNTIL RELEASE FAULT! Go to faults page to check the details'
              src={'/static/images/heater-off-alert.svg'}
            />
          )} */}
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
              <Title right={true}>{swtName} - controls</Title>

              <Title right={false}>id : { deviceStatus === 'NOT_LINKED' ? '' : deviceMac}</Title>
            </HeaderTitleWrapper>
          </SectionHeader>

          <SectionMain isFaults={isFaults}>
            <MainInnerWrapper>
              <MCInstantHeat
                handleOnClick={integratedButtonHandler}
                isActivated={instantHeatActivated}
                isReady={instantHeat.isReady}
                setTempInput={setInstantHeatTemp}
                tempInput={instantHeatTemp}
                setMessage={setMessage}
                isDisabled={isDisabled || disable}
                swtName={swtName}
                location={location}
                machine={machine}
              />
              <MCFanOnly
                handleOnClick={integratedButtonHandler}
                isActivated={fanOnly}
                isWifi={isWifi}
                isDisabled={isDisabled || disable}
                isFanDisabled={isFanDisabled}
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

              <MCHeatingSchedule
                handleOnClick={integratedButtonHandler}
                heatingScheduleList={heatingScheduleList}
                isActivated={heatingScheduleActivated}
                isReady={ready}
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
                title={messageTitle}
                subtitle={programName}
              />
            </MessageBoxWrapper>
          )}

          {displayConflictMessage && (
            <ConflictMessage
              currentSwitch={devicesConflicts.currentSwitch}
              DesiredSwitch={devicesConflicts.desiredSwitch}
              handleCancel={handleCancelConflictMessage}
              handleConfirm={handleConfirmConflictMessage}
            />
          )}

          {/* {disabledBox && (
            <DisabledWholePage
              onClick={() => {
                setDisplayFaultsMessageBox(true);
              }}
            ></DisabledWholePage>
          )} */}

          {/* {displayFaultsMessageBox && (
            <SettingConfirmedMessage
              alert={true}
              onClose={() => setDisplayFaultsMessageBox(false)}
              title={faultsType ? faultsType : 'faults'}
              message='SYSTEM OFF
          UNTIL RELEASE FAULT! Go to faults page to check the details'
              src={'/static/images/heater-off-alert.svg'}
            />
          )} */}
        </Wrapper>
      )}
    </>
  );
};

export default TgsControlBox;
const SectionMobileSwitches = styled.section`
  width: 303px;
  height: 60px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 4px;
    `}
`;

const MobileSwitchesInner = styled.div`
  width: 300px;
  height: 58px;
  border-radius: 31px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 6px;
`;

const SectionLogo = styled.section`
  width: 44px;
  height: 44px;
  ${layerC}
  border-radius: 50%;
  ${flexBoxCenter}

  ${(p) => p.isReady && css``};
  ${(p) => p.isActivated && css``};
`;
const Button = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.noButton &&
    css`
      cursor: default;
    `}

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}

    ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg};
    `};
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg};
    `};
`;
const ButtonHole = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput};
    `};
`;

const ButtonTop = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const IconImg = styled.img`
  ${(p) =>
    p.isMc ||
    css`
      height: 100%;
    `}
  ${(p) =>
    p.isAts &&
    css`
      height: 80%;
    `}
`;

const SectionController = styled.section`
  width: 238px;
  height: 48px;
  border-radius: 26px;

  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
`;

const ComponentWrapper = styled.div`
  width: 147px;
  height: 36px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;
const SubButton = styled.button`
  width: 145px;
  height: 34px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;

const SubButtonHole = styled.div`
  width: 137px;
  height: 26px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const SubButtonTop = styled.div`
  width: 135px;
  height: 24px;
  border-radius: 25px;
  ${layerA180Deg};
  ${(p) =>
    p.isAts
      ? css`
          ${justifyContentSpaceBetween}
          padding: 0 6px;
        `
      : css`
          ${flexBoxCenter}
        `}
`;
const ButtonName = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;

  ${(p) =>
    p.isGp &&
    css`
      color: #95ff45;
    `};

  ${(p) =>
    p.isEbp &&
    css`
      color: #ff7800;
    `};
`;

// for desk top
const Wrapper = styled.div`
  width: 413px;
  ${flexBoxCenter}
  display: flex;
  flex-direction: column;

  position: relative;
`;
const SectionHeader = styled.section`
  width: 100%;
  position: relative;
`;

const HeaderTitleWrapper = styled.div`
  position: absolute;
  top: 3px;
  padding: 0 6px;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;

  ${(p) =>
    p.right
      ? css`
          margin-left: 2px;
        `
      : css`
          width: 53%;
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;
const HeaderHatSvg = styled.img`
  position: relative;
`;

const SectionMain = styled.section`
  width: 413px;
  height: 665px;

  background: transparent linear-gradient(180deg, #20354e 0%, #060d19 100%);
  border: 1px solid #000000;
  border-radius: 0px 12px 12px 12px;

  ${flexBoxCenter}

  ${({ isFaults }) =>
    isFaults &&
    css`
      border: 1px solid red;
    `}
`;

const MainInnerWrapper = styled.div`
  width: 401px;
  height: 654px;
  border-radius: 8px;

  background: #233a54;
  box-shadow: inset 0px 0px 6px #000000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: 1.5px 0;
`;

const MessageBoxWrapper = styled.div`
  width: 1180px;
  height: 600px;
  position: absolute;

  ${flexBoxCenter}

  top: 0;
  left: 0;
  z-index: 100;
`;
