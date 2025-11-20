import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleExpandSSRDetail } from '../store/slices/essSwitchSlice';

import {
  activeLayer180Deg,
  alignItemsFlexEnd,
  alignItemsFlexStart,
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADisabled,
  layerADisabled180Deg,
  layerB,
  layerBDark,
  layerBDisabled,
  layerC,
  layerCLighter,
  readyTop180Deg,
} from '../styles/commonStyles';
import styled, { css } from 'styled-components';

import SwitchWrapper from '../commonComponentsMC/SwitchWrapper';
import EssControlBox from './EssControlBox';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { convertCelsiusToFahrenheit } from '../../helpers/helpers';
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
import TurnOffMessageBox from '../commonComponentsMC/controllers/TurnOffMessageBox';
import { selectUserPermissions } from '../store/slices/userSlice';

const EssMasterControlByMachine = ({
  location,
  machine,
  isMobile,
  selectedProgramSrc,
  indivLocationName,
}) => {
  // Permissions and units
  const permissions = useSelector(selectUserPermissions);
  const disabled = !permissions.WRITE;
  const { isF } = useSelector(selectUnits);

  // Use shared hooks for switch data (replaces ~100 lines)
  const switchDataHook = useSwitchData(location, machine, 'ess', isMobile, isF);
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

  // Use shared hooks for program icons (replaces ~180 lines)
  const {
    selectedProgramSrc: selectedProgramByMachineSrc,
    activatedProgramSrc,
    readyProgramSrc,
  } = useProgramIcons(switchData, mobileSelectedProgram, 'ess');

  // Use shared hooks for controls (replaces ~150 lines)
  const controls = useSwitchControls('ess', location, machine, deviceMac, user_id, isF);

  // Local state for input temp
  const [inputTemp, setInputTemp] = useState('');

  // Keep existing hooks
  const { setTemp, currentTemp } = useSetAndCurrentTemp(switchData);
  useGetGraphQueries(location, machine, 'ESS');
  useGetSSRsQueries(location, machine, 'ESS');

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

  // Use shared hook for header hat (replaces ~40 lines)
  const hatImg = useHeaderHat(isOff, isFaults, headerTitle, isMobile);

  return (
    <>
      {isMobile ? (
        <Wrapper
          isExpanded={openMachineController}
          isMobile={true}
          isFaults={isFaults}
        >
          <SectionHeader isMobile={true}>
            <HeaderHat
              first={true}
              imgSrc={
                isOff
                  ? '/images/MC-machine-header2-mobile.svg'
                  : '/images/MC-machine-header2-mobile.svg'
              }
              isMobile={true}
            >
              <HeaderTitle
                onClick={() => handleHeaderButton('ate')}
                isMobile={true}
              >
                ate
              </HeaderTitle>
            </HeaderHat>
          </SectionHeader>

          <SectionMainContentClose
            isFaults={isFaults}
            isOff={isOff || disabled}
            isMobile={true}
            isExpanded={openMachineController}
          >
            <SectionMain isOff={isOff || disabled} isMobile={true}>
              <MainWrapperTop isOff={isOff || disabled}>
                <LeftWrapper>
                  <ShutOffButton
                    isMobile={true}
                    onClick={() => handleButtonClick('shutOff')}
                    isOff={isOff || disabled}
                  >
                    <Img
                      isShutOff={true}
                      src={
                        isOff || disabled ? '/images/turn-on.svg' : '/images/shut-off.svg'
                      }
                    />
                  </ShutOffButton>

                  <TitleAndConsumptionWrapper>
                    <MainTitleWrapper>
                      <MainTitle>{headerTitle}</MainTitle>
                    </MainTitleWrapper>

                    <SectionConsumption isOff={isOff || disabled} isMobile={true}>
                      <ConsumptionWrapper isOff={isOff || disabled} isMobile={true}>
                        <ConsumptionImgWrapper isMobile={true}>
                          <Img
                            energy={true}
                            src={
                              isOff
                                ? '/images/MC-energy-consumption-disabled.svg'
                                : '/images/MC-energy-consumption.svg'
                            }
                          />
                        </ConsumptionImgWrapper>

                        <ContentSpanWrapper>
                          <ConsumptionTitleS
                            isOff={isOff || disabled}
                            first={true}
                            isMobile={true}
                          >
                            {source} consumption
                          </ConsumptionTitleS>

                          <ConsumptionTitleWrapper isMobile={true}>
                            <ConsumptionTitleG isOff={isOff || disabled} isMobile={true}>
                              {energyConsumption}
                            </ConsumptionTitleG>
                            <ConsumptionUnit isOff={isOff || disabled} isMobile={true}>
                              {unit}
                            </ConsumptionUnit>
                          </ConsumptionTitleWrapper>
                        </ContentSpanWrapper>
                      </ConsumptionWrapper>
                    </SectionConsumption>
                  </TitleAndConsumptionWrapper>
                </LeftWrapper>

                <RightWrapper isOff={isOff || disabled}>
                  <RightTop isOff={isOff || disabled}>
                    <MobileButton
                      isOff={isOff || disabled}
                      noButton={true}
                      isActivated={activatedProgramSrc ? true : false}
                      isReady={readyProgramSrc ? true : false}
                    >
                      <MobileButtonHole
                        isOff={isOff || disabled}
                        isActivated={activatedProgramSrc ? true : false}
                      >
                        {activatedProgramSrc ? (
                          <Img src={activatedProgramSrc} />
                        ) : readyProgramSrc ? (
                          <Img src={readyProgramSrc} />
                        ) : selectedProgramByMachineSrc ? (
                          <Img src={selectedProgramByMachineSrc} />
                        ) : (
                          selectedProgramSrc && <Img src={selectedProgramSrc} />
                        )}
                      </MobileButtonHole>
                    </MobileButton>
                    <SectionMobileInfoDisplay>
                      <DisplayWrapper>
                        <DisplayInfo isLeft={true} isOff={isOff || disabled}>
                          <MobileImg
                            src={
                              isOff
                                ? '/images/fault-sm-disabled.svg'
                                : isFaults
                                ? '/images/fault-sm-active.svg'
                                : '/images/fault-sm.svg'
                            }
                          />
                        </DisplayInfo>
                        <DisplayInfo isOff={isOff}>
                          <MobileImg
                            src={
                              isOff
                                ? '/images/wifi-none.svg'
                                : isWifi
                                ? '/images/wifi-active.svg'
                                : '/images/wifi-none.svg'
                            }
                          />
                        </DisplayInfo>
                      </DisplayWrapper>

                      <DisplayWrapper>
                        <DisplayInfo
                          isSpaceBetween={true}
                          isLeft={true}
                          isOff={isOff}
                        >
                          <InfoTitle
                            state={isGp}
                            title={'gp'}
                            isOff={isOff}
                            isMobile={true}
                          >
                            gp
                          </InfoTitle>
                          <MobileImg
                            src={
                              isOff
                                ? '/images/battery-none.svg'
                                : isGp
                                ? '/images/gp-battery.svg'
                                : '/images/battery-none.svg'
                            }
                          />
                        </DisplayInfo>
                        <DisplayInfo isSpaceBetween={true} isOff={isOff}>
                          <InfoTitle
                            title={'ebp'}
                            state={isEbp}
                            isMobile={true}
                          >
                            ebp
                          </InfoTitle>
                          <MobileImg
                            src={
                              isOff
                                ? '/images/battery-none.svg'
                                : isEbp
                                ? '/images/ebp-battery.svg'
                                : '/images/battery-none.svg'
                            }
                          />
                        </DisplayInfo>
                      </DisplayWrapper>
                    </SectionMobileInfoDisplay>

                    <MobileButton
                      isOff={isOff}
                      isExpanded={openMachineController}
                      onClick={handleOpenMachineDetail}
                    >
                      <MobileButtonHole
                        isExpanded={openMachineController}
                        isOff={isOff}
                      >
                        <MobileButtonTop
                          isExpanded={openMachineController}
                          isOff={isOff}
                        >
                          <Img
                            expandIcon={true}
                            src={
                              isOff
                                ? '/images/MC-expand-disabled.svg'
                                : openMachineController
                                ? '/images/MC-expand-true.svg'
                                : '/images/MC-expand-false.svg'
                            }
                          />
                        </MobileButtonTop>
                      </MobileButtonHole>
                    </MobileButton>
                  </RightTop>
                </RightWrapper>
              </MainWrapperTop>
            </SectionMain>

            {openMachineController ? (
              <SectionMainContentExpand isMobile={true} isFaults={isFaults}>
                <EssControlBox
                  isMobile={true}
                  swtName={'ess'}
                  location={location}
                  machine={machine}
                  setTemp={setTemp}
                />
              </SectionMainContentExpand>
            ) : (
              <SectionSub isOff={isOff} isMobile={true}>
                <DisplayTempMobile isOff={isOff}>
                  set t. {setTemp ? setTemp : '---'}
                  {isF ? '°F' : '°C'}
                </DisplayTempMobile>

                <DisplayTempMobile isOff={isOff}>
                  cur. t. {isOff ? '---' : `${currentTemp}`}°C
                </DisplayTempMobile>
              </SectionSub>
            )}
          </SectionMainContentClose>
        </Wrapper>
      ) : (
        <Wrapper
          isExpanded={openMachineController}
        >
          {/* full screen */}

          <SectionHeader>
            {/* hover box when when the shut off button is turned off
            {isOff && showTurnOffMessageBox && (
              <TurnOffMessageBoxWrapper>
                <TurnOffMessageBox
                  title={headerTitle}
                  message={`maintenance in progress by: ${freezeByName}`}
                />
              </TurnOffMessageBoxWrapper>
            )} */}
            <SectionHeaderWrapper
              titleLength={headerTitle.length}
              right={true}
              isExpanded={true}
            >
              <HeaderHat
                titleLength={headerTitle.length}
                imgSrc={hatImg}
                first={true}
              >
                <HeaderTitle
                  onClick={() => handleHeaderButton('switch')}
                  isSwitch={true}
                >
                  {headerTitle}
                </HeaderTitle>
                {/* hover box when when the shut off button is turned off and to show location and specific location */}
                <HoverBox>
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
                </HoverBox>
              </HeaderHat>

              <HeaderHat
                second={true}
                imgSrc={'/images/MC-machine-header2.svg'}
              >
                <HeaderTitle onClick={() => handleHeaderButton('ate')}>
                  ate
                </HeaderTitle>
              </HeaderHat>
            </SectionHeaderWrapper>

            <SectionHeaderWrapper
              right={false}
              isExpanded={openMachineController}
            >
              <HeaderHat third={true} imgSrc={'/images/MC-machine-header3.svg'}>
                <HeaderButton
                  onClick={() => {
                    dispatch(
                      handleOpenMachineController({
                        location,

                        machine,
                        status: false,
                      })
                    );
                    dispatch(
                      handleExpandSSRDetail({
                        location,

                        machine,
                        status: false,
                      })
                    );
                    sessionStorage.removeItem('machineId');
                  }}
                >
                  <HeaderButtonOuter>
                    <HeaderButtonHole>
                      <HeaderButtonTop>close</HeaderButtonTop>
                    </HeaderButtonHole>
                  </HeaderButtonOuter>
                </HeaderButton>
              </HeaderHat>
            </SectionHeaderWrapper>
          </SectionHeader>

          {openMachineController ? (
            <SectionMainContentExpand isFaults={isFaults}>
              <SwitchWrapper
                swtName={'ess'}
                location={location}
                machine={machine}
                indivLocationName={indivLocationName}
              />
            </SectionMainContentExpand>
          ) : (
            <SectionMainContentClose isFaults={isFaults} isOff={isOff}>
              <SectionMain isOff={isOff}>
                <ShutOffButton
                  onClick={() => handleButtonClick('shutOff')}
                  isOff={isOff}
                >
                  <Img
                    isShutOff={true}
                    src={isOff ? '/images/turn-on.svg' : '/images/shut-off.svg'}
                  />
                </ShutOffButton>

                <InstantHeatWrapper
                  onSubmit={(e) => {
                    e.preventDefault();
                    isOff ||
                      isDisabled ||
                      handleInstantHeatBtn(e, 'switch control');
                  }}
                  isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                  style={{
                      pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                >
                  <InstantHeatInner
                    isActivated={isActivated}
                    isReady={isReadyInstantHeat}
                    isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                    style={{
                        pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
                        cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                               }}
                  >
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        isOff ||
                          isDisabled ||
                          handleInstantHeatBtn(e, 'switch control');
                      }}
                      isActivated={isActivated}
                      isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                                  style={{
                pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
                cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                      }}
                    >
                      <ButtonHole
                        isActivated={isActivated}
                        isReady={instantHeat.isReady}
                        isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                        style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                      >
                        <ButtonTop
                          isActivated={isActivated}
                          isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                          style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                        >
                          <Img
                            src={
                              isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)
                                ? '/images/logo-instantHeat-disabled.svg'
                                : '/images/logo-instantHeat.svg'
                            }
                          />
                        </ButtonTop>
                      </ButtonHole>
                    </Button>

                    <ControllerTitle isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}>
                      instant <br></br> heat
                    </ControllerTitle>

                    <TempInput
                      type='text'
                      placeholder={isF ? '0 °F' : '0 °C'}
                      value={inputTemp}
                      onChange={(e) =>
                        isOff || isDisabled || setInputTemp(e.target.value)
                      }
                      isActivated={isActivated}
                      isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                      style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                    />
                  </InstantHeatInner>
                </InstantHeatWrapper>

                <SnowSensorWrapper isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }} >
                  <SnowSensorInner
                    isActivated={snowSensor?.isActivated}
                    isReady={isReady}
                    isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                  >
                    <Button
                      onClick={() =>
                        isOff || isDisabled || handleButtonClick('snowSensor')
                      }
                      isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                      style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                    >
                      <ButtonHole isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                                    style={{
                  pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
                  cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                        }}
                      >
                        <ButtonTop isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}
                         style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}>
                          <Img
                            src={
                              isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)
                                ? '/images/logo-snowSensor-disabled.svg'
                                : '/images/logo-snowSensor.svg'
                            }
                          />
                        </ButtonTop>
                      </ButtonHole>
                    </Button>

                    <ControllerTitle isOff={isOff || isDisabled || disabled || (EBP_mode === 0 && isEbp)}>
                      snow <br></br> sensor
                    </ControllerTitle>
                  </SnowSensorInner>
                </SnowSensorWrapper>
              </SectionMain>

              <SectionSub isOff={isOff}>
                <SectionConsumption isOff={isOff}>
                  <ConsumptionWrapper isOff={isOff}>
                    <ConsumptionImgWrapper>
                      <Img
                        energy={true}
                        src={
                          isOff
                            ? '/images/MC-energy-consumption-disabled.svg'
                            : '/images/MC-energy-consumption.svg'
                        }
                      />
                    </ConsumptionImgWrapper>
                    <ConsumptionTitleS isOff={isOff} first={true}>
                      total {source}
                    </ConsumptionTitleS>
                    <ConsumptionTitleS isOff={isOff}>
                      consumption
                    </ConsumptionTitleS>

                    <ConsumptionTitleWrapper>
                      <ConsumptionTitleG isOff={isOff}>
                        {energyConsumption}
                      </ConsumptionTitleG>
                      <ConsumptionUnit isOff={isOff}>{unit}</ConsumptionUnit>
                    </ConsumptionTitleWrapper>
                  </ConsumptionWrapper>
                </SectionConsumption>

                <SectionTemperature isOff={isOff}>
                  <DisplayTempWrapper isOff={isOff}>
                    <DisplayTempWrapperTop isOff={isOff}>
                      set temp. {setTemp ? setTemp : '---'}
                      {isF ? '°F' : '°C'}
                    </DisplayTempWrapperTop>
                  </DisplayTempWrapper>
                  <DisplayTempWrapper isOff={isOff}>
                    <DisplayTempWrapperTop isOff={isOff}>
                      cur. temp.{' '}
                      {isOff ? '---' : currentTemp ? `${currentTemp}` : '---'}°C
                    </DisplayTempWrapperTop>
                  </DisplayTempWrapper>
                </SectionTemperature>

                <SectionState isOff={isOff}>
                  <DisplayStateWrapper isOff={isOff}>
                    <DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-instantHeat-disabled.svg'
                          : '/images/logo-instantHeat.svg'
                      }
                    />
                    <DisplayIndicator
                      isActivated={instantHeat?.isActivated}
                      isReady={instantHeat.isReady}
                      isOff={isOff}
                    />
                  </DisplayStateWrapper>
                  <DisplayStateWrapper isOff={isOff}>
                    <DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-snowSensor-disabled.svg'
                          : '/images/logo-snowSensor.svg'
                      }
                    />
                    <DisplayIndicator
                      isActivated={snowSensor?.isActivated}
                      isReady={isReady}
                      isOff={isOff}
                    />
                  </DisplayStateWrapper>
                  <DisplayStateWrapper isOff={isOff}>
                    <DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-constantTemp-disabled.svg'
                          : '/images/logo-constantTemp.svg'
                      }
                    />
                    <DisplayIndicator
                      isActivated={optionalConstantTemp?.isActivated}
                      isReady={optionalConstantTemp?.isReady}
                      isOff={isOff}
                    />
                  </DisplayStateWrapper>
                  <DisplayStateWrapper isOff={isOff}>
                    <DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-schedule-disabled.svg'
                          : '/images/logo-schedule.svg'
                      }
                    />
                    <DisplayIndicator
                      isActivated={heatingSchedule?.isActivated}
                      isReady={heatingSchedule?.isReady}
                      isOff={isOff}
                    />
                  </DisplayStateWrapper>
                  <DisplayStateWrapper isOff={isOff}>
                    <DisplayLogoImg
                      src={
                        isOff
                          ? '/images/logo-windFactor-disabled.svg'
                          : '/images/logo-windFactor.svg'
                      }
                    />
                    <DisplayIndicator
                      isReady={windFactor?.isReady}
                      isActivated={windFactor?.isActivated}
                      isOff={isOff}
                    />
                  </DisplayStateWrapper>
                </SectionState>

                <SectionInfo isOff={isOff}>
                  <InfoWrapperA isOff={isOff}>
                    <InfoTitle state={isGp} title={'gp'} isOff={isOff}>
                      gp
                    </InfoTitle>
                    <InfoImag
                      src={
                        isOff
                          ? '/images/battery-none.svg'
                          : isGp
                          ? '/images/gp-battery.svg'
                          : '/images/battery-none.svg'
                      }
                    />
                  </InfoWrapperA>
                  <InfoWrapperA isOff={isOff}>
                    <InfoTitle title={'ebp'} state={isEbp}>
                      ebp
                    </InfoTitle>
                    <InfoImag
                      src={
                        isOff
                          ? '/images/battery-none.svg'
                          : isEbp
                          ? '/images/ebp-battery.svg'
                          : '/images/battery-none.svg'
                      }
                    />
                  </InfoWrapperA>
                  <InfoWrapperB isOff={isOff}>
                    <InfoImag
                      src={
                        isOff
                          ? '/images/wifi-none.svg'
                          : isWifi
                          ? '/images/wifi-active.svg'
                          : '/images/wifi-none.svg'
                      }
                    />
                  </InfoWrapperB>
                  <InfoWrapperB isOff={isOff}>
                    <InfoImag
                      src={
                        isOff
                          ? '/images/fault-sm-disabled.svg'
                          : isFaults
                          ? '/images/fault-sm-active.svg'
                          : '/images/fault-sm.svg'
                      }
                    />
                  </InfoWrapperB>
                </SectionInfo>

                <SectionButton isOff={isOff}>
                  <ExpandButton isOff={isOff}>
                    <ExpandButtonHole isOff={isOff}>
                      <ExpandButtonTop
                        isOff={isOff}
                        onClick={() => {
                          isOff ||
                            dispatch(
                              handleOpenMachineController({
                                location,
                                machine,
                                status: true,
                              })
                            );
                          sessionStorage.setItem('machineId', machine);
                        }}
                      >
                        expand
                      </ExpandButtonTop>
                    </ExpandButtonHole>
                  </ExpandButton>
                </SectionButton>
              </SectionSub>
            </SectionMainContentClose>
          )}
          {controls.openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={handleCloseMessage}
                messages={controls.message}
                title={controls.messageTitle}
                subtitle={'instant heat program'}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default EssMasterControlByMachine;
// for Mobile only
const MainWrapperTop = styled.div`
  width: 301px;
  height: 50px;
  border-radius: 30px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `};
