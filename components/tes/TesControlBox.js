import { useEffect, useState , useMemo} from 'react';
import { useTESSwitchStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA,
  layerA180Deg,
  justifyContentSpaceBetween,
  layerB,
  activeLayer180Deg,
  readyTop180Deg,
  activeInput,
  layerC,
} from '../styles/commonStyles';

import MCConstantTemp from '../commonComponentsMC/controllers/MCConstantTemp';
import MCDisplayBoxWrapper from '../commonComponentsMC/controllers/MCDisplayBoxWrapper';
import MCHeatingSchedule from '../commonComponentsMC/controllers/MCHeatingSchedule';
import MCInstantHeat from '../commonComponentsMC/controllers/MCInstantHeat';
import MCSnowSensor from '../commonComponentsMC/controllers/MCSnowSensor';
import MCWindFactor from '../commonComponentsMC/controllers/MCWindFactor';

import InputTempMessage from '../userMessages/inputTempMessage';
import MachineTelemetry from '../commonComponentsMC/MachineTelemetry';
import HeaterStatus from '../commonComponentsMC/HeaterStatus';
import { useUnitsStore, useUserStore } from '../zustand-stores';

import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  formatTime,
  isAnotherSystemRunning,
} from '../../helpers/helpers';
import { postTesCommand } from '../../services/sendCommand.service';
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

