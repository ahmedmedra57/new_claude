import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SwitchWrapper from './SwitchWrapper';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import {
  useGetGraphQueries,
  useGetSSRsQueries,
  useSetAndCurrentTemp,
  useSwitchData,
  useProgramIcons,
  useSwitchControls,
  useHeaderHat,
} from '../../hooks';
import InputTempMessage from '../userMessages/inputTempMessage';
import TurnOffMessageBox from './controllers/TurnOffMessageBox';
import { selectUserPermissions } from '../store/slices/userSlice';
import { systemConfigs } from './systemConfigs';
import * as S from './MasterControlByMachine.styles';

/**
 * Reusable MasterControlByMachine component for ESS, TGS, and TES systems
 * Eliminates ~6000 lines of code duplication across the three system components
 *
 * @param {Object} props
 * @param {'ess' | 'tgs' | 'tes'} props.systemType - The type of system (ess, tgs, or tes)
 * @param {string} props.location - Location identifier
 * @param {string} props.machine - Machine identifier
 * @param {boolean} props.isMobile - Whether in mobile view
 * @param {string} props.selectedProgramSrc - Selected program icon source
 * @param {string} props.indivLocationName - Individual location name
 */
const MasterControlByMachine = ({
  systemType,
  location,
  machine,
  isMobile,
  selectedProgramSrc,
  indivLocationName,
}) => {
  // Get configuration for this system type
  const config = systemConfigs[systemType];

  if (!config) {
    throw new Error(`Invalid system type: ${systemType}. Must be 'ess', 'tgs', or 'tes'`);
  }

  // Permissions and units
  const dispatch = useDispatch();
  const permissions = useSelector(selectUserPermissions);
  const disabled = config.requiresPermissionCheck ? !permissions.WRITE : false;
  const { isF } = useSelector(selectUnits);

  // Use shared hooks for switch data
  const switchDataHook = useSwitchData(location, machine, systemType, isMobile, isF);
  const {
    switchData,
    deviceMac,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingSystem,
    heatingSchedule,
    windFactor,
    fanOnly,
    isGp,
    isEbp,
    isWifi,
    openMachineController,
    mobileSelectedProgram,
    machineName,
    reading,
    isDisabled,
    freezeBy,
    EBP_mode,
    switch_panels,
    headerTitle,
    energyConsumption,
    energyUnit: unit,
    energySource: source,
    swtLocationName,
    freezeByName,
    isActivated,
    isReadyInstantHeat,
    isReady,
    userId: user_id,
  } = switchDataHook;

  // Use shared hooks for program icons
  const {
    selectedProgramSrc: selectedProgramByMachineSrc,
    activatedProgramSrc,
    readyProgramSrc,
  } = useProgramIcons(switchData, mobileSelectedProgram, systemType);

  // Use shared hooks for controls
  const controls = useSwitchControls(systemType, location, machine, deviceMac, user_id, isF);

  // Local state for input temp
  const [inputTemp, setInputTemp] = useState('');

  // Keep existing hooks
  const { setTemp, currentTemp } = useSetAndCurrentTemp(switchData);
  useGetGraphQueries(location, machine, systemType.toUpperCase());

  // Conditionally call useGetSSRsQueries for ESS and TES only
  const shouldCallSSRQuery = config.hasSSRQueries;
  useGetSSRsQueries(
    shouldCallSSRQuery ? location : null,
    shouldCallSSRQuery ? machine : null,
    shouldCallSSRQuery ? systemType.toUpperCase() : null
  );

  // Sync input temp with instantHeat
  useEffect(() => {
    if (typeof instantHeat?.inputTemp === 'number') {
      if (isF) {
        setInputTemp(`${instantHeat.inputTemp} °F`);
      } else {
        setInputTemp(`${instantHeat.inputTemp} °C`);
      }
    }
  }, [instantHeat?.inputTemp, isF]);

  const handleHeaderButton = (btnName) => {
    // Placeholder for future implementation
  };

  // Use control handlers from the hook
  const handleButtonClick = (btnName) => {
    controls.handleButtonClick(btnName, { isOff, isReady });
  };

  const handleCloseMessage = () => {
    if (typeof instantHeat?.inputTemp === 'number') {
      if (isF) {
        setInputTemp(`${instantHeat.inputTemp} °F`);
      } else {
        setInputTemp(`${instantHeat.inputTemp} °C`);
      }
    } else {
      setInputTemp('');
    }
    controls.closeMessageBox();
  };

  const handleInstantHeatBtn = (e, title) => {
    e.preventDefault();
    controls.handleInstantHeat(inputTemp, isActivated, isReadyInstantHeat, title);
  };

  const handleOpenMachineDetail = () => {
    controls.handleMachineDetailToggle(openMachineController);
  };

  // Use shared hook for header hat
  const hatImg = useHeaderHat(isOff, isFaults, headerTitle, isMobile);

  // Get the ControlBox component for this system
  const ControlBox = config.ControlBoxComponent;

  // Determine if fanOnly feature should be shown (TGS only)
  const hasFanOnly = systemType === 'tgs' && fanOnly;

  // Get header titles based on system type
  const getHeaderTitles = () => {
    switch (systemType) {
      case 'ess':
        return { second: 'ate' };
      case 'tgs':
        return { second: 'tes/ate' };
      case 'tes':
        return { second: 'tgs/ate' };
      default:
        return { second: 'ate' };
    }
  };

  const headerTitles = getHeaderTitles();

  // Computed values to reduce duplication
  const isEbpBlocked = EBP_mode === 0 && isEbp;
  const isFullyDisabled = isOff || isDisabled || disabled || isEbpBlocked;

  // Reusable style objects
  const getDisabledStyles = (condition = isEbpBlocked) =>
    condition ? {
      pointerEvents: 'none',
      cursor: 'not-allowed',
    } : {};

  // Helper function for close button handler
  const handleClose = () => {
    dispatch(
      config.actions.handleOpenMachineController({
        location,
        machine,
        status: false,
      })
    );
    dispatch(
      config.actions.handleExpandSSRDetail({
        location,
        machine,
        status: false,
      })
    );
    sessionStorage.removeItem('machineId');
  };

  // Helper function for expand button handler
  const handleExpand = () => {
    if (!isOff) {
      dispatch(
        config.actions.handleOpenMachineController({
          location,
          machine,
          status: true,
        })
      );
      sessionStorage.setItem('machineId', machine);
    }
  };

  return (
    <>
      {isMobile ? (
        <S.Wrapper
          isExpanded={openMachineController}
          isMobile={true}
          isFaults={isFaults}
        >
          <S.SectionHeader isMobile={true}>
            <S.HeaderHat
              first={true}
              imgSrc={
                isOff
                  ? '/images/MC-machine-header2-mobile.svg'
                  : '/images/MC-machine-header2-mobile.svg'
              }
              isMobile={true}
            >
              <S.HeaderTitle
                onClick={() => handleHeaderButton(headerTitles.second)}
                isMobile={true}
              >
                {headerTitles.second}
              </S.HeaderTitle>
            </S.HeaderHat>
          </S.SectionHeader>

          <S.SectionMainContentClose
            isFaults={isFaults}
            isOff={isOff || disabled}
            isMobile={true}
            isExpanded={openMachineController}
            systemType={systemType}
          >
            <S.SectionMain isOff={isOff || disabled} isMobile={true}>
              <S.MainWrapperTop isOff={isOff || disabled}>
                <S.LeftWrapper>
                  <S.ShutOffButton
                    isMobile={true}
                    onClick={() => handleButtonClick('shutOff')}
                    isOff={isOff || disabled}
                  >
                    <S.Img
                      isShutOff={true}
                      src={
                        isOff || disabled ? '/images/turn-on.svg' : '/images/shut-off.svg'
                      }
                    />
                  </S.ShutOffButton>

                  <S.TitleAndConsumptionWrapper>
                    <S.MainTitleWrapper>
                      <S.MainTitle>{headerTitle}</S.MainTitle>
                    </S.MainTitleWrapper>

                    <S.SectionConsumption isOff={isOff || disabled} isMobile={true}>
                      <S.ConsumptionWrapper isOff={isOff || disabled} isMobile={true}>
                        <S.ConsumptionImgWrapper isMobile={true}>
                          <S.Img
                            energy={true}
                            src={
                              isOff
                                ? '/images/MC-energy-consumption-disabled.svg'
                                : '/images/MC-energy-consumption.svg'
                            }
                          />
                        </S.ConsumptionImgWrapper>

                        <S.ContentSpanWrapper>
                          <S.ConsumptionTitleS
                            isOff={isOff || disabled}
                            first={true}
                            isMobile={true}
                          >
                            {source} consumption
                          </S.ConsumptionTitleS>

                          <S.ConsumptionTitleWrapper isMobile={true}>
                            <S.ConsumptionTitleG isOff={isOff || disabled} isMobile={true}>
                              {energyConsumption}
                            </S.ConsumptionTitleG>
                            <S.ConsumptionUnit isOff={isOff || disabled} isMobile={true}>
                              {unit}
                            </S.ConsumptionUnit>
                          </S.ConsumptionTitleWrapper>
                        </S.ContentSpanWrapper>
                      </S.ConsumptionWrapper>
                    </S.SectionConsumption>
                  </S.TitleAndConsumptionWrapper>
                </S.LeftWrapper>

                <S.RightWrapper isOff={isOff || disabled}>
                  <S.RightTop isOff={isOff || disabled}>
                    <S.MobileButton
                      isOff={isOff || disabled}
                      noButton={true}
                      isActivated={activatedProgramSrc ? true : false}
                      isReady={readyProgramSrc ? true : false}
                    >
                      <S.MobileButtonHole
                        isOff={isOff || disabled}
                        isActivated={activatedProgramSrc ? true : false}
                      >
                        {activatedProgramSrc ? (
                          <S.Img src={activatedProgramSrc} />
                        ) : readyProgramSrc ? (
                          <S.Img src={readyProgramSrc} />
                        ) : selectedProgramByMachineSrc ? (
                          <S.Img src={selectedProgramByMachineSrc} />
                        ) : (
                          selectedProgramSrc && <S.Img src={selectedProgramSrc} />
                        )}
                      </S.MobileButtonHole>
                    </S.MobileButton>
                    <S.SectionMobileInfoDisplay>
                      <S.DisplayWrapper>
                        <S.DisplayInfo isLeft={true} isOff={isOff || disabled}>
                          <S.MobileImg
                            src={
                              isOff
                                ? '/images/fault-sm-disabled.svg'
                                : isFaults
                                ? '/images/fault-sm-active.svg'
                                : '/images/fault-sm.svg'
                            }
                          />
                        </S.DisplayInfo>
                        <S.DisplayInfo isOff={isOff}>
                          <S.MobileImg
                            src={
                              isOff
                                ? '/images/wifi-none.svg'
                                : isWifi
                                ? '/images/wifi-active.svg'
                                : '/images/wifi-none.svg'
                            }
                          />
                        </S.DisplayInfo>
                      </S.DisplayWrapper>

                      <S.DisplayWrapper>
                        <S.DisplayInfo
                          isSpaceBetween={true}
                          isLeft={true}
                          isOff={isOff}
                        >
                          <S.InfoTitle
                            state={isGp}
                            title={'gp'}
                            isOff={isOff}
                            isMobile={true}
                          >
                            gp
                          </S.InfoTitle>
                          <S.MobileImg
                            src={
                              isOff
                                ? '/images/battery-none.svg'
                                : isGp
                                ? '/images/gp-battery.svg'
                                : '/images/battery-none.svg'
                            }
                          />
                        </S.DisplayInfo>
                        <S.DisplayInfo isSpaceBetween={true} isOff={isOff}>
                          <S.InfoTitle
                            title={'ebp'}
                            state={isEbp}
                            isMobile={true}
                          >
                            ebp
                          </S.InfoTitle>
                          <S.MobileImg
                            src={
                              isOff
                                ? '/images/battery-none.svg'
                                : isEbp
                                ? '/images/ebp-battery.svg'
                                : '/images/battery-none.svg'
                            }
                          />
                        </S.DisplayInfo>
                      </S.DisplayWrapper>
                    </S.SectionMobileInfoDisplay>

                    <S.MobileButton
                      isOff={isOff}
                      isExpanded={openMachineController}
                      onClick={handleOpenMachineDetail}
                    >
                      <S.MobileButtonHole
                        isExpanded={openMachineController}
                        isOff={isOff}
                      >
                        <S.MobileButtonTop
                          isExpanded={openMachineController}
                          isOff={isOff}
                        >
                          <S.Img
                            expandIcon={true}
                            src={
                              isOff
                                ? '/images/MC-expand-disabled.svg'
                                : openMachineController
                                ? '/images/MC-expand-true.svg'
                                : '/images/MC-expand-false.svg'
                            }
                          />
                        </S.MobileButtonTop>
                      </S.MobileButtonHole>
                    </S.MobileButton>
                  </S.RightTop>
                </S.RightWrapper>
              </S.MainWrapperTop>
            </S.SectionMain>

            {openMachineController ? (
              <S.SectionMainContentExpand isMobile={true} isFaults={isFaults}>
                <ControlBox
                  isMobile={true}
                  swtName={systemType}
                  location={location}
                  machine={machine}
                  setTemp={setTemp}
                />
              </S.SectionMainContentExpand>
            ) : (
              <S.SectionSub isOff={isOff} isMobile={true}>
                <S.DisplayTempMobile isOff={isOff}>
                  set t. {setTemp ? setTemp : '---'}
                  {isF ? '°F' : '°C'}
                </S.DisplayTempMobile>

                <S.DisplayTempMobile isOff={isOff}>
                  cur. t. {isOff ? '---' : `${currentTemp}`}°C
                </S.DisplayTempMobile>
              </S.SectionSub>
            )}
          </S.SectionMainContentClose>
        </S.Wrapper>
      ) : (
        <S.Wrapper isExpanded={openMachineController}>
          {/* Desktop view */}

          <S.SectionHeader>
            <S.SectionHeaderWrapper
              titleLength={headerTitle.length}
              right={true}
              isExpanded={true}
            >
              <S.HeaderHat
                titleLength={headerTitle.length}
                imgSrc={hatImg}
                first={true}
              >
                <S.HeaderTitle
                  onClick={() => handleHeaderButton('switch')}
                  isSwitch={true}
                >
                  {headerTitle}
                </S.HeaderTitle>
                {/* hover box when the shut off button is turned off and to show location and specific location */}
                <S.HoverBox>
                  <TurnOffMessageBox
                    locationName={isOff ? swtLocationName : ''}
                    switchName={isOff ? headerTitle : 'location'}
                    message={
                      isOff
                        ? `maintenance in progress by: ${freezeByName}`
                        : swtLocationName
                    }
                    isSwitchDisabled={isOff}
                  />
                </S.HoverBox>
              </S.HeaderHat>

              <S.HeaderHat
                second={true}
                imgSrc={'/images/MC-machine-header2.svg'}
              >
                <S.HeaderTitle onClick={() => handleHeaderButton(headerTitles.second)}>
                  {headerTitles.second}
                </S.HeaderTitle>
              </S.HeaderHat>
            </S.SectionHeaderWrapper>

            <S.SectionHeaderWrapper
              right={false}
              isExpanded={openMachineController}
            >
              <S.HeaderHat third={true} imgSrc={'/images/MC-machine-header3.svg'}>
                <S.HeaderButton onClick={handleClose}>
                  <S.HeaderButtonOuter>
                    <S.HeaderButtonHole>
                      <S.HeaderButtonTop>close</S.HeaderButtonTop>
                    </S.HeaderButtonHole>
                  </S.HeaderButtonOuter>
                </S.HeaderButton>
              </S.HeaderHat>
            </S.SectionHeaderWrapper>
          </S.SectionHeader>

          {openMachineController ? (
            <S.SectionMainContentExpand isFaults={isFaults}>
              <SwitchWrapper
                swtName={systemType}
                location={location}
                machine={machine}
                indivLocationName={indivLocationName}
              />
            </S.SectionMainContentExpand>
          ) : (
            <S.SectionMainContentClose isFaults={isFaults} isOff={isOff} systemType={systemType}>
              <S.SectionMain isOff={isOff}>
                <S.ShutOffButton
                  onClick={() => handleButtonClick('shutOff')}
                  isOff={isOff}
                >
                  <S.Img
                    isShutOff={true}
                    src={isOff ? '/images/turn-on.svg' : '/images/shut-off.svg'}
                  />
                </S.ShutOffButton>

                <S.InstantHeatWrapper
                  onSubmit={(e) => {
                    e.preventDefault();
                    !isFullyDisabled && handleInstantHeatBtn(e, 'switch control');
                  }}
                  isOff={isFullyDisabled}
                  hasFanOnly={hasFanOnly}
                  style={getDisabledStyles()}
                >
                  <S.InstantHeatInner
                    isActivated={isActivated}
                    isReady={isReadyInstantHeat}
                    isOff={isFullyDisabled}
                    style={getDisabledStyles()}
                  >
                    <S.Button
                      onClick={(e) => {
                        e.preventDefault();
                        !isFullyDisabled && handleInstantHeatBtn(e, 'switch control');
                      }}
                      isActivated={isActivated}
                      isOff={isFullyDisabled}
                      style={getDisabledStyles()}
                    >
                      <S.ButtonHole
                        isActivated={isActivated}
                        isReady={instantHeat.isReady}
                        isOff={isFullyDisabled}
                        style={getDisabledStyles()}
                      >
                        <S.ButtonTop
                          isActivated={isActivated}
                          isOff={isFullyDisabled}
                          style={getDisabledStyles()}
                        >
                          <S.Img
                            src={
                              isFullyDisabled
                                ? '/images/logo-instantHeat-disabled.svg'
                                : '/images/logo-instantHeat.svg'
                            }
                          />
                        </S.ButtonTop>
                      </S.ButtonHole>
                    </S.Button>

                    <S.ControllerTitle isOff={isFullyDisabled}>
                      instant <br></br> heat
                    </S.ControllerTitle>

                    <S.TempInput
                      type='text'
                      placeholder={isF ? '0 °F' : '0 °C'}
                      value={inputTemp}
                      onChange={(e) =>
                        !isFullyDisabled && setInputTemp(e.target.value)
                      }
                      isActivated={isActivated}
                      isOff={isFullyDisabled}
                      style={getDisabledStyles()}
                    />
                  </S.InstantHeatInner>
                </S.InstantHeatWrapper>

                <S.SnowSensorWrapper
                  isOff={isFullyDisabled}
                  style={getDisabledStyles()}
                >
                  <S.SnowSensorInner
                    isActivated={snowSensor?.isActivated}
                    isReady={isReady}
                    isOff={isFullyDisabled}
                  >
                    <S.Button
                      onClick={() =>
                        !isFullyDisabled && handleButtonClick('snowSensor')
                      }
                      isOff={isFullyDisabled}
                      style={getDisabledStyles()}
                    >
                      <S.ButtonHole
                        isOff={isFullyDisabled}
                        style={getDisabledStyles()}
                      >
                        <S.ButtonTop
                          isOff={isFullyDisabled}
                          style={getDisabledStyles()}
                        >
                          <S.Img
                            src={
                              isFullyDisabled
                                ? '/images/logo-snowSensor-disabled.svg'
                                : '/images/logo-snowSensor.svg'
                            }
                          />
                        </S.ButtonTop>
                      </S.ButtonHole>
                    </S.Button>

                    <S.ControllerTitle isOff={isFullyDisabled}>
                      snow <br></br> sensor
                    </S.ControllerTitle>
                  </S.SnowSensorInner>
                </S.SnowSensorWrapper>
              </S.SectionMain>

              <S.SectionSub isOff={isOff}>
                <S.SectionConsumption isOff={isOff}>
                  <S.ConsumptionWrapper isOff={isOff}>
                    <S.ConsumptionImgWrapper>
                      <S.Img
                        energy={true}
                        src={
                          isOff
                            ? '/images/MC-energy-consumption-disabled.svg'
                            : '/images/MC-energy-consumption.svg'
                        }
                      />
                    </S.ConsumptionImgWrapper>
                    <S.ConsumptionTitleS isOff={isOff} first={true}>
                      total {source}
                    </S.ConsumptionTitleS>
                    <S.ConsumptionTitleS isOff={isOff}>
                      consumption
                    </S.ConsumptionTitleS>

                    <S.ConsumptionTitleWrapper>
                      <S.ConsumptionTitleG isOff={isOff}>
                        {energyConsumption}
                      </S.ConsumptionTitleG>
                      <S.ConsumptionUnit isOff={isOff}>{unit}</S.ConsumptionUnit>
                    </S.ConsumptionTitleWrapper>
                  </S.ConsumptionWrapper>
                </S.SectionConsumption>

                <S.SectionTemperature isOff={isOff}>
                  <S.DisplayTempWrapper isOff={isOff}>
                    <S.DisplayTempWrapperTop isOff={isOff}>
                      set temp. {setTemp ? setTemp : '---'}
                      {isF ? '°F' : '°C'}
                    </S.DisplayTempWrapperTop>
                  </S.DisplayTempWrapper>
                  <S.DisplayTempWrapper isOff={isOff}>
                    <S.DisplayTempWrapperTop isOff={isOff}>
                      cur. temp.{' '}
                      {isOff ? '---' : currentTemp ? `${currentTemp}` : '---'}°C
                    </S.DisplayTempWrapperTop>
                  </S.DisplayTempWrapper>
                </S.SectionTemperature>

                <S.SectionState isOff={isOff}>
                  <S.DisplayStateWrapper isOff={isOff}>
                    <S.DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-instantHeat-disabled.svg'
                          : '/images/logo-instantHeat.svg'
                      }
                    />
                    <S.DisplayIndicator
                      isActivated={instantHeat?.isActivated}
                      isReady={instantHeat.isReady}
                      isOff={isOff}
                    />
                  </S.DisplayStateWrapper>
                  <S.DisplayStateWrapper isOff={isOff}>
                    <S.DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-snowSensor-disabled.svg'
                          : '/images/logo-snowSensor.svg'
                      }
                    />
                    <S.DisplayIndicator
                      isActivated={snowSensor?.isActivated}
                      isReady={isReady}
                      isOff={isOff}
                    />
                  </S.DisplayStateWrapper>
                  <S.DisplayStateWrapper isOff={isOff}>
                    <S.DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-constantTemp-disabled.svg'
                          : '/images/logo-constantTemp.svg'
                      }
                    />
                    <S.DisplayIndicator
                      isActivated={optionalConstantTemp?.isActivated}
                      isReady={optionalConstantTemp?.isReady}
                      isOff={isOff}
                    />
                  </S.DisplayStateWrapper>
                  <S.DisplayStateWrapper isOff={isOff}>
                    <S.DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-schedule-disabled.svg'
                          : '/images/logo-schedule.svg'
                      }
                    />
                    <S.DisplayIndicator
                      isActivated={heatingSchedule?.isActivated}
                      isReady={heatingSchedule?.isReady}
                      isOff={isOff}
                    />
                  </S.DisplayStateWrapper>
                  <S.DisplayStateWrapper isOff={isOff}>
                    <S.DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-windFactor-disabled.svg'
                          : '/images/logo-windFactor.svg'
                      }
                    />
                    <S.DisplayIndicator
                      isReady={windFactor?.isReady}
                      isActivated={windFactor?.isActivated}
                      isOff={isOff}
                    />
                  </S.DisplayStateWrapper>
                </S.SectionState>

                <S.SectionInfo isOff={isOff}>
                  <S.InfoWrapperA isOff={isOff}>
                    <S.InfoTitle state={isGp} title={'gp'} isOff={isOff}>
                      gp
                    </S.InfoTitle>
                    <S.InfoImag
                      src={
                        isOff
                          ? '/images/battery-none.svg'
                          : isGp
                          ? '/images/gp-battery.svg'
                          : '/images/battery-none.svg'
                      }
                    />
                  </S.InfoWrapperA>
                  <S.InfoWrapperA isOff={isOff}>
                    <S.InfoTitle title={'ebp'} state={isEbp}>
                      ebp
                    </S.InfoTitle>
                    <S.InfoImag
                      src={
                        isOff
                          ? '/images/battery-none.svg'
                          : isEbp
                          ? '/images/ebp-battery.svg'
                          : '/images/battery-none.svg'
                      }
                    />
                  </S.InfoWrapperA>
                  <S.InfoWrapperB isOff={isOff}>
                    <S.InfoImag
                      src={
                        isOff
                          ? '/images/wifi-none.svg'
                          : isWifi
                          ? '/images/wifi-active.svg'
                          : '/images/wifi-none.svg'
                      }
                    />
                  </S.InfoWrapperB>
                  <S.InfoWrapperB isOff={isOff}>
                    <S.InfoImag
                      src={
                        isOff
                          ? '/images/fault-sm-disabled.svg'
                          : isFaults
                          ? '/images/fault-sm-active.svg'
                          : '/images/fault-sm.svg'
                      }
                    />
                  </S.InfoWrapperB>
                </S.SectionInfo>

                <S.SectionButton isOff={isOff}>
                  <S.ExpandButton isOff={isOff}>
                    <S.ExpandButtonHole isOff={isOff}>
                      <S.ExpandButtonTop
                        isOff={isOff}
                        onClick={handleExpand}
                      >
                        expand
                      </S.ExpandButtonTop>
                    </S.ExpandButtonHole>
                  </S.ExpandButton>
                </S.SectionButton>
              </S.SectionSub>
            </S.SectionMainContentClose>
          )}
          {controls.openMessageBox && (
            <S.MessageBoxWrapper>
              <InputTempMessage
                onClose={handleCloseMessage}
                messages={controls.message}
                title={controls.messageTitle}
                subtitle={'instant heat program'}
              />
            </S.MessageBoxWrapper>
          )}
        </S.Wrapper>
      )}
    </>
  );
};

export default MasterControlByMachine;