`;

const LeftWrapper = styled.div`
  width: 60%;
  height: 100%;
  ${justifyContentSpaceBetween};
`;
const TitleAndConsumptionWrapper = styled.div`
  height: 100%;
  ${flexDirectionColumn};
  /* padding: 6px 0 1.55px 0; */
`;

const MainTitleWrapper = styled.div`
  width: 126px;
  height: 50%;
  ${flexBoxCenter}
  ${alignItemsFlexEnd}
`;

const MainTitle = styled.span`
  font-size: 8px;
  overflow: hidden;
`;
const RightWrapper = styled.div`
  width: 126px;
  height: 46px;
  border-radius: 0px 26px 26px 0px;
  ${layerA}
  ${justifyContentFlexEnd}
  padding-right: 1px;

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset -1px 0px 2px #000000;
    `}
`;

const RightTop = styled.div`
  width: 122px;
  height: 44px;
  border-radius: 22px;
  ${layerC};
  ${justifyContentSpaceBetween};
  padding: 0 1px;

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
    `}
`;
const MobileButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.noButton &&
    css`
      cursor: default;
    `};

  ${(p) =>
    p.isExpanded &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isActivated &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `}
`;
const MobileButtonHole = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      background: #233a54;
      box-shadow: inset 0px 0px 3px #000000;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
    `}

    ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 3px #000000;
    `};
`;
const MobileButtonTop = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
  ${(p) => p.ready && css``}
  ${(p) => p.activated && css``}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg};
    `};
`;

