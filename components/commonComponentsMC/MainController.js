import { useEffect, useState, memo } from 'react';
import { useUnitsStore } from '../zustand-stores';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA180DegLighter,
  layerADark,
  layerC,
} from '../styles/commonStyles';
import FaultsReport from '../userMessages/FaultsReport';
import DisplayControllers from './DisplayControllers';
import DisplaySum from './DisplaySum';
import InstantHeatMC from './InstantHeatMC';
import SnowSensorMC from './SnowSensorMC';
import WeatherBox from './WeatherBox';
import { useMemo } from 'react';
import { calculateTotalEnergyConsumption } from '../../helpers/helpers';
import testData from '../../test_data/testData';
import { tabsSrc } from '../../constants';

const MainController = ({
  swtName,
  location,
  specificLocation,
  isSpecificLocation,
  openMiniMC,
  numSpecLocations,
  locationName,
  isExpanded,
  handleExpand,
  buttonHandler,
  machineNumber,
  locationAddress,
  visibility,
  disabled,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const tesSrc = isExpanded ? tabsSrc.tes.activeSrc : tabsSrc.tes.src;
  // const tesSrc = isExpanded
  //   ? '/images/sidebar-tes-active.svg'
  //   : '/images/sidebar-tes.svg';

  const essSrc = isExpanded ? tabsSrc.ess.activeSrc : tabsSrc.ess.src;
  // const essSrc = isExpanded
  //   ? '/images/sidebar-ess-active.svg'
  //   : '/images/sidebar-ess.svg';

  const tgsSrc = isExpanded ? tabsSrc.tgs.activeSrc : tabsSrc.tgs.src;
  // const tgsSrc = isExpanded
  //   ? '/images/sidebar-tgs-active.svg'
  //   : '/images/sidebar-tgs.svg';

  const logoSrc =
    swtName === 'ess' ? essSrc : swtName === 'tgs' ? tgsSrc : tesSrc;

  // Global states
  const {
    flatEssSwitch,
    essSwitch,
    flatTgsSwitch,
    tgsSwitch,
    flatTesSwitch,
    tesSwitch,
  } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );
  const switchStatusE =
    swtName === 'ess' ? essSwitch : swtName === 'tgs' ? tgsSwitch : tesSwitch;

  const switchStatus =
    swtName === 'ess'
      ? flatEssSwitch
      : swtName === 'tgs'
      ? flatTgsSwitch
      : flatTesSwitch;

  // !!TEST DATA
  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  //   testTesSwitch,
  // } = testData(essSwitch, tgsSwitch, null, tesSwitch);

  // let switchStatus;
  // if (specificLocation) {
  //   switchStatus =
  //     swtName === 'ess'
  //       ? testEssSwitch
  //       : swtName === 'tgs'
  //       ? testTgsSwitch
  //       : testTesSwitch;
  // } else {
  //   switchStatus =
  //     swtName === 'ess' ? essSwitch : swtName === 'tgs' ? tgsSwitch : tesSwitch;
  // }

  // !!END OF TEST DATA

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Object.keys(switchStatusE[location]?.subLocations).forEach((subLocation) => {
  //   Object.keys(switchStatusE[location].subLocations[subLocation].devices).forEach((machine) => {
  //     console.log(switchStatus[subLocation][machine].reading,"energyConsumption")
  //   });
  // })

  const energyConsumption = useMemo(() => {
    let total = 0;
    if (
      switchStatusE[location] &&
      switchStatusE[location]?.isSpecificLocation
    ) {
      Object.keys(switchStatusE[location]?.subLocations).forEach(
        (subLocation) => {
          Object.keys(
            switchStatusE[location].subLocations[subLocation].devices
          ).forEach((machine) => {
            total +=
              +calculateTotalEnergyConsumption(
                switchStatus[subLocation][machine].reading,
                swtName,
                isF
              ) || 0;
          });
        }
      );
    } else {
      Object.keys(switchStatus[location]).forEach((machine) => {
        total +=
          +calculateTotalEnergyConsumption(
            switchStatus[location][machine].reading,
            swtName,
            isF
          ) || 0;
      });
    }

    return total === 0 ? '--' : total;
  }, [location, swtName, isF]);
  const tgsUnit = isF ? 'FT³' : 'M³';
  const unit = swtName === 'tgs' ? tgsUnit : 'Kw';
  const source = swtName !== 'tgs' ? 'energy' : 'gas';

  // **** temporary value
  // Local values
  const [faults, setFaults] = useState(false);
  const [displayWeatherBox, setDisplayWeatherBox] = useState(false);
  const initialState = {
    instantHeat: { isReady: null, isActivated: null },
    snowSensor: { isReady: null, isActivated: null },
    windFactor: { isReady: null, isActivated: null },
    heatingSchedule: { isReady: null, isActivated: null },
    constantTemp: { isReady: null, isActivated: null },
    fanOnly: null,
  };
  // states for number of activated instant heat, number of ready snow sensor....
  const [states, setStates] = useState(initialState);
  const [displayFaultsMessage, setDisplayFaultsMessage] = useState(false);
  const [activatedWifiNumber, setActivatedWifiNumber] = useState(false);
  // const [numOfMachines, setNumOfMachines] = useState(0);

  const faultSrc = faults ? tabsSrc.faults.redSrc : tabsSrc.faults.src;
  // const faultSrc = faults
  //   ? '/images/sidebar-faults-faults.svg'
  //   : '/images/sidebar-faults.svg';

  const filterDataHandler = (program) => {
    let filterData = [];
    let devices = [];
    if (switchStatusE[location]?.isSpecificLocation) {
      Object.keys(switchStatusE[location]?.subLocations).forEach(
        (subLocation) => {
          Object.keys(switchStatus[subLocation]).forEach((machine) => {
            devices.push({ locationId: subLocation, machineId: machine });
          });
        }
      );
    } else {
      devices = Object.keys(switchStatus[location]).map((machine) => ({
        locationId: location,
        machineId: machine,
      }));
    }
    if (devices.length > 0) {
      filterData = devices.filter((machine) => {
        switch (program) {
          case 'instantHeatActive':
            return (
              switchStatus[machine.locationId][machine.machineId].instantHeat
                .isActivated === true
            );
          case 'instantHeatReady':
            return (
              switchStatus[machine.locationId][machine.machineId].instantHeat
                .isReady === true &&
              switchStatus[machine.locationId][machine.machineId].instantHeat
                .isActivated === false
            );
          case 'snowSensorActive':
            return (
              switchStatus[machine.locationId][machine.machineId].snowSensor
                .isActivated === true
            );
          case 'snowSensorReady':
            return (
              switchStatus[machine.locationId][machine.machineId].snowSensor
                .isReady === true &&
              switchStatus[machine.locationId][machine.machineId].snowSensor
                .isActivated === false
            );
          case 'constantTempActive':
            return (
              switchStatus[machine.locationId][machine.machineId]
                .optionalConstantTemp.isActivated === true
            );
          case 'constantTempReady':
            return (
              switchStatus[machine.locationId][machine.machineId]
                .optionalConstantTemp.isReady === true &&
              switchStatus[machine.locationId][machine.machineId]
                .optionalConstantTemp.isActivated === false
            );
          case 'heatingScheduleActive':
            return (
              switchStatus[machine.locationId][machine.machineId]
                .heatingSchedule.isActivated === true
            );
          case 'heatingScheduleReady':
            return (
              switchStatus[machine.locationId][machine.machineId]
                .heatingSchedule.isReady === true &&
              switchStatus[machine.locationId][machine.machineId]
                .heatingSchedule.isActivated === false
            );
          case 'windFactorActive':
            return (
              switchStatus[machine.locationId][machine.machineId].windFactor
                .isActivated === true
            );
          case 'windFactorReady':
            return (
              switchStatus[machine.locationId][machine.machineId].windFactor
                .isReady === true &&
              switchStatus[machine.locationId][machine.machineId].windFactor
                .isActivated === false
            );
          case 'fanOnly':
            return (
              switchStatus[machine.locationId][machine.machineId].fanOnly ===
              true
            );
          case 'systemOff':
            return (
              switchStatus[machine.locationId][machine.machineId].isOff === true
            );
          case 'systemFault':
            return (
              switchStatus[machine.locationId][machine.machineId].isFaults ===
              true
            );
          default:
            return [];
        }
      });
    }

    return filterData;
  };

  // const numOfSwt = switchStatusE[location].isSpecificLocation
  //   ? Object.keys(switchStatusE[location].subLocations)
  //       .map((subLocation) => {
  //         return Object.keys(
  //           switchStatusE[location].subLocations[subLocation].devices
  //         ).length;
  //       })
  //       .reduce((sum, num) => sum + num, 0)
  //   : Object.keys(switchStatusE[location].devices)?.length;

  // console.log('switchStatusE[location]:', switchStatusE[location]);
  // console.log('switchStatusE:', switchStatusE);
  // console.log('location:', location);

  // console.log(':',);
  // const calculateNumOfMachines = () => {
  //   if (specificLocation) {
  //     // grabbing data from sub location
  //     if (switchStatusE[location]?.isSpecificLocation) {
  //       return Object.keys(
  //         switchStatusE[location].subLocations[specificLocation].devices
  //       ).reduce((acc, machine) => machine && acc + 1, 0);
  //     }
  //   } else {
  //     // grabbing data from location that has a sub locations
  //     if (switchStatusE[location]?.isSpecificLocation) {
  //       return Object.keys(switchStatusE[location].subLocations)
  //         .map((subLocation) => {
  //           return Object.keys(
  //             switchStatusE[location].subLocations[subLocation].devices
  //           ).length;
  //         })
  //         .reduce((sum, num) => sum + num, 0);
  //     } else {
  //       // grabbing data from location that has no sub locations
  //       return Object.keys(switchStatusE[location].devices)?.length;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const result = calculateNumOfMachines();
  //   setNumOfMachines(result);
  // }, []);

  useEffect(() => {
    const copyStates = { ...states };

    // instantHeat
    const activatedInstantHeat = filterDataHandler('instantHeatActive');
    copyStates.instantHeat.isActivated = activatedInstantHeat.length;

    const readyInstantHeat = filterDataHandler('instantHeatReady');
    copyStates.instantHeat.isReady = readyInstantHeat.length;

    // snow sensor
    const activatedSnowSensor = filterDataHandler('snowSensorActive');
    copyStates.snowSensor.isActivated = activatedSnowSensor.length;

    const readySnowSensor = filterDataHandler('snowSensorReady');
    copyStates.snowSensor.isReady = readySnowSensor.length;

    // constant temp
    const activatedConstantTemp = filterDataHandler('constantTempActive');
    copyStates.constantTemp.isActivated = activatedConstantTemp.length;

    const readyConstantTemp = filterDataHandler('constantTempReady');
    copyStates.constantTemp.isReady = readyConstantTemp.length;

    // heatingSchedule
    const activatedHeatingSchedule = filterDataHandler('heatingScheduleActive');
    copyStates.heatingSchedule.isActivated = activatedHeatingSchedule.length;

    const readyHeatingSchedule = filterDataHandler('heatingScheduleReady');
    copyStates.heatingSchedule.isReady = readyHeatingSchedule.length;

    // windFactor
    const activatedWindFactor = filterDataHandler('windFactorActive');
    copyStates.windFactor.isActivated = activatedWindFactor.length;

    const readyWindFactor = filterDataHandler('windFactorReady');
    copyStates.windFactor.isReady = readyWindFactor.length;

    // fan Only
    if (swtName === 'tgs') {
      const activatedFanOnly = filterDataHandler('fanOnly');
      copyStates.fanOnly = activatedFanOnly.length;
    }

    // system off
    const systemOff = filterDataHandler('systemOff');
    copyStates.systemOff = systemOff.length;

    // system fault
    const systemFaults = filterDataHandler('systemFault');
    copyStates.systemFaults = systemFaults.length;

    setStates(copyStates);
  }, [flatEssSwitch, flatTgsSwitch, flatTesSwitch]);

  const subLocationsIDs = switchStatusE[location]?.isSpecificLocation
    ? Object.keys(switchStatusE[location].subLocations)
    : [];
  useEffect(() => {
    // check faults
    if (location) {
      let isFaults = false;

      if (switchStatusE[location]?.isSpecificLocation) {
        // For locations with sub-locations
        isFaults = Object.keys(switchStatusE[location].subLocations).some(
          (subLocation) =>
            Object.keys(
              switchStatusE[location].subLocations[subLocation].devices
            ).some((machine) => switchStatus[subLocation][machine].isFaults)
        );
      } else {
        // For locations without sub-locations
        isFaults = Object.keys(switchStatus[location] || {}).some(
          (machine) => switchStatus[location][machine].isFaults
        );
      }

      setFaults(isFaults);

      // check wifi
      if (isMobile) {
        let wifiNumber = 0;
        Object.keys(switchStatusE[location]).forEach((machine) => {
          if (switchStatusE[location][machine].isWifi) {
            wifiNumber = wifiNumber + 1;
          }
        });
        // Object.keys(switchStatus[location]).forEach((machine) => {
        //   if (switchStatus[location][machine].isWifi) {
        //     wifiNumber = wifiNumber + 1;
        //   }
        // });

        setActivatedWifiNumber(wifiNumber);
      }
    }
  }, [location, switchStatus, switchStatusE, isMobile]);

  // ******* To BACK END *******
  // 1. activated machine number
  // 2. ready machine number
  // 3. off machine number
  // 4. machine with faults number
  // ******* To BACK END *******

  const handleDisplayWeatherBox = () => {
    setDisplayWeatherBox(!displayWeatherBox);
  };

  return (
    <>
      {isMobile ? (
        <>
          <SectionMobileTop>
            <SwitchIconWrapper onClick={handleExpand} isMobile={isMobile}>
              <Img src={logoSrc} isMobile={isMobile} />
            </SwitchIconWrapper>

            <SectionLocationInfo>
              <LocationNumber>{machineNumber}</LocationNumber>
              <AddressWrapper>
                <Address isBig={true} fontColor={specificLocation}>
                  {locationName}
                </Address>
                <Address fontColor={specificLocation}>
                  {locationAddress}
                </Address>
                {isSpecificLocation && (
                  <Address fontColor={specificLocation}>
                    - {`${numSpecLocations} s. loc`}
                  </Address>
                )}
              </AddressWrapper>
            </SectionLocationInfo>

            <SwitchDisplay isMobile={isMobile}>
              <DisplaySum
                machineNumber={machineNumber}
                isMobile={isMobile}
                states={states}
              />
            </SwitchDisplay>

            <SectionConsumption isMobile={isMobile}>
              <ImgWrapper isMobile={isMobile}>
                <ConsumptionImg
                  src='/images/MC-energy-consumption.svg'
                  isMobile={isMobile}
                />
              </ImgWrapper>

              <TitleWrapper isMobile={isMobile}>
                <ConsumptionTitleS isMobile={isMobile}>
                  {source}
                </ConsumptionTitleS>

                <ConsumptionTitleS isMobile={isMobile}>
                  consumption
                </ConsumptionTitleS>

                <ConsumptionUnit isMobile={isMobile}>
                  {energyConsumption} {unit}
                </ConsumptionUnit>
              </TitleWrapper>
            </SectionConsumption>
          </SectionMobileTop>
          {visibility && (
            <SectionMobileBottom isTgs={swtName === 'tgs'}>
              <SectionMobileController isTgs={swtName === 'tgs'}>
                <InstantHeatMC
                  location={location}
                  specificLocation={specificLocation}
                  buttonHandler={buttonHandler}
                  swtName={swtName}
                  isMobile={true}
                  disabled={disabled}
                />
                <SnowSensorMC
                  location={location}
                  specificLocation={specificLocation}
                  buttonHandler={buttonHandler}
                  swtName={swtName}
                  isMobile={true}
                  disabled={disabled}
                />
              </SectionMobileController>

              <SectionWeatherBox>
                <WeatherButton onClick={handleDisplayWeatherBox}>
                  <WeatherButtonTop>
                    <Img
                      src='/images/icon-weather-button.svg'
                      isMobile={true}
                      isWeather={true}
                    />
                  </WeatherButtonTop>
                </WeatherButton>
              </SectionWeatherBox>

              {displayWeatherBox && (
                <WeatherBoxWrapper>
                  <WeatherBox
                    handleCloseWeatherBox={handleDisplayWeatherBox}
                    isMobile={true}
                    locationId={location}
                  />
                </WeatherBoxWrapper>
              )}

              <SectionWifiStatus>
                <WifiNumber>{activatedWifiNumber}</WifiNumber>
                <WifiImgWrapper>
                  <Img src='/images/wifi-active.svg' isMobile={true} />
                </WifiImgWrapper>
              </SectionWifiStatus>
            </SectionMobileBottom>
          )}
        </>
      ) : (
        <Wrapper>
          {!openMiniMC && (
            <SectionHeader>
              <Header>
                <HeaderContentsWrapper>
                  <SectionTitle>
                    <Img src='/images/logo-masterControl.svg' />
                    <HeaderTitle>master control</HeaderTitle>
                  </SectionTitle>

                  <SectionController>
                    <InstantHeatMC
                      location={location}
                      buttonHandler={buttonHandler}
                      swtName={swtName}
                      disabled={disabled}
                    />
                    <SnowSensorMC
                      location={location}
                      buttonHandler={buttonHandler}
                      swtName={swtName}
                      disabled={disabled}
                    />
                  </SectionController>
                </HeaderContentsWrapper>
              </Header>
            </SectionHeader>
          )}

          <SectionBody>
            <SwitchIconWrapper onClick={handleExpand}>
              <Img src={logoSrc} />
            </SwitchIconWrapper>

            <SectionConsumption>
              <ImgWrapper>
                <ConsumptionImg src='/images/MC-energy-consumption.svg' />
              </ImgWrapper>

              <TitleWrapper>
                <ConsumptionTitleS>Total</ConsumptionTitleS>
                <ConsumptionTitleS>{source}</ConsumptionTitleS>
                <ConsumptionTitleS size={8}>consumption</ConsumptionTitleS>

                <DataWrapper>
                  <ConsumptionTitleG>{energyConsumption}</ConsumptionTitleG>
                  <ConsumptionUnit>{unit}</ConsumptionUnit>
                </DataWrapper>
              </TitleWrapper>
            </SectionConsumption>

            <SwitchDisplay>
              <DisplaySum machineNumber={machineNumber} states={states} />
              <DisplayControllers
                swtName={swtName}
                states={states}
                swtStatusInLocation={switchStatus[location]}
                swtStatusInLocationE={switchStatusE[location]}
              />
              <HoverDiv
                onClick={() => setDisplayFaultsMessage((prev) => !prev)}
              >
                <SwitchIconWrapper>
                  <Img src={faultSrc} />
                </SwitchIconWrapper>
              </HoverDiv>
            </SwitchDisplay>
          </SectionBody>

          {displayFaultsMessage && faults && (
            <FaultsMessageWrapper
              onClick={() => setDisplayFaultsMessage(false)}
            >
              {switchStatusE[location]?.isSpecificLocation ? (
                Object.keys(switchStatusE[location].subLocations).map(
                  (subLocation) => (
                    <FaultsReport
                      swt={swtName}
                      locationData={{
                        [subLocation]: switchStatus[subLocation],
                      }}
                      specificLocation={specificLocation}
                    />
                  )
                )
              ) : (
                <FaultsReport
                  swt={swtName}
                  locationData={{ [location]: switchStatus[location] }}
                  specificLocation={specificLocation}
                />
              )}
            </FaultsMessageWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default memo(MainController);

// const MobileWrapper = styled.div`
//   width: 311px;
//   height: 108px;
//   border-radius: 28px;
//   ${layerA180Deg};
//   ${flexDirectionColumn};
//   padding: 3px 0;
// `;

const SectionMobileTop = styled.section`
  width: 303px;
  height: 48px;
  border-radius: 24px;
  ${layerA}

  ${justifyContentSpaceBetween}
  padding: 0 4px 0 0px;

  margin-bottom: 2px;
`;

const SectionLocationInfo = styled.section`
  width: 102px;
  height: 100%;
  ${justifyContentSpaceBetween};
`;
const LocationNumber = styled.span`
  font-size: 22px;
`;
const AddressWrapper = styled.div`
  width: 83px;
  height: 98%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Address = styled.span`
  overflow: hidden;
  font-size: 7px;
  text-align: left;
  line-height: 100%;

  ${(p) =>
    p.isBig &&
    css`
      font-size: 10px;
    `};

  ${({ fontColor }) =>
    fontColor
      ? css`
          color: #ff7800;
        `
      : css`
          color: #95ff45;
        `}
`;

const SectionMobileBottom = styled.section`
  width: 303px;
  height: 48px;
  ${(p) =>
    p.isTgs
      ? css`
          padding-right: 6px;
        `
      : css`
          padding-right: 60px;
        `}
  ${justifyContentSpaceBetween};
  position: relative;
`;

const SectionMobileController = styled.section`
  ${(p) =>
    p.isTgs
      ? css`
          width: 206px;
          height: 46px;
        `
      : css`
          width: 150px;
          height: 46px;
        `};
  border-radius: 28px;
  ${layerA};
  ${justifyContentSpaceBetween};
  padding: 0 2px;
`;

const SectionWeatherBox = styled.section`
  width: 46px;
  height: 46px;
  border-radius: 26px;
  ${layerA};
  ${flexBoxCenter};
`;
const WeatherButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 26px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;
const WeatherButtonTop = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 21px;
  ${layerA};
  ${flexBoxCenter};
`;

const SectionWifiStatus = styled.section`
  width: 30px;
  height: 50px;
  border-radius: 18px;
  ${layerA};
  ${flexDirectionColumn};
  padding: 3px 0;
`;
const WifiNumber = styled.span`
  font-size: 20px;
  text-align: center;
`;
const WifiImgWrapper = styled.div`
  height: 17px;
`;

const WeatherBoxWrapper = styled.div`
  position: absolute;
  top: -102px;
  left: -4px;
`;

// ------- for desktop

const Wrapper = styled.div`
  position: relative;
`;
const SectionHeader = styled.section`
  width: 1206px;
  padding-left: 444px;
`;

const Header = styled.div`
  width: 658px;
  height: 40px;
  border-radius: 20px 20px 0px 0px;
  ${layerA180DegLighter};
  ${flexBoxCenter};

  bottom: 1px solid red;
`;

const HeaderContentsWrapper = styled.div`
  width: 650px;
  height: 32px;
  border-radius: 30px;

  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 1px 0 12px;
`;

const SectionTitle = styled.section`
  width: 182px;
  height: 100%;
  ${justifyContentSpaceBetween};
`;

const HeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionConsumption = styled.section`
  position: relative;
  width: 76px;
  height: 100%;
  ${justifyContentFlexStart};
  padding-top: 8px;
  position: relative;

  ${(p) =>
    p.isMobile &&
    css`
      width: fit-content;
      height: 26px;
      ${justifyContentSpaceBetween};
      padding-top: 0;
    `}
`;

const ImgWrapper = styled.div`
  text-align: right;

  ${(p) =>
    p.isMobile ||
    css`
      height: 28px;
      width: 23px;
      position: absolute;
      top: 8px;
      right: 10px;
    `}

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      padding: 0;
      width: 23px;
      height: 26px;
      margin-right: 2px;
    `}
`;
const ConsumptionImg = styled.img`
  height: 100%;
`;

const ConsumptionTitleS = styled.span`
  font-size: 7px;
  letter-spacing: 0.7px;

  color: #fcff01;

  ${(p) =>
    p.size === 8 &&
    css`
      font-size: 8px;
    `}

  ${(p) =>
    p.isMobile &&
    css`
      letter-spacing: 0.4px;
      margin-bottom: -2px;
      text-align: left;
    `}
`;
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-top: 2px;
  ${(p) =>
    p.isMobile &&
    css`
      margin-top: 0px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
    `}
`;
const DataWrapper = styled.div`
  ${justifyContentFlexStart};
  margin-top: -2px;
`;
const ConsumptionTitleG = styled.span`
  color: #fcff01;
  font-size: 12px;
  letter-spacing: 1.2px;
  margin-right: 4px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
      letter-spacing: 1px;
      text-align: left;
    `}
`;
const ConsumptionUnit = styled.span`
  text-transform: capitalize;
  color: #fcff01;

  ${(p) =>
    p.isMobile
      ? css`
          font-size: 10px;
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;

const SectionController = styled.section`
  width: 430px;
  ${justifyContentSpaceBetween};
`;

const SectionBody = styled.section`
  width: 1206px;
  height: 71px;
  border-radius: 36px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 5px 0 9px;
`;

const HoverDiv = styled.div``;

const SwitchIconWrapper = styled.button`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  ${flexBoxCenter};

  ${(p) =>
    p.isMobile
      ? css`
          width: 48px;
          height: 48px;
        `
      : css`
          ${layerC};
        `};
`;

const Img = styled.img`
  ${(p) =>
    p.isMobile &&
    css`
      height: 100%;
      ${p.isWeather &&
      css`
        margin-right: 4px;
        margin-bottom: 4px;
      `}
    `}
`;

const SwitchDisplay = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 58px;
          height: 42px;
        `
      : css`
          width: 984px;
          height: 58px;
          border-radius: 30px;
          ${layerA};
          ${justifyContentSpaceBetween};
          padding-right: 4px;
        `}/* faults icon location */
    /* border: 1px solid red; */
`;

const FaultsMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1206px;
  height: 400px;
  cursor: pointer;
  position: absolute;
  top: -100px;
  z-index: 100;
  ${flexBoxCenter};
`;

// useEffect(() => {
//   const copyStates = { ...states };

//   // instantHeat
//   const activatedInstantHeat = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].instantHeat.isActivated === true
//   );
//   copyStates.instantHeat.isActivated = activatedInstantHeat.length;

//   const readyInstantHeat = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].instantHeat.isReady === true &&
//       switchStatus[location][machine].instantHeat.isActivated === false
//   );
//   copyStates.instantHeat.isReady = readyInstantHeat.length;

//   // snow sensor
//   const activatedSnowSensor = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].snowSensor.isActivated === true
//   );
//   copyStates.snowSensor.isActivated = activatedSnowSensor.length;

//   const readySnowSensor = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].snowSensor.isReady === true &&
//       switchStatus[location][machine].snowSensor.isActivated === false
//   );
//   copyStates.snowSensor.isReady = readySnowSensor.length;

//   // constant temp
//   const activatedConstantTemp = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].optionalConstantTemp.isActivated ===
//       true
//   );
//   copyStates.constantTemp.isActivated = activatedConstantTemp.length;

//   const readyConstantTemp = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].optionalConstantTemp.isReady === true &&
//       switchStatus[location][machine].optionalConstantTemp.isActivated ===
//         false
//   );
//   copyStates.constantTemp.isReady = readyConstantTemp.length;

//   // heatingSchedule
//   const activatedHeatingSchedule = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].heatingSchedule.isActivated === true
//   );
//   copyStates.heatingSchedule.isActivated = activatedHeatingSchedule.length;

//   const readyHeatingSchedule = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].heatingSchedule.isReady === true &&
//       switchStatus[location][machine].heatingSchedule.isActivated === false
//   );
//   copyStates.heatingSchedule.isReady = readyHeatingSchedule.length;

//   // windFactor
//   const activatedWindFactor = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].windFactor.isActivated === true
//   );
//   copyStates.windFactor.isActivated = activatedWindFactor.length;

//   const readyWindFactor = Object.keys(switchStatus[location]).filter(
//     (machine) =>
//       switchStatus[location][machine].windFactor.isReady === true &&
//       switchStatus[location][machine].windFactor.isActivated === false
//   );
//   copyStates.windFactor.isReady = readyWindFactor.length;

//   // fan Only
//   if (swtName === 'tgs') {
//     const activatedFanOnly = Object.keys(switchStatus[location]).filter(
//       (machine) => switchStatus[location][machine].fanOnly === true
//     );
//     copyStates.fanOnly = activatedFanOnly.length;
//   }

//   const systemOff = Object.keys(switchStatus[location]).filter(
//     (machine) => switchStatus[location][machine].isOff === true
//   );
//   copyStates.systemOff = systemOff.length;

//   const systemFaults = Object.keys(switchStatus[location]).filter(
//     (machine) => switchStatus[location][machine].isFaults === true
//   );
//   copyStates.systemFaults = systemFaults.length;

//   setStates(copyStates);
// }, [switchStatus[location]]);
