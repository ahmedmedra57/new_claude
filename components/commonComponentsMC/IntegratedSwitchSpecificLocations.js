import { useContext, useEffect, useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useMCIsExpandedStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../zustand-stores';
import { useMediaQuery } from 'react-responsive';
import { useMobileSelectProgramStore } from '../zustand-stores';




import styled, { css } from 'styled-components';
import {
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerBDark,
  layerC,
  layerCLighter,
} from '../styles/commonStyles';

import ButtonGroup from './ButtonGroup';
import MainController from './MainController';
import MasterControlByLocation from './MasterControlByLocation';
import EssMasterControlByMachine from '../ess/EssMasterControlByMachine';
import TesMasterControlByMachine from '../tes/TesMasterControlByMachine';
import TgsMasterControlByMachine from '../tgs/TgsMasterControlByMachine';
import {
  getCommandNumberService,
  updateBlowersMasterControlService,
  updateSwitchesMasterControlService,
} from '../../services';
import { convertFahrenheitToCelsius } from '../../helpers/helpers';
import testData from '../../test_data/testData';
import reloadOpenPageHandler from '../../helpers/ess-tgs-tes-mc/reloadOpenPageHandler';
import headerGroupButtonsHandler from '../../helpers/ess-tgs-tes-mc/headerGroupButtonsHandler';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import InputTempMessage from '../userMessages/inputTempMessage';

const IntegratedSwitchSpecificLocations = ({
  locationData,
  location,
  // locationIdx,
  swtName,
  buttonHandler,
  handleControllerInHead,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // useContext
  const {
    openSpecLocationMessageBox,
    setOpenSpecLocationMessageBox,
    message,
    programName,
    messageTitle,
  } = useContext(EssTgsTesContext);

  // Global states
  const { essSwitch, tgsSwitch, tesSwitch } = swtName === 'ess'
      ? useESSSwitchStore()
      : swtName === 'tgs'
      ? useTGSSwitchStore()
      : useTESSwitchStore();

  const switchStatus =
    swtName === 'ess' ? essSwitch : swtName === 'tgs' ? tgsSwitch : tesSwitch;
  const locations = useLocationsStore();

  // !!TEST DATA
  // const { essSwitch } = useESSSwitchStore();
  // const { tgsSwitch } = useTGSSwitchStore();
  // const { tesSwitch } = useTESSwitchStore();

  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  //   testTesSwitch,
  // } = testData(essSwitch, tgsSwitch, locations, tesSwitch);

  // const switchStatus =
  //   swtName === 'ess'
  //     ? testEssSwitch
  //     : swtName === 'tgs'
  //     ? testTgsSwitch
  //     : testTesSwitch;
  // !!END OF TEST DATA

  const MCIsExpanded = useMCIsExpandedStore();
  const { isSpecificLocationOpen } = MCIsExpanded[swtName];

  const selectedProgramState = useMobileSelectProgramStore();

  // const unitsStatus = useUnitsStore();
  // const { isF } = unitsStatus;

  // Location addresses and numbers
  const locationNumber = Object.keys(switchStatus).length;
  // const machineNumber = Object.keys(switchStatus).map(
  //   (location) => Object.keys(Object.values(switchStatus[location])).length
  // );

  const machineNumber = Object.values(locationData).map(
    (el) => Object.keys(el).length
  )[0];

  // display current selected program
  const [selectedProgramSrc, setSelectedProgramSrc] = useState(null);

  useEffect(() => {
    const selectedIndex = Object.values(selectedProgramState).indexOf(true);
    if (selectedIndex > -1) {
      switch (selectedIndex) {
        case 0:
          // instantHeat
          setSelectedProgramSrc('/images/logo-instantHeat.svg');
          break;
        case 1:
          // snowSensor
          setSelectedProgramSrc('/images/logo-snowSensor.svg');
          break;
        case 2:
          // fanOnly
          setSelectedProgramSrc('/images/tgs-fanOnly.svg');
          break;
        case 3:
          // windFactor
          setSelectedProgramSrc('/images/logo-windFactor.svg');
          break;
        case 4:
          // optionalConstantTemp
          setSelectedProgramSrc('/images/logo-constantTemp.svg');
          break;
        case 7:
          // heatingSchedule
          setSelectedProgramSrc('/images/logo-schedule.svg');
          break;
      }
    } else {
      setSelectedProgramSrc(null);
    }
  }, [selectedProgramState]);

  // ***************temporary dummy data
  // const locationAddress = [
  //   'yard, boston massachusetts',
  //   'yard, boston massachusetts',
  //   'boston massachusetts',
  //   'somewhere',
  // ];
  // ***************temporary dummy data

    // --- temporary variables ---
  // const isF = false;

  useEffect(() => {
    if (isSpecificLocationOpen.length > 1) {
      const checker = isSpecificLocationOpen?.some((el) => el === true);
      dispatch(handleOpenMasterControl({ swtName, status: !checker });
    }
  }, [isSpecificLocationOpen]);

  // !! WORK ON THIS bELOW
  useEffect(() => {
    const switchType = window.location.pathname.slice(1);
    const locationId = sessionStorage.getItem('locationId');
    const specificLocationId = sessionStorage.getItem('specificLocationId');
    const machineId = sessionStorage.getItem('machineId');

    // when reload the page should be open the opened devices before
    const openLocation = () => {
      if (switchType === 'ess') {
        reloadOpenPageHandler(
          dispatch,
          handleOpenMasterControl,
          handleOpenMachineController,
          setOpenLocationInitialStateHandler,
          switchType,
          switchStatus,
          // essSwitch,
          locationId,
          machineId,
          specificLocationId
        );
        // dispatch(
        //   handleOpenMasterControl({ swtName: switchType, status: false })
        // );
        // const locationArr = Object.keys(essSwitch).map(
        //   (location) => location === locationId
        // );
        // useESSSwitchStore().resetMachinesState(locationArr);
        // Object.keys(essSwitch).map((location) =>
        //   Object.keys(essSwitch[location]).map((machine) =>
        //     dispatch(
        //       handleOpenMachineController({ location, machine, status: false })
        //     )
        //   )
        // );

        // if (machineId) {
        //   dispatch(
        //     handleOpenMachineController({
        //       location: locationId,
        //       machine: machineId,
        //       status: true,
        //     })
        //   );
        // }
      } else if (switchType === 'tgs') {
        reloadOpenPageHandler(
          dispatch,
          handleOpenMasterControl,
          tgsHandleOpenMachineController,
          setOpenLocationInitialStateHandler,
          switchType,
          switchStatus,
          // tgsSwitch,
          locationId,
          machineId,
          specificLocationId
        );

        // dispatch(
        //   handleOpenMasterControl({ swtName: switchType, status: false })
        // );
        // const locationArr = Object.keys(tgsSwitch).map(
        //   (location) => location === locationId
        // );
        // dispatch(handleTgsInitialState(locationArr);
        // Object.keys(tgsSwitch).map((location) =>
        //   Object.keys(tgsSwitch[location]).map((machine) =>
        //     dispatch(
        //       tgsHandleOpenMachineController({
        //         location,
        //         machine,
        //         status: false,
        //       })
        //     )
        //   )
        // );

        // if (machineId) {
        //   dispatch(
        //     tgsHandleOpenMachineController({
        //       location: locationId,
        //       machine: machineId,
        //       status: true,
        //     })
        //   );
        // }
      } else if (switchType === 'tes') {
        reloadOpenPageHandler(
          dispatch,
          handleOpenMasterControl,
          tesHandleOpenMachineController,
          setOpenLocationInitialStateHandler,
          switchType,
          switchStatus,
          // tesSwitch,
          locationId,
          machineId,
          specificLocationId
        );

        // dispatch(
        //   handleOpenMasterControl({ swtName: switchType, status: false })
        // );
        // const locationArr = Object.keys(tesSwitch).map(
        //   (location) => location === locationId
        // );
        // dispatch(handleTesInitialState(locationArr);
        // Object.keys(tesSwitch).map((location) =>
        //   Object.keys(tesSwitch[location]).map((machine) =>
        //     dispatch(
        //       tesHandleOpenMachineController({
        //         location,
        //         machine,
        //         status: false,
        //       })
        //     )
        //   )
        // );

        // if (machineId) {
        //   dispatch(
        //     tesHandleOpenMachineController({
        //       location: locationId,
        //       machine: machineId,
        //       status: true,
        //     })
        //   );
        // }
      }
      const targetElement = document.getElementById(locationId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    setTimeout(openLocation, 100);

    return () => clearTimeout(openLocation);
  }, []);

  // const handleHeaderButtonGroup = (name, id, _, specificLocation) => {
  //   switch (name) {
  //     case 'expand': {
  //       if (isSpecificLocationOpen[id]) {
  //         // dispatch close
  //         dispatch(
  //           handleOpenSpecificLocation({
  //             swtName,
  //             openSpecificLocationIdx: id,
  //             status: false,
  //           })
  //         );
  //         window.location.hash = '';
  //         sessionStorage.removeItem('specificLocationId');
  //       } else {
  //         // close the other locations and open the location
  //         isSpecificLocationOpen.forEach((_, index) =>
  //           index === id
  //             ? dispatch(
  //                 handleOpenSpecificLocation({
  //                   swtName,
  //                   openSpecificLocationIdx: id,
  //                   status: true,
  //                 })
  //               )
  //             : dispatch(
  //                 handleOpenSpecificLocation({
  //                   swtName,
  //                   openSpecificLocationIdx: index,
  //                   status: false,
  //                 })
  //               )
  //         );
  //         window.location.hash = specificLocation;
  //         sessionStorage.setItem('specificLocationId', specificLocation);
  //       }
  //       break;
  //     }
  //     case 'weather': {
  //       console.log(name, id);
  //       break;
  //     }
  //     case 'upload': {
  //       console.log(name, id);
  //       break;
  //     }
  //     case 'view': {
  //       console.log(name, id);
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  // };

  const mainControllerExpandHandler = (specLocationIdx, isMobile) => {
    // initialize the previous selected program
    if (isMobile) {
      dispatch(handleUnselectAllProgram();
    }
    // open location component
    headerGroupButtonsHandler(
      dispatch,
      handleOpenSpecificLocation,
      isSpecificLocationOpen,
      swtName,
      'expand',
      specLocationIdx,
      location
    );
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          <InnerWrapper>
            {/* <Header isMobile={isMobile}>
              <Title isMobile={isMobile}>
                {swtName} - integrated switch specific locations
              </Title>
              <TitleWrapper>
                <UnderLine />
                <Title isMobile={isMobile}>{locationNumber} locations</Title>
                <UnderLine />
              </TitleWrapper>
            </Header> */}

            {Object.keys(locationData).map((specLocation, specLocationIdx) => {
              const accessLocationData =
                locations[swtName][location][specLocation];
              return (
                <SectionInnerWrapper
                  key={location}
                  id={location}
                  isMobile={isMobile}
                  isExpanded={isSpecificLocationOpen[specLocationIdx]}
                >
                  <MobileMainControllerWrapper
                    isExpanded={isSpecificLocationOpen[specLocationIdx]}
                  >
                    <MainController
                      swtName={swtName}
                      isExpanded={isSpecificLocationOpen[specLocationIdx]}
                      // locationAddress={locationAddress[index]}
                      location={location}
                      specificLocation={specLocation}
                      locationName={accessLocationData?.locationName}
                      // locationName={
                      //   locations[swtName][location][specLocation].locationName
                      // }
                      handleExpand={() =>
                        mainControllerExpandHandler(specLocationIdx, isMobile)
                      }
                      // handleExpand={() => {
                      //   // initialize the previous selected program
                      //   dispatch(handleUnselectAllProgram();
                      //   // open location component
                      //   handleHeaderButtonGroup('expand', specLocationIdx);
                      // }}
                      buttonHandler={handleControllerInHead}
                      machineNumber={machineNumber}
                      visibility={!isSpecificLocationOpen[specLocationIdx]}
                    />

                    {/* <MainController
                    swtName={swtName}
                    isExpanded={isSpecificLocationOpen[specLocationIdx]}
                    location={location}
                    specificLocation={specLocation}
                    handleExpand={
                      () =>
                        headerGroupButtonsHandler(
                          dispatch,
                          handleOpenSpecificLocation,
                          isSpecificLocationOpen,
                          swtName,
                          'expand',
                          specLocationIdx,
                          location
                        )
                      // handleHeaderButtonGroup('expand', specLocationIdx)
                    }
                    buttonHandler={handleControllerInHead}
                    machineNumber={machineNumber}
                  /> */}

                    {isSpecificLocationOpen[specLocationIdx] && (
                      <SectionMasterControl isMobile={isMobile}>
                        <MasterControlByLocation
                          location={location}
                          specificLocation={specLocation}
                          swtName={swtName}
                          buttonHandler={buttonHandler}
                          isMobile={true}
                        />
                      </SectionMasterControl>
                    )}
                  </MobileMainControllerWrapper>

                  {isSpecificLocationOpen[specLocationIdx] && (
                    <>
                      {/* map depends on number of machines by location */}
                      {Object.keys(switchStatus[location]).map(
                        (machine, idx) => (
                          <SectionMachine key={machine}>
                            {swtName === 'ess' && (
                              <EssMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                isMobile={isMobile}
                                selectedProgramSrc={selectedProgramSrc}
                              />
                            )}
                            {swtName === 'tes' && (
                              <TesMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                isMobile={isMobile}
                                selectedProgramSrc={selectedProgramSrc}
                              />
                            )}
                            {swtName === 'tgs' && (
                              <TgsMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                isMobile={isMobile}
                                selectedProgramSrc={selectedProgramSrc}
                              />
                            )}
                          </SectionMachine>
                        )
                      )}
                    </>
                  )}
                </SectionInnerWrapper>
              );
            })}
          </InnerWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <SectionMainContent>
            {Object.keys(locationData).map((specLocation, specLocationIdx) => {
              const accessSpecificLocationData =
                locations[swtName][location][specLocation];
              return (
                <SectionInnerWrapper key={specLocation} id={specLocation}>
                  <ContentHeader>
                    <ContentHeaderTitle>{`${accessSpecificLocationData?.locationNameAbr} - ${accessSpecificLocationData?.specificLocationName} - ${machineNumber} switches `}</ContentHeaderTitle>
                    <ButtonGroup
                      displayHandler={handleOpenSpecificLocation}
                      openArr={isSpecificLocationOpen}
                      handleOnClick={headerGroupButtonsHandler}
                      btnName={
                        isSpecificLocationOpen[specLocationIdx]
                          ? 'close'
                          : 'expand'
                      }
                      id={specLocationIdx}
                      locationId={locations[swtName][location]?.locationId}
                      specificLocationId={
                        accessSpecificLocationData?.specificLocationId
                      }
                      swtName={swtName}
                    />
                  </ContentHeader>

                  <MainController
                    swtName={swtName}
                    isExpanded={isSpecificLocationOpen[specLocationIdx]}
                    location={location}
                    specificLocation={specLocation}
                    handleExpand={() =>
                      mainControllerExpandHandler(specLocationIdx)
                    }
                    // handleExpand={
                    //   () =>
                    //     headerGroupButtonsHandler(
                    //       dispatch,
                    //       handleOpenSpecificLocation,
                    //       isSpecificLocationOpen,
                    //       swtName,
                    //       'expand',
                    //       specLocationIdx,
                    //       location
                    //     )
                    //   // handleHeaderButtonGroup('expand', specLocationIdx)
                    // }
                    buttonHandler={handleControllerInHead}
                    machineNumber={machineNumber}
                  />
                  {isSpecificLocationOpen[specLocationIdx] && (
                    <>
                      <SectionMasterControl>
                        <SectionInnerLayer>
                          <MasterControlByLocation
                            location={location}
                            swtName={swtName}
                            buttonHandler={buttonHandler}
                            specificLocation={specLocation}
                          />
                        </SectionInnerLayer>
                      </SectionMasterControl>

                      {Object.keys(switchStatus[location][specLocation]).map(
                        (machine) => (
                          <SectionMachine key={machine}>
                            {swtName === 'ess' && (
                              <EssMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                swtName={swtName}
                                indivLocationName={
                                  accessSpecificLocationData?.locationName
                                }
                                isMobile={isMobile}
                              />
                            )}
                            {swtName === 'tes' && (
                              <TesMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                swtName={swtName}
                                indivLocationName={
                                  accessSpecificLocationData?.locationName
                                }
                              />
                            )}
                            {swtName === 'tgs' && (
                              <TgsMasterControlByMachine
                                location={location}
                                specificLocation={specLocation}
                                machine={machine}
                                swtName={swtName}
                              />
                            )}
                          </SectionMachine>
                        )
                      )}
                    </>
                  )}
                </SectionInnerWrapper>
              );
            })}
          </SectionMainContent>
          {openSpecLocationMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenSpecLocationMessageBox(false)}
                title={messageTitle}
                subtitle={programName}
                messages={message}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default IntegratedSwitchSpecificLocations;

const Wrapper = styled.div`
  ${(p) =>
    p.isMobile &&
    css`
      width: 332px;
      border-radius: 31px 31px 36px 13px;
      ${layerCLighter}
      ${flexBoxCenter}
      padding:3px 0;
    `}
`;

const InnerWrapper = styled.div`
  width: 326px;
  border-radius: 28px 28px 33px 10px;
  ${layerA90Deg};
  ${flexDirectionColumn};
  padding: 4px 0;
`;
const Header = styled.div`
  width: 1216px;
  height: 32px;
  border-radius: 16px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 14px;
  margin-bottom: 5px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 314px;
      height: 43px;
      border-radius: 30px;
      ${flexDirectionColumn};
      justify-content: center;
    `}
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 11px;
      letter-spacing: 1px;
      text-align: center;
      border-bottom: none;
    `}
`;

const TitleWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

const UnderLine = styled.div`
  width: 120px;
  border: 1px solid #fff;
`;

const SectionMainContent = styled.section`
  width: 1216px;
  border-radius: 22px 22px 40px 40px;
  ${layerC};

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 2px 0;
`;

const SectionInnerWrapper = styled.div`
  width: 1211px;
  /* height: 150px; */
  border-radius: 18px 18px 38px 38px;
  ${layerADark};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 0;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
  ${(p) =>
    p.isMobile &&
    css`
      width: 315px;
      /* height: 400px; */
      border-radius: 30px;
      padding: 2px 0;
      ${(p) =>
        p.isExpanded &&
        css`
          border-radius: 30px 30px 32px 32px;
        `}
    `};
`;

const MobileMainControllerWrapper = styled.div`
  width: 311px;
  border-radius: 28px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 3px 0;

  ${(p) =>
    p.isExpanded &&
    css`
      height: auto;
      border-radius: 28px 28px 24px 24px;
    `};
`;

const ContentHeader = styled.div`
  width: 1206px;
  height: 32px;
  border-radius: 16px;
  ${layerBDark};
  ${justifyContentSpaceBetween};
  padding-left: 10px;
  margin-bottom: 2px;
  position: relative;
`;

const ContentHeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ff920c;
  /* ${(p) =>
    p.isExpanded ||
    css`
      visibility: hidden;
    `} */
`;

const SectionMasterControl = styled.section`
  ${(p) =>
    p.isMobile
      ? css``
      : css`
          ${flexBoxCenter};
          width: 1209px;
          height: 220px;
          border-radius: 16px;
          ${layerC}
          margin-top: 7px;
        `};
`;
const SectionInnerLayer = styled.div`
  width: 1205px;
  height: 217px;
  border-radius: 14px;
  ${layerA180Deg};
  ${flexBoxCenter};
  ${(p) => (p.isMobile ? css`` : css``)};
`;

const SectionMachine = styled.section`
  margin-top: 10px;
`;

const MessageBoxWrapper = styled.div`
  width: 1200px;
  height: 220px;

  ${flexBoxCenter}

  position: absolute;
  top: 60%;
  left: 18%;
  z-index: 100;
`;