const SectionMobileInfoDisplay = styled.section`
  ${flexDirectionColumn};
`;
const DisplayWrapper = styled.div`
  ${justifyContentSpaceBetween};
  flex-direction: column;
`;
const DisplayInfo = styled.div`
  width: 29px;
  height: 8px;

  /* ${(p) =>
    p.isLeft &&
    css`
      width: 23px;
    `}; */
  border-radius: 8px;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isSpaceBetween &&
    css`
      ${justifyContentSpaceBetween};
      padding: 0 1px;
    `}

  ${(p) =>
    p.isOff &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 2px #000000;
    `};
`;

const MobileImg = styled.img`
  height: 80%;
`;

const DisplayTempMobile = styled.div`
  width: 104px;
  height: 14px;
  border-radius: 7px;
  ${layerC};
  ${flexBoxCenter};
  font-size: 10px;

  ${(p) =>
    p.isOff &&
    css`
      background: #393939;
      box-shadow: inset 0px 0px 6px #000000;
      color: #808080;
    `}
`;

// --for Desktop

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 311px;
          height: 108px;
          ${p.isFaults &&
          css`
            border: 1px solid red;
          `}
        `
      : css`
          width: 1205px;
          height: 108px;
          position: relative;
        `}

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
    `}
`;

const SectionHeader = styled.section`
  width: 100%;
  padding-left: 42px;
  display: flex;
  justify-content: space-between;
  position: relative;

  ${(p) =>
    p.isMobile &&
    css`
      ${justifyContentFlexEnd}
      padding-right: 50px;
    `}
`;