const TesControlBox = ({
  location,
  machine,
  swtName,
  isMobile,
  setTemp,
}) => {
  // Global
  const { tesSwitch, flatTesSwitch } = useTESSwitchStore();
  const switchStatus = flatTesSwitch[location][machine];
  const {
    deviceMac,
    deviceStatus,
    isEssSwitch,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingScheduleList,
    heatingSchedule,
    windFactor,
    currentTemp,
    mobileSelectedProgram,
    isDisabled,
    displayConflictMessage,
    devicesConflicts,
    currentRun,
  } = flatTesSwitch[location][machine];

  const { permissions } = useUserStore();
  const disable = !permissions.WRITE;

  // Zustand actions
  const {
    setInstantHeatOff,
    setInstantHeat,
    setSnowSensorOff,
    setSnowSensor,
    setOptionalConstantTempOff,
    setWindFactor,
    setWindFactorOff,
    setAddHeatingSchedule,
    setReadyHeatingSchedule,
    setClearHeatingSchedule,
    setUnselectAllProgram,
    setSelectProgram,
    setDeactivateConflictMessage,
    setActivateConflictMessage,
    setDevicesConflicts,
    setOptionalConstantTempIsReady,
  } = useTESSwitchStore();

  // Use shared hooks for temperature state management (replaces ~80 lines)
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
  } = useControlBoxTemperatures(switchStatus, 'tes');

  // Use shared hooks for activation states (replaces ~25 lines)
  const {
    heatingScheduleActivated,
    snowSensorActivated,
    instantHeatActivated,
    windFactorActivated,
    constantTempActivated,
  } = useActivationStates(switchStatus, 'tes');

  // Use shared hooks for message box state (replaces ~15 lines)
  const {
    openMessageBox,
    message,
    programName,
    messageTitle,
    showMessage,
    closeMessageBox,
  } = useControlBoxMessages();

  // Keep heating schedule ready state dispatch (business logic not in hook)
  useEffect(() => {
    if (heatingScheduleList[0].inputTemp > 0) {
      setReadyHeatingSchedule({ location, machine, state: true });
    } else {
      setReadyHeatingSchedule({ location, machine, state: false });
    }
  }, [heatingScheduleList, setReadyHeatingSchedule, location, machine]);

  const integratedButtonHandler = (
    id,
    state,
    temp = 0,
    data = null,
    index = null
  ) => {
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
      case 'windFactor':
        windFactorHandler(state);
        break;
      case 'heatingSchedule':
        heatingScheduleHandler(state, temp, data, index);
        break;
    }
  };

  // Functions for Individual controllers
  const heatingScheduleHandler = (state, temp = null, data = null, index) => {
    if (state === 'off') {
      const data = [
        {
          start: { date: null, time: null },
          end: { date: null, time: null },
          inputTemp: null,
          isF: null,
        },
      ];
      setClearHeatingSchedule({ location, machine, data });
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
            setClearHeatingSchedule({ location, machine, data });
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
            setClearHeatingSchedule({ location, machine, data });
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
        deviceType: 'TES',
        startDate,
        endDate,
        threshold,
      };
      if (isAnotherSystemRunning(currentRun, 'gas')) {
        dispatch(tesActivateConflictMessage({ location, machine });
        setDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tgs-typhoon gas system',
            desiredSwitch: 'tgs-typhoon electric system',
            systemTarget: 'electric',
            commandTarget: 'schedule',
            extraData: {
              start: data.start,
              end: data.end,
              temp,
              index,
            },
        });
        return;
      }
      if (heatingScheduleList[index]?.id) {
        updateScheduleService(heatingScheduleList[index]?.id, scheduleData)
          .then((res) => {
            setAddHeatingSchedule({
                location,
                machine,
                start: data.start,
                end: data.end,
                index,
                inputTemp: temp,
                isF,
                id: res.id,
              });
          })
          .catch((e) => {
          });
      } else {
        createScheduleService(scheduleData)
          .then((res) => {
            setAddHeatingSchedule({
                location,
                machine,
                start: data.start,
                end: data.end,
                index,
                inputTemp: temp,
                isF,
                id: res.id,
              });
          })
          .catch((e) => {
          });
      }
    }
  };

  // !! TODO: implement specific location
  const instantHeatHandler = (state, temp) => {
    if (state === 'on') {
      // turn on
      if (isAnotherSystemRunning(currentRun, 'gas')) {
        dispatch(tesActivateConflictMessage({ location, machine });
        setDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tgs-typhoon gas system',
            desiredSwitch: 'tgs-typhoon electric system',
            systemTarget: 'electric',
            commandTarget: 'on_switch',
            extraData: isF ? convertFahrenheitToCelsius(temp) : temp,
        });
        return;
      }
      postTesCommand(
        deviceMac,
        'instant_temp',
        isF ? convertFahrenheitToCelsius(temp) : temp
      );
      postTesCommand(deviceMac, 'on_switch', 1);
      setInstantHeat({ location, machine, isF, temp });
    } else if (state === 'off') {
      // turn off
      postTesCommand(deviceMac, 'on_switch', 0);
      setInstantHeatOff({ location, machine });
    } else {
      // state === 'message'
      setInstantHeatTemp('');
      setProgramName('instant heat');
      handleMessageBox(state, 'instant heat');
    }
  };

  const constantTempHandler = (state, temp) => {
    if (state === 'on') {
      // turn on
      if (isAnotherSystemRunning(currentRun, 'gas')) {
        dispatch(tesActivateConflictMessage({ location, machine });
        setDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tgs-typhoon gas system',
            desiredSwitch: 'tgs-typhoon electric system',
            systemTarget: 'electric',
            commandTarget: 'on_constant',
            extraData: isF ? convertFahrenheitToCelsius(temp) : temp,
        });
        return;
      }
      postTesCommand(
        deviceMac,
        'constant_temp',
        isF ? convertFahrenheitToCelsius(temp) : temp
      );
      postTesCommand(deviceMac, 'on_constant', 1);
      setOptionalConstantTempIsReady({ location, machine, isF, temp });
    } else if (state === 'off') {
      // turn off
      postTesCommand(deviceMac, 'on_constant', 0);
      setOptionalConstantTempOff({ location, machine });
    } else {
      // state === 'message'
      setInstantHeatTemp('');
      setProgramName('optional constant temp.');
      handleMessageBox(state, 'optional constant temp.');
    }
  };

  const snowSensorHandler = (state) => {
    if (state === 'off') {
      postTesCommand(deviceMac, 'snow_enabled', 0);
      dispatch(tesHandleSnowSensorOff({ location, machine });
    } else if (state === 'on') {
      if (isAnotherSystemRunning(currentRun, 'gas')) {
        dispatch(tesActivateConflictMessage({ location, machine });
        setDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tgs-typhoon gas system',
            desiredSwitch: 'tgs-typhoon electric system',
            systemTarget: 'electric',
            commandTarget: 'snow_enabled',
        });
        return;
      }
      postTesCommand(deviceMac, 'snow_enabled', 1);
      setSnowSensor({ location, machine });
    } else {
      setProgramName('snow sensor program');
      handleMessageBox(state, 'snow sensor program');
    }
  };
  const windFactorHandler = (state) => {
    if (state === 'off') {
      postTesCommand(deviceMac, 'wind', 0);
      dispatch(tesHandleWindFactorOff({ location, machine });
    } else {
      if (isAnotherSystemRunning(currentRun, 'gas')) {
        dispatch(tesActivateConflictMessage({ location, machine });
        setDevicesConflicts({
            location,
            machine,
            currentSwitch: 'tgs-typhoon gas system',
            desiredSwitch: 'tgs-typhoon electric system',
            systemTarget: 'electric',
            commandTarget: 'wind',
        });
        return;
      }
      postTesCommand(deviceMac, 'wind', 1);
      setWindFactor({ location, machine });
    }
  };

  const handleMessageBox = (id, program) => {
    switch (id) {
      case 'tempA':
        // instantHeat, heating schedule
        setMessage([
          `in order to finalize ${program} `,
          'please input your temperature',
          '( the minimum temperature is 121°C - 250°F )',
          '( the maximum temperature is 999°C - 1830°F )',
        ]);
        setOpenMessageBox(true);
        break;
      case 'tempB':
        setMessage([
          `in order to finalize ${program}, `,
          'please input your temperature',
          '( the minimum temperature is 25°C - 77°F )',
          '( the maximum temperature is 120°C - 248°F )',
        ]);
        setOpenMessageBox(true);
        break;
      case 'selectA':
        setMessage(['please select locations first']);
        setOpenMessageBox(true);
        break;
      case 'selectB':
        setMessage(['please select locations and a schedule first']);
        setOpenMessageBox(true);
        break;
      default:
        throw new Error('unknown error', id);
    }
  };

  const handleSwitchController = (program) => {
    if (program === 'unselect') {
      dispatch(tesHandleUnselectAllProgram({ location, machine });
    } else {
      if (mobileSelectedProgram[program]) {
        dispatch(tesHandleUnselectAllProgram({ location, machine });
      } else {
        dispatch(tesHandleUnselectAllProgram({ location, machine });
        setSelectProgram({ location, machine, program });
      }
    }
  };

  const handleCancelConflictMessage = () => {
    setDeactivateConflictMessage({ location, machine });
  };

  // !! TODO: implement specific location
  const handleConfirmConflictMessage = () => {
    if (devicesConflicts.commandTarget === 'on_switch') {
      postTesCommand(deviceMac, 'instant_temp', devicesConflicts.extraData);
      postTesCommand(deviceMac, 'on_switch', 1);
      setInstantHeat({
          location,
          machine,
          isF,
          temp: devicesConflicts.extraData,
        });
    }
    if (devicesConflicts?.commandTarget === 'on_constant') {
      postTesCommand(deviceMac, 'constant_temp', devicesConflicts.extraData);
      postTesCommand(deviceMac, 'on_constant', 1);
      setOptionalConstantTempIsReady({
          location,
          machine,
          isF,
          temp: devicesConflicts.extraData,
        });
    }
    if (devicesConflicts.commandTarget === 'snow_enabled') {
      postTesCommand(deviceMac, 'snow_enabled', 1);
      setSnowSensor({ location, machine });
    }
    if (devicesConflicts.commandTarget === 'wind') {
      postTesCommand(deviceMac, 'wind', 1);
      setWindFactor({ location, machine });
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
          tesHandleAddHeatingSchedule({
            location,
            machine,
            start: devicesConflicts.extraData.start,
            end: devicesConflicts.extraData.end,
            index: devicesConflicts.extraData.index,
            inputTemp: devicesConflicts.extraData.temp,
            isF,
            id: res.id,
        });
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

    setDeactivateConflictMessage({ location, machine });
  };

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
                    isActivated={optionalConstantTemp.isActivated}
                    isReady={optionalConstantTemp.isReady}
                    isSelected={mobileSelectedProgram.optionalConstantTemp}
                    onClick={() =>
                      handleSwitchController('optionalConstantTemp')
                    }
                  >
                    <ButtonHole isActivated={optionalConstantTemp.isActivated}>
                      <IconImg src='/images/logo-constantTemp.svg' />
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
              isMobile={true}
              handleOnClick={integratedButtonHandler}
              isActivated={instantHeatActivated}
              isReady={instantHeat.isReady}
              setTempInput={setInstantHeatTemp}
              tempInput={instantHeatTemp}
              setMessage={setMessage}
              isDisabled={isDisabled || disable}
              
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
          {mobileSelectedProgram.optionalConstantTemp && (
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
            swtName='tes'
            location={location}
            machine={machine}
            setTemp={setTemp}
          />

          {displayConflictMessage && (
            <ConflictMessage
              currentSwitch={devicesConflicts.currentSwitch}
              DesiredSwitch={devicesConflicts.desiredSwitch}
              handleCancel={handleCancelConflictMessage}
              handleConfirm={handleConfirmConflictMessage}
            />
          )}

          <HeaterStatus
            isMobile={true}
            swtName='tes'
            location={location}
            machine={machine}
            isFaults={isFaults}
            isOff={isOff}
            // indivLocationName={indivLocationName}
          />
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
                location={location}
                machine={machine}
                swtName={swtName}
              />
              <MCSnowSensor
                handleOnClick={integratedButtonHandler}
                isActivated={snowSensorActivated}
                isReady={snowSensor.isReady}
                defaultTemp={snowSensorTemp}
                isDisabled={isDisabled || disable}
                location={location}
                machine={machine}
                swtName={swtName}
              />
              <MCConstantTemp
                handleOnClick={integratedButtonHandler}
                isActivated={optionalConstantTemp.isActivated}
                isReady={optionalConstantTemp.isReady}
                setTempInput={setConstantTemp}
                tempInput={constantTemp}
                isDisabled={isDisabled || disable}
                location={location}
                machine={machine}
                swtName={swtName}
              />

              <MCHeatingSchedule
                handleOnClick={integratedButtonHandler}
                heatingScheduleList={heatingScheduleList}
                isActivated={heatingScheduleActivated}
                isReady={heatingSchedule.isReady}
                tempInput={schedulerTemp}
                setTempInput={setSchedulerTemp}
                isDisabled={isDisabled || disable}
                location={location}
                machine={machine}
                swtName={swtName}
              />

              <MCWindFactor
                handleOnClick={integratedButtonHandler}
                isActivated={windFactorActivated}
                isReady={windFactor.isReady}
                isDisabled={isDisabled || disable}
                location={location}
                machine={machine}
                swtName={swtName}
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

export default TesControlBox;
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

// for desktop
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