const SectionHeaderWrapper = styled.div`
  width: 50%;
  display: flex;

  ${(p) =>
    p.right
      ? css`
          /* !!!!!set width depending on the hat size */
          ${({ titleLength }) =>
            titleLength < 28
              ? css`
                  width: 488px;
                `
              : titleLength < 46
              ? css`
                  width: 920px;
                `
              : css`
                  width: 1000px;
                `}

          justify-content: space-between;
        `
      : css`
          justify-content: flex-end;
          position: relative;
        `};

  ${(p) =>
    p.isExpanded ||
    css`
      visibility: hidden;
    `}
`;

const HeaderHat = styled.div`
  background: url(${(p) => p.imgSrc}) no-repeat;
  /* url(/images/MC-machine-header-long-size.svg) no-repeat */
  display: flex;
  align-items: center;
  ${(p) =>
    p.isMobile
      ? css`
          height: 20px;
          width: 52px;
          padding-left: 6px;
        `
      : css`
          height: 31px;
          ${(p) =>
            p.first
              ? css`
                  &:hover ${HoverBox} {
                    display: inline;
                  }

                  /* !!!!!set width depending on the hat size */
                  ${({ titleLength }) =>
                    titleLength < 28
                      ? css`
                          width: 388px;
                        `
                      : titleLength < 46
                      ? css`
                          width: 610px;
                        `
                      : css`
                          width: 900px;
                        `}

                  padding-left: 4px;
                `
              : p.second
              ? css`
                  width: 96px;
                  justify-content: center;
                  padding-right: 14px;
                `
              : css`
                  width: 122px;
                  justify-content: center;
                  padding-left: 20px;
                `};
        `}
`;

const HoverBox = styled.div`
  width: auto;
  height: auto;
  position: absolute;

  ${flexBoxCenter}

  bottom:32px;
  left: 0;
  z-index: 100;

  display: none;
`;

const HeaderTitle = styled.span`
  margin-left: ${({ isMobile }) => !isMobile && '8px'};
  font-size: ${(p) => (p.isMobile ? '10px' : '14px')};
  letter-spacing: ${(p) => (p.isMobile ? '1.0px' : '1.4px')};
  color: ${({ isSwitch }) => (isSwitch ? '#fcff01' : '#fff')};

  overflow: hidden;
  cursor: pointer;
`;

const HeaderButton = styled.button`
  width: 88px;
  height: 25px;
  border-radius: 18px;
  ${layerB}
  ${flexBoxCenter}
`;
const HeaderButtonOuter = styled.div`
  width: 86px;
  height: 23px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;
const HeaderButtonHole = styled.div`
  width: 78px;
  height: 15px;
  border-radius: 18px;

  ${layerB}
  ${flexBoxCenter}
`;
const HeaderButtonTop = styled.div`
  width: 76px;
  height: 13px;
  border-radius: 25px;

  ${layerA180Deg}
  font-size: 7px;
  ${flexBoxCenter}
`;

const SectionMainContentClose = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 311px;
          height: 88px;
          border-radius: 30px;
          ${layerA180Deg};
          ${flexDirectionColumn};
          padding: 4px 0;
          ${p.isExpanded &&
          css`
            height: auto;
          `}
        `
      : css`
          width: 1205px;
          height: 77px;

          background: transparent
            linear-gradient(180deg, #1f344c 0%, #060d19 100%);
          border: 1px solid #000000;
          border-radius: 39px;

          ${justifyContentSpaceBetween}
          padding: 0 10px;
        `}

  ${(p) =>
    p.isOff &&
    css`
      background: transparent linear-gradient(180deg, #505050 0%, #1d1d1d 100%);
      border: 1px solid #000000;
    `}
  ${(p) =>
    p.isFaults &&
    css`
      border: 1px solid red;
    `}

    position:relative;
`;

const SectionMain = styled.section`
  ${(p) =>
    p.isMobile
      ? css`
          width: 303px;
          height: 52px;
          border-radius: 30px;
          ${layerA}
          ${flexBoxCenter}
        `
      : css`
          width: 310px;
          height: 59px;
          border-radius: 30px;
          ${layerBDark}
          padding: 0 2px;
          margin-right: 10px;
          ${justifyContentSpaceBetween};
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled};
    `}
`;

const SectionSub = styled.section`
  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isMobile
      ? css`
          width: 220px;
          height: 23px;
          border-radius: 13px;
          ${layerA};
          padding: 0 4px;
        `
      : css`
          width: 868px;
          height: 59px;
          border-radius: 30px;
          ${layerA};
          padding: 0 10px 0 2px;
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

const ShutOffButton = styled.button`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 44px;
      height: 44px;
      margin-left: 1px;
    `} /* ${({ isOff }) =>
    isOff &&
    css`
      :hover {
      }
    `} */
`;

const InstantHeatWrapper = styled.form`
  width: 148px;
  height: 55px;
  border-radius: 28px;

  ${layerC}
  ${flexBoxCenter}
  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const InstantHeatInner = styled.div`
  width: 146px;
  height: 53px;
  border-radius: 27px;

  ${justifyContentSpaceBetween}
  ${layerA180Deg}
  padding: 0 5px;

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg}/* background: transparent
            linear-gradient(180deg, #4baf00 0%, #124000 100%);
          box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
          border: 0.5px solid #000000; */
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `};

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `};
`;

const Button = styled.button`
  border-radius: 50%;
  ${flexBoxCenter}

  width: 44px;
  height: 44px;

  ${layerA}

  ${(p) => p.isReady && css``}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}

    ${(p) =>
    p.isOff &&
    css`
      cursor: not-allowed;
      ${layerBDisabled}
    `}
`;

const ButtonHole = styled.div`
  border-radius: 50%;
  ${flexBoxCenter}

  width: 42px;
  height: 42px;

  ${layerA180Deg}
  ${(p) => p.isReady && css``}

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg}/* background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000; */
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `}

    ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const ButtonTop = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;

  ${layerA}
  ${flexBoxCenter}
  ${(p) => p.isReady && css``}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
    `}

    

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;
const Img = styled.img`
  width: 100%;

  ${(p) =>
    p.isShutOff &&
    css`
      width: 110%;
    `}

  ${(p) =>
    p.energy &&
    css`
      height: 100%;
    `}

    ${(p) =>
    p.expandIcon &&
    css`
      height: 62%;
    `}
`;

const ControllerTitle = styled.span`
  font-size: 8px;
  letter-spacing: 0.5px;
  text-align: center;

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;

const TempInput = styled.input`
  width: 44px;
  height: 44px;
  border-radius: 24px;

  ${layerA}

  font-size: 8px;

  &::placeholder {
    color: #fff;
    ${(p) =>
      p.isOff &&
      css`
        color: #808080;
      `}
  }

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
      border: 0.5px solid #124000;
    `}

  ${flexBoxCenter}
  border-radius: 50%;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
      color: #808080;
    `}
`;

const SnowSensorWrapper = styled.div`
  width: 98px;
  height: 55px;
  border-radius: 28px;

  ${layerC}
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled}
    `}
`;

const SnowSensorInner = styled.div`
  width: 96px;
  height: 53px;
  border-radius: 27px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween} 

  padding: 0 3px 0 5px;

  ${(p) =>
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg}
    `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const SectionConsumption = styled.section`
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile
      ? css`
          width: 128px;
          height: 20px;
          border-radius: 15px 0 0 15px;
          ${layerA};
          justify-content: flex-end;
          padding: 2px 0;
          margin-bottom: 1px;
        `
      : css`
          width: 94px;
          height: 56px;
          border-radius: 28px 12px 12px 28px;
          ${layerC};
        `}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

const ConsumptionWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 126px;
          height: 18px;
          border-radius: 19px 4px 4px 19px;
          ${layerC};
          ${justifyContentSpaceBetween};
          padding: 0 6px 0 2px;
          ${(p) =>
            p.isOff &&
            css`
              background: #3b3b3b;
              box-shadow: inset 0px 0.5px 3px #000000;
            `}
        `
      : css`
          width: 80%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 3px;
          padding-top: 14px;

          position: relative;
        `}
`;

const ConsumptionImgWrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 17px;
          height: 14px;
        `
      : css`
          width: 100%;
          height: 28px;
          position: absolute;
          top: 0;
          left: 20px;
        `}
`;
const ContentSpanWrapper = styled.div`
  height: 90%;
  width: 98px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-direction: column;
`;
const ConsumptionTitleS = styled.span`
  color: #fcff01;
  ${(p) =>
    p.isMobile
      ? css`
          font-size: 7px;
          /* letter-spacing: 0.4px; */
          line-height: 90%;
        `
      : css`
          font-size: 8px;
          letter-spacing: 0.4px;

          ${(p) =>
            p.first &&
            css`
              margin-top: -9px;
              margin-bottom: -2px;
            `}
        `}

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;
const ConsumptionTitleG = styled.span`
  color: #fcff01;
  margin-right: 4px;

  ${(p) =>
    p.isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;

const ConsumptionUnit = styled.span`
  text-transform: capitalize;
  color: #fcff01;
  font-size: 12px;
  letter-spacing: 1.2px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 8px;
      letter-spacing: 1px;
    `};

  ${(p) =>
    p.isOff &&
    css`
      color: #808080;
    `}
`;

const ConsumptionTitleWrapper = styled.div`
  ${justifyContentFlexStart}
  margin-top: -2px;
`;

const SectionTemperature = styled.section`
  width: 208px;
  height: 56px;
  border-radius: 12px;

  ${layerC}

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;
const DisplayTempWrapper = styled.div`
  width: 202px;
  height: 24px;
  border-radius: 14px;

  background: transparent linear-gradient(180deg, #ffd500 0%, #6a4e00 100%);
  box-shadow: inset 0px 1px 2px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;

  ${flexBoxCenter}
  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
    `}
`;
const DisplayTempWrapperTop = styled.div`
  ${flexBoxCenter}
  font-size: 14px;

  width: 195px;
  height: 18px;

  background: #d9b600;
  box-shadow: inset 0px 0.5px 2px #000000;
  border-radius: 12px;
  color: #1b2b44;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
      color: #565656;
    `}
`;

const SectionState = styled.section`
  width: 208px;
  height: 56px;
  border-radius: 14px;
  ${layerC}

  ${justifyContentSpaceAround}
  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

const DisplayStateWrapper = styled.div`
  width: 25px;
  height: 49px;
  border-radius: 13px;

  ${layerB}
  ${flexDirectionColumn}

  padding-bottom: 5px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;
const DisplayLogoImg = styled.img`
  width: 90%;
`;

const DisplayIndicator = styled.div`
  border-radius: 50%;

  width: 12px;
  height: 12px;

  background: #565656;

  ${(p) =>
    p.isReady &&
    css`
      background-color: #82ffff;
    `}
  ${(p) =>
    p.isActivated &&
    css`
      background: #95ff45;
    `}
  ${(p) =>
    p.isOff &&
    css`
      background: #565656;
    `}
`;

const SectionInfo = styled.section`
  width: 208px;
  height: 28px;
  border-radius: 18px;
  ${layerC}

  ${justifyContentSpaceAround}

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;

const InfoWrapperA = styled.div`
  width: 49px;
  height: 12px;
  border-radius: 7px;
  ${layerA}

  ${justifyContentSpaceBetween}
  padding: 0 4px;

  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;
const InfoWrapperB = styled.div`
  width: 27px;
  height: 15px;
  border-radius: 7px;

  ${layerA}
  ${flexBoxCenter}
  ${(p) =>
    p.isOff &&
    css`
      ${layerBDisabled}
    `}
`;
const InfoImag = styled.img`
  height: 60%;
`;
const InfoTitle = styled.span`
  font-size: 10px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 7px;
    `};

  ${(p) =>
    p.isOff
      ? css`
          color: #808080;
        `
      : p.title === 'gp'
      ? css`
          color: #95ff45;
        `
      : css`
          color: #ff7800;
        `}

  ${(p) =>
    p.state ||
    css`
      color: #808080;
    `}
`;

const SectionButton = styled.section`
  width: 73px;
  height: 28px;
  border-radius: 18px;
  border-radius: 18px;

  ${layerB}
  ${flexBoxCenter}

  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled}
    `}
`;

const ExpandButton = styled.button`
  width: 71px;
  height: 26px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isOff &&
    css`
      cursor: not-allowed;
      ${layerADisabled180Deg}
    `}
`;
const ExpandButtonHole = styled.div`
  width: 63px;
  height: 18px;
  border-radius: 18px;
  ${layerB}
  ${flexBoxCenter}
  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled}
    `}
`;
const ExpandButtonTop = styled.div`
  width: 61px;
  height: 16px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 8px;
  ${(p) =>
    p.isOff &&
    css`
      ${layerADisabled180Deg}
      color: #808080;
    `}
`;

const SectionMainContentExpand = styled.div`
  width: 1205px;
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      margin-top: 6px;
    `}
`;

const MessageBoxWrapper = styled.div`
  width: 34%;
  height: 190px;
  position: absolute;

  ${flexBoxCenter}

  top: 0;
  left: 0;
  z-index: 100;
`;

const TurnOffMessageBoxWrapper = styled.div`
  width: auto;
  height: auto;
  position: absolute;

  ${flexBoxCenter}

  bottom:32px;
  left: 0;
  z-index: 100;
`;
