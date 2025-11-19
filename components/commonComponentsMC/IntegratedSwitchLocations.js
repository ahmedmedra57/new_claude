import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import {
  handleInstantHeat,
  handleInstantHeatOff,
  handleInstantHeatReady,
  handleOpenMachineController,
  handleSnowSensor,
  handleSnowSensorOff,
  selectEssSwitch,
} from '../store/slices/essSwitchSlice';

import {
  tesHandleInstantHeat,
  tesHandleInstantHeatOff,
  tesHandleSnowSensor,
  tesHandleSnowSensorOff,
  selectTesSwitch,
  tesHandleOpenMachineController,
  tesHandleInstantHeatIsReady,
} from '../store/slices/tesSwitchSlice';

import {
  tgsHandleInstantHeat,
  tgsHandleInstantHeatOff,
  tgsHandleSnowSensor,
  tgsHandleSnowSensorOff,
  selectTgsSwitch,
  tgsHandleFanOnly,
  tgsHandleOpenMachineController,
  tgsHandleInstantHeatIsReady,
} from '../store/slices/tgsSwitchSlice';

import styled, { css } from 'styled-components';
import {
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
  handleEssInitialState,
  handleOpenLocation,
  handleOpenLocationMasterControl,
  handleOpenMasterControl,
  handleOpenSpecificLocation,
  handleOpenSpecificLocationMasterControl,
  handleTesInitialState,
  handleTgsInitialState,
  selectMCIsExpanded,
  setOpenLocationInitialStateHandler,
  setOpenSpecificLocationInitialStateHandler,
} from '../store/slices/MCIsExpandedSlice';
import {
  handleUnselectAllProgram,
  selectedProgram,
} from '../store/slices/mobileSelectProgramSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { selectLocations } from '../store/slices/locationsSlice';
import { selectUserPermissions } from '../store/slices/userSlice';
import {
  getCommandNumberService,
  updateBlowersMasterControlService,
  updateSwitchesMasterControlService,
} from '../../services';
import {
  convertFahrenheitToCelsius,
  getSpecLocationHandler,
} from '../../helpers/helpers';
import testData from '../../test_data/testData';
import IntegratedSwitchSpecificLocations from './IntegratedSwitchSpecificLocations';
import reloadOpenPageHandler from '../../helpers/ess-tgs-tes-mc/reloadOpenPageHandler';
import headerGroupButtonsHandler from '../../helpers/ess-tgs-tes-mc/headerGroupButtonsHandler';
import InputTempMessage from '../userMessages/inputTempMessage';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { useLocation } from 'react-router-dom';
import keys from 'lodash/keys';
import MasterControlBySwitchTitle from './MasterControlBySwitchTitle';

const IntegratedSwitchLocations = ({ swtName, buttonHandler }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Navigation state for two-panel layout
  const [navigationView, setNavigationView] = useState('zones'); // 'zones' or 'switches'
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSpecificLocation, setSelectedSpecificLocation] = useState(null);
  const [selectedSwitch, setSelectedSwitch] = useState(null);

  function getQueryParam(key) {
    const currentHash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(currentHash);
    return params.get(key);
  }

  const selectedZoneId = getQueryParam('location')
    ? decodeURIComponent(getQueryParam('location'))
    : '';

  const selectedSpecificLocationId = getQueryParam('specificLocation')
    ? decodeURIComponent(getQueryParam('specificLocation'))
    : '';

  useEffect(() => {
    if (selectedZoneId) {
      const zoneElement = document.getElementById(selectedZoneId);
      if (zoneElement) {
        zoneElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (selectedSpecificLocationId) {
      const specificLocationElement = document.getElementById(
        selectedSpecificLocationId
      );
      if (specificLocationElement) {
        specificLocationElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selectedZoneId, selectedSpecificLocationId]);

  // useContext
  const {
    openLocationMessageBox,
    setOpenLocationMessageBox,
    message,
    programName,
    messageTitle,
  } = useContext(EssTgsTesContext);

  // Global states
  const {
    essSwitch,
    tgsSwitch,
    tesSwitch,
    flatEssSwitch,
    flatTgsSwitch,
    flatTesSwitch,
  } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchStatus =
    swtName === 'ess' ? essSwitch : swtName === 'tgs' ? tgsSwitch : tesSwitch;
  const switchStatusE =
    swtName === 'ess'
      ? flatEssSwitch
      : swtName === 'tgs'
      ? flatTgsSwitch
      : flatTesSwitch;

      
  const locations = useSelector(selectLocations);
  const permissions = useSelector(selectUserPermissions);
  const disabled = !permissions.WRITE;
  // !!TEST DATA
  // const { essSwitch } = useSelector(selectEssSwitch);
  // const { tgsSwitch } = useSelector(selectTgsSwitch);
  // const { tesSwitch } = useSelector(selectTesSwitch);

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

  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const {
    isLocationOpen,
    locationMasterControl,
    specificLocationMasterControl,
  } = MCIsExpanded[swtName];

  const selectedProgramState = useSelector(selectedProgram);

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  // Location addresses and numbers

  const isSpecLocationValidArr = [];
  const machineNumber = Object.values(switchStatus).map((location) => {
    if (location.isSpecificLocation) {
      const subLocations = location.subLocations;
      const subLocationValues = Object.values(subLocations);
      const device = subLocationValues.map((subLocation) => {
        const devices = Object.values(subLocation.devices || {});
        return devices;
      });
      const deviceArr = device.flat();
      if (deviceArr.length === 0) {
        isSpecLocationValidArr.push(false);
        return 0;
      } else if (Object.values(deviceArr).some((el) => el.deviceMac)) {
        isSpecLocationValidArr.push(false);
        return deviceArr.length;
      } else {
        isSpecLocationValidArr.push(true);
        return Object.values(deviceArr).map((el) => Object.keys(el).length);
      }
    } else {
      if (Object.keys(location.devices).length === 0) {
        isSpecLocationValidArr.push(false);
        return 0;
      } else if (Object.values(location.devices).some((el) => el.deviceMac)) {
        isSpecLocationValidArr.push(false);
        return Object.keys(location.devices).length;
      } else {
        isSpecLocationValidArr.push(true);
        return Object.values(location.devices).map(
          (el) => Object.keys(el).length
        );
      }
    }
  });

  const locationNumber = Object.keys(switchStatus).length;

  // display current selected program'
  const [parentLocation, setParentLocation] = useState(false);
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

  const dispatch = useDispatch();
  // --- temporary variables ---
  // const isF = false;

  useEffect(() => {
    if (isLocationOpen.length > 1) {
      const checker = isLocationOpen?.some((el) => el === true);
      dispatch(handleOpenMasterControl({ swtName, status: !checker }));

      // if (swtName === 'ess') {
      //   checker
      //     ? dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }))
      //     : dispatch(handleOpenMasterControl({ swtName: 'ess', status: true }));
      // } else if (swtName === 'tgs') {
      //   checker
      //     ? dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }))
      //     : dispatch(handleOpenMasterControl({ swtName: 'tgs', status: true }));
      // } else if (swtName === 'tes') {
      //   checker
      //     ? dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }))
      //     : dispatch(handleOpenMasterControl({ swtName: 'tes', status: true }));
      // }
    }
  }, [isLocationOpen]);

  // const openLocationHandler = (
  //   swtSystem,
  //   swtData,
  //   locationId,
  //   specLocationId,
  //   machineId,
  //   openMachineFC
  // ) => {
  //   dispatch(handleOpenMasterControl({ swtName: swtSystem, status: false }));

  //   const locationArr = Object.keys(swtData).map(
  //     (location) => location === locationId
  //   );

  //   dispatch(
  //     setOpenLocationInitialStateHandler({ swtSystem, locations: locationArr })
  //   );

  //   if (specLocationId) {
  //     const specLocationArr = getSpecLocationHandler(swtData).map(
  //       (specLocation) => Object.keys(specLocation)[0] === specLocationId
  //     );
  //     dispatch(
  //       setOpenSpecificLocationInitialStateHandler({
  //         swtSystem,
  //         specificLocations: specLocationArr,
  //       })
  //     );
  //   }

  //   Object.keys(swtData).forEach((location) =>
  //     Object.entries(swtData[location]).forEach(([key, value]) => {
  //       if (value.deviceMac) {
  //         dispatch(openMachineFC({ location, machine: key, status: false }));
  //       } else {
  //         Object.keys(value).forEach((machine) => {
  //           dispatch(
  //             openMachineFC({
  //               location,
  //               specificLocation: key,
  //               machine,
  //               status: false,
  //             })
  //           );
  //         });
  //       }
  //     })
  //   );

  //   // Object.keys(swtData).map((location) =>
  //   //   Object.keys(swtData[location]).map((machine) =>
  //   //     dispatch(openMachineFC({ location, machine, status: false }))
  //   //   )
  //   // );

  //   if (machineId) {
  //     dispatch(
  //       openMachineFC({
  //         location: locationId,
  //         specificLocation: specLocationId,
  //         machine: machineId,
  //         status: true,
  //       })
  //     );
  //   }
  // };

  // const handleHeaderButtonGroup = (name, id, location) => {
  //   switch (name) {
  //     case 'expand': {
  //       if (isLocationOpen[id]) {
  //         // dispatch close
  //         dispatch(handleOpenLocation({ swtName, index: id, status: false }));
  //         window.location.hash = '';
  //         sessionStorage.removeItem('locationId');
  //       } else {
  //         // close the other locations and open the location

  //         isLocationOpen.forEach((state, index) =>
  //           index === id
  //             ? dispatch(
  //                 handleOpenLocation({ swtName, index: id, status: true })
  //               )
  //             : dispatch(handleOpenLocation({ swtName, index, status: false }))
  //         );
  //         window.location.hash = location;
  //         sessionStorage.setItem('locationId', location);
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

  const commandNumberServiceHandler = (
    machineIds,
    FC,
    checkOption,
    option,
    swtSystem,
    btnState
  ) => {
    const isOn = btnState ? 1 : 0;
    getCommandNumberService('FAST_MASTER_CONTROL').then((commandNumber) => {
      if (checkOption === 'instantHeatOn') {
        FC(machineIds, swtSystem, {
          commandNumber: commandNumber,
          instant_temp: isF ? convertFahrenheitToCelsius(option) : option,
          on_switch: 1,
          actionType: 'FAST_MASTER_CONTROL',
        });
      } else if (checkOption === 'instantHeatOff') {
        FC(machineIds, swtSystem, {
          commandNumber: commandNumber,
          on_switch: 0,
          actionType: 'FAST_MASTER_CONTROL',
        });
      } else if (checkOption === 'snowSensorOn') {
        FC(machineIds, swtSystem, {
          commandNumber: commandNumber,
          snow_enabled: 1,
          actionType: 'FAST_MASTER_CONTROL',
        });
      } else {
        getCommandNumberService('FAST_MASTER_CONTROL').then((commandNumber) => {
          FC(machineIds, swtSystem, {
            commandNumber: commandNumber,
            snow_enabled: 0,
            actionType: 'FAST_MASTER_CONTROL',
          });
        });
      }
    });
  };

  const loopMachinesAndDispatchHandler = (
    checkOption,
    location,
    specificLocation,
    option,
    dispatchFC,
    swtSystem,
    btnState
  ) => {
    let machineIds = [];
    if (switchStatus[location]?.isSpecificLocation) {
      Object.keys(switchStatus[location].subLocations).forEach(
        (subLocation) => {
          Object.keys(
            switchStatus[location].subLocations[subLocation].devices
          ).forEach((machine) => {
            machineIds.push(switchStatusE[subLocation][machine].deviceMac);
            if (checkOption === 'instantHeatOn') {
              dispatch(
                dispatchFC({
                  location: subLocation,
                  machine,
                  temp: option,
                  isF,
                })
              );
            } else if (checkOption === 'fanOnly') {
              dispatch(
                dispatchFC({ location: subLocation, machine, state: option })
              );
            } else {
              dispatch(dispatchFC({ location: subLocation, machine }));
            }
          });
        }
      );
    } else {
      Object.keys(switchStatusE[location]).forEach((machine) => {
        machineIds.push(switchStatusE[location][machine].deviceMac);
        if (checkOption === 'instantHeatOn') {
          dispatch(dispatchFC({ location, machine, temp: option, isF }));
        } else if (checkOption === 'fanOnly') {
          dispatch(dispatchFC({ location, machine, state: option }));
        } else {
          dispatch(dispatchFC({ location, machine }));
        }
      });
    }
    switch (swtSystem) {
      case 'ess':
        commandNumberServiceHandler(
          machineIds,
          updateSwitchesMasterControlService,
          checkOption,
          option,
          'ESS',
          btnState
        );
        break;
      case 'tgs':
        commandNumberServiceHandler(
          machineIds,
          updateBlowersMasterControlService,
          checkOption,
          option,
          'TGS',
          btnState
        );
        break;
      case 'tes':
        commandNumberServiceHandler(
          machineIds,
          updateBlowersMasterControlService,
          checkOption,
          option,
          'TES',
          btnState
        );
        break;
      default:
    }
  };

  const handleControllerInHead = (
    btn,
    state,
    location,
    temp,
    specificLocation
  ) => {
    if (btn === 'instantHeat') {
      if (swtName === 'ess') {
        if (state === 'on') {
          loopMachinesAndDispatchHandler(
            'instantHeatOn',
            location,
            specificLocation,
            temp,
            handleInstantHeatReady,
            swtName,
            true
          );
        } else {
          loopMachinesAndDispatchHandler(
            'instantHeatOff',
            location,
            specificLocation,
            null,
            handleInstantHeatOff,
            swtName
          );
        }
      } else if (swtName === 'tgs') {
        if (state === 'on') {
          loopMachinesAndDispatchHandler(
            'instantHeatOn',
            location,
            specificLocation,
            temp,
            tgsHandleInstantHeatIsReady,
            swtName,
            true
          );
        } else {
          loopMachinesAndDispatchHandler(
            'instantHeatOff',
            location,
            specificLocation,
            null,
            tgsHandleInstantHeatOff,
            swtName
          );
        }
      } else {
        if (state === 'on') {
          loopMachinesAndDispatchHandler(
            'instantHeatOn',
            location,
            specificLocation,
            temp,
            tesHandleInstantHeatIsReady,
            swtName,
            true
          );
        } else {
          loopMachinesAndDispatchHandler(
            'instantHeatOff',
            location,
            specificLocation,
            null,
            tesHandleInstantHeatOff,
            swtName
          );
        }
      }
    } else if (btn === 'snowSensor') {
      // snowSensor
      if (swtName === 'ess') {
        if (state === 'off') {
          loopMachinesAndDispatchHandler(
            false,
            location,
            specificLocation,
            null,
            handleSnowSensorOff,
            swtName
          );
        } else {
          loopMachinesAndDispatchHandler(
            'snowSensorOn',
            location,
            specificLocation,
            null,
            handleSnowSensor,
            swtName,
            true
          );
        }
      } else if (swtName === 'tgs') {
        if (state === 'off') {
          loopMachinesAndDispatchHandler(
            false,
            location,
            specificLocation,
            null,
            tgsHandleSnowSensorOff,
            swtName
          );
        } else {
          loopMachinesAndDispatchHandler(
            'snowSensorOn',
            location,
            specificLocation,
            null,
            tgsHandleSnowSensor,
            swtName,
            true
          );
        }
      } else {
        if (state === 'off') {
          loopMachinesAndDispatchHandler(
            false,
            location,
            specificLocation,
            null,
            tesHandleSnowSensorOff,
            swtName
          );
        } else {
          loopMachinesAndDispatchHandler(
            'snowSensorOn',
            location,
            specificLocation,
            null,
            tesHandleSnowSensor,
            swtName,
            true
          );
        }
      }
    } else if (btn === 'fanOnly') {
      if (state === 'off') {
        loopMachinesAndDispatchHandler(
          'fanOnly',
          location,
          specificLocation,
          false,
          tgsHandleFanOnly,
          swtName
        );
      } else {
        loopMachinesAndDispatchHandler(
          'fanOnly',
          location,
          specificLocation,
          true,
          tgsHandleFanOnly,
          swtName,
          true
        );
      }
    }
  };

  const mainControllerExpandHandler = (location, index, isMobile) => {
    // initialize the previous selected program
    if (isMobile) {
      dispatch(handleUnselectAllProgram());
    }
    // open location component
    headerGroupButtonsHandler(
      dispatch,
      handleOpenLocation,
      isLocationOpen,
      swtName,
      'expand',
      index,
      location
    );
  };

  // Two-panel navigation handlers
  const handleZoneClick = (location) => {
    setSelectedZone(location);
    setSelectedSpecificLocation(null);
    setNavigationView('switches');
    setSelectedSwitch(null); // Clear selected switch when changing zones
  };

  const handleBackToZones = () => {
    setNavigationView('zones');
    setSelectedZone(null);
    setSelectedSpecificLocation(null);
    setSelectedSwitch(null);
  };

  const handleSwitchClick = (location, machine, specificLocation = null) => {
    setSelectedSwitch({
      location: specificLocation || location,
      machine,
      parentLocation: specificLocation ? location : null,
    });
  };

  const handleSpecificLocationClick = (specificLocation) => {
    setSelectedSpecificLocation(specificLocation);
  };

  const handleBackToParentZone = () => {
    setSelectedSpecificLocation(null);
  };

  // console.log('switchStatus:', switchStatus);
  // console.log(':',);
  // console.log(':',);

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          <InnerWrapper>
            <Header isMobile={isMobile}>
              <Title isMobile={isMobile}>
                {swtName} - integrated switch locations
              </Title>
              <TitleWrapper>
                <UnderLine />
                <Title isMobile={isMobile}>{locationNumber} locations</Title>
                <UnderLine />
              </TitleWrapper>
            </Header>

            {Object.keys(switchStatus).map((location, index) => {
              const isExpanded = selectedZoneId === location;
              const accessLocationData = locations[swtName][location];
              const isSpecificLocation =
                switchStatus[location].isSpecificLocation;
              const numSpecLocations =
                isSpecificLocation &&
                Object.keys(switchStatus[location].subLocations).length;
              return (
                <SectionInnerWrapper
                  key={location}
                  id={location}
                  isMobile={isMobile}
                  isExpanded={isExpanded}
                >
                  <MobileMainControllerWrapper isExpanded={isExpanded}>
                    <MainController
                      locationAddress={accessLocationData?.locationAddress}
                      swtName={swtName}
                      isExpanded={isExpanded}
                      location={location}
                      locationName={accessLocationData?.locationName}
                      companyName={accessLocationData?.company_name}
                      handleExpand={() =>
                        mainControllerExpandHandler(location, index, isMobile)
                      }
                      isSpecificLocation={isSpecificLocation}
                      numSpecLocations={numSpecLocations}
                      buttonHandler={handleControllerInHead}
                      machineNumber={machineNumber[index]}
                      visibility={!isExpanded}
                      disabled={disabled}
                    />

                    {isExpanded && (
                      <SectionMasterControl isMobile={isMobile}>
                        <MasterControlByLocation
                          location={location}
                          swtName={swtName}
                          buttonHandler={buttonHandler}
                          isMobile={true}
                          disabled={disabled}
                        />
                      </SectionMasterControl>
                    )}
                  </MobileMainControllerWrapper>

                  {isExpanded && (
                    <>
                      {/* map depends on number of machines by location */}
                      {switchStatus[location].isSpecificLocation
                        ? Object.keys(switchStatus[location].subLocations).map(
                            (specificLocation, idx) => {
                              const specificLocationData =
                                locations[swtName][specificLocation];

                              const devicesLength = Object.keys(
                                switchStatus[location].subLocations[
                                  specificLocation
                                ].devices
                              ).length;
                              const isSpecExpanded =
                                selectedZoneId === location &&
                                selectedSpecificLocationId === specificLocation;
                              return (
                                <div key={specificLocation}>
                                  <SectionInnerWrapper
                                    id={specificLocation}
                                    isMobile={isMobile}
                                    isExpanded={isExpanded}
                                  >
                                    <MobileMainControllerWrapper
                                      isExpanded={isExpanded}
                                    >
                                      <MainController
                                        swtName={swtName}
                                        disabled={disabled}
                                        isExpanded={isSpecExpanded}
                                        location={location}
                                        specificLocation={specificLocation}
                                        locationName={
                                          specificLocationData?.specific_address
                                        }
                                        companyName={
                                          specificLocationData?.company_name
                                        }
                                        handleExpand={() =>
                                          headerGroupButtonsHandler(
                                            dispatch,
                                            handleOpenLocation,
                                            isLocationOpen,
                                            swtName,
                                            'expand',
                                            idx,
                                            location,
                                            specificLocation
                                          )
                                        }
                                        buttonHandler={handleControllerInHead}
                                        machineNumber={devicesLength}
                                        visibility={!isSpecExpanded}
                                      />

                                      {isSpecExpanded && (
                                        <SectionMasterControl
                                          isMobile={isMobile}
                                        >
                                          <MasterControlByLocation
                                            location={specificLocation}
                                            swtName={swtName}
                                            buttonHandler={buttonHandler}
                                            isMobile={isMobile}
                                            disabled={disabled}
                                          />
                                        </SectionMasterControl>
                                      )}
                                    </MobileMainControllerWrapper>
                                  </SectionInnerWrapper>

                                  {isSpecExpanded && (
                                    <>
                                      {Object.keys(
                                        switchStatus[location].subLocations[
                                          specificLocation
                                        ].devices
                                      ).map((machine) => (
                                        <SectionMachine
                                          key={machine}
                                          isMobile={isMobile}
                                        >
                                          {swtName === 'ess' && (
                                            <EssMasterControlByMachine
                                              location={specificLocation}
                                              machine={machine}
                                              swtName={swtName}
                                              indivLocationName={
                                                specificLocationData?.location_name_short
                                              }
                                              isMobile={isMobile}
                                            />
                                          )}
                                          {swtName === 'tes' && (
                                            <TesMasterControlByMachine
                                              location={specificLocation}
                                              machine={machine}
                                              swtName={swtName}
                                              indivLocationName={
                                                specificLocationData?.location_name_short
                                              }
                                              isMobile={isMobile}
                                            />
                                          )}
                                          {swtName === 'tgs' && (
                                            <TgsMasterControlByMachine
                                              location={specificLocation}
                                              machine={machine}
                                              swtName={swtName}
                                              isMobile={isMobile}
                                            />
                                          )}
                                        </SectionMachine>
                                      ))}
                                    </>
                                  )}
                                </div>
                              );
                            }
                          )
                        : Object.keys(switchStatus[location].devices).map(
                            (machine) => (
                              <SectionMachine key={machine} isMobile={isMobile}>
                                {swtName === 'ess' && (
                                  <EssMasterControlByMachine
                                    location={location}
                                    machine={machine}
                                    swtName={swtName}
                                    isMobile={isMobile}
                                    selectedProgramSrc={selectedProgramSrc}
                                  />
                                )}
                                {swtName === 'tes' && (
                                  <TesMasterControlByMachine
                                    location={location}
                                    machine={machine}
                                    swtName={swtName}
                                    selectedProgramSrc={selectedProgramSrc}
                                    isMobile={isMobile}
                                  />
                                )}
                                {swtName === 'tgs' && (
                                  <TgsMasterControlByMachine
                                    location={location}
                                    machine={machine}
                                    swtName={swtName}
                                    selectedProgramSrc={selectedProgramSrc}
                                    isMobile={isMobile}
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
          {openLocationMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenLocationMessageBox(false)}
                title={messageTitle}
                subtitle={programName}
                messages={message}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      ) : (
        <Wrapper>
          <TwoPanelContainer>
            {/* LEFT PANEL */}
            <LeftPanel>
              <Header>
                <Title>
                  integrated switch locations - {locationNumber} locations
                </Title>
              </Header>

              {/* Navigation Area */}
              {navigationView === 'zones' ? (
                // ZONES LIST VIEW
                <ZonesListContainer>
                  {Object.keys(switchStatus).map((location, index) => {
                    const locationData = locations[swtName][location];
                    const isSpecificLocation = switchStatus[location].isSpecificLocation;
                    const numSpecLocations = isSpecificLocation && Object.keys(switchStatus[location].subLocations).length;
                    const count = isSpecificLocation ? numSpecLocations : machineNumber[index];

                    return (
                      <ZoneItem
                        key={location}
                        onClick={() => handleZoneClick(location)}
                      >
                        <ZoneItemTitle>
                          {locationData?.location_name_short || locationData?.location_name}
                        </ZoneItemTitle>
                        <ZoneItemCount>
                          {count} {isSpecificLocation ? 'sub-loc' : 'sw'}
                        </ZoneItemCount>
                      </ZoneItem>
                    );
                  })}
                </ZonesListContainer>
              ) : (
                // SWITCHES LIST VIEW (when zone is selected)
                <SwitchesListContainer>
                  <BackButton onClick={handleBackToZones}>
                    ← Back to Zones
                  </BackButton>

                  {selectedZone && (
                    <>
                      {switchStatus[selectedZone].isSpecificLocation ? (
                        // Zone has sub-locations
                        <>
                          {!selectedSpecificLocation ? (
                            // Show sub-locations list
                            Object.keys(switchStatus[selectedZone].subLocations).map((specLoc) => {
                              const specificLocationData = locations[swtName][specLoc];
                              const devicesLength = Object.keys(switchStatus[selectedZone].subLocations[specLoc].devices).length;

                              return (
                                <SubLocationItem
                                  key={specLoc}
                                  onClick={() => handleSpecificLocationClick(specLoc)}
                                >
                                  <SubLocationTitle>
                                    {specificLocationData?.location_name_short}
                                  </SubLocationTitle>
                                  <SubLocationCount>{devicesLength} sw</SubLocationCount>
                                </SubLocationItem>
                              );
                            })
                          ) : (
                            // Show switches in selected sub-location
                            <>
                              <BackButton onClick={handleBackToParentZone}>
                                ← Back to Sub-locations
                              </BackButton>
                              {Object.keys(switchStatus[selectedZone].subLocations[selectedSpecificLocation].devices).map((machine) => {
                                const isActive = selectedSwitch?.machine === machine && selectedSwitch?.location === selectedSpecificLocation;

                                return (
                                  <SwitchItem
                                    key={machine}
                                    active={isActive}
                                    onClick={() => handleSwitchClick(selectedZone, machine, selectedSpecificLocation)}
                                  >
                                    {machine}
                                  </SwitchItem>
                                );
                              })}
                            </>
                          )}
                        </>
                      ) : (
                        // Zone has direct switches (no sub-locations)
                        Object.keys(switchStatus[selectedZone].devices).map((machine) => {
                          const isActive = selectedSwitch?.machine === machine && selectedSwitch?.location === selectedZone;

                          return (
                            <SwitchItem
                              key={machine}
                              active={isActive}
                              onClick={() => handleSwitchClick(selectedZone, machine)}
                            >
                              {machine}
                            </SwitchItem>
                          );
                        })
                      )}
                    </>
                  )}
                </SwitchesListContainer>
              )}
            </LeftPanel>

            {/* RIGHT PANEL */}
            <RightPanel>
              {selectedSwitch ? (
                <>
                  {swtName === 'ess' && (
                    <EssMasterControlByMachine
                      location={selectedSwitch.location}
                      machine={selectedSwitch.machine}
                      swtName={swtName}
                      indivLocationName={locations[swtName][selectedSwitch.location]?.location_name_short}
                    />
                  )}
                  {swtName === 'tes' && (
                    <TesMasterControlByMachine
                      location={selectedSwitch.location}
                      machine={selectedSwitch.machine}
                      swtName={swtName}
                      indivLocationName={locations[swtName][selectedSwitch.location]?.location_name_short}
                    />
                  )}
                  {swtName === 'tgs' && (
                    <TgsMasterControlByMachine
                      location={selectedSwitch.location}
                      machine={selectedSwitch.machine}
                      swtName={swtName}
                    />
                  )}
                </>
              ) : (
                <PlaceholderContainer>
                  <PlaceholderText>Select a switch to view details</PlaceholderText>
                </PlaceholderContainer>
              )}
            </RightPanel>
          </TwoPanelContainer>
          {openLocationMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenLocationMessageBox(false)}
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

export default IntegratedSwitchLocations;

// {isExpanded && (
//   <>
//     {/* map depends on number of machines by location */}
//     {Object.keys(
//       switchStatus[location].devices ||
//         switchStatus[location].subLocations
//     ).map((machine) => (
//       <SectionMachine key={machine}>
//         {swtName === 'ess' && (
//           <EssMasterControlByMachine
//             location={location}
//             machine={machine}
//             isMobile={isMobile}
//             selectedProgramSrc={selectedProgramSrc}
//           />
//         )}
//         {swtName === 'tes' && (
//           <TesMasterControlByMachine
//             location={location}
//             machine={machine}
//             isMobile={isMobile}
//             selectedProgramSrc={selectedProgramSrc}
//           />
//         )}
//         {swtName === 'tgs' && (
//           <TgsMasterControlByMachine
//             location={location}
//             machine={machine}
//             isMobile={isMobile}
//             selectedProgramSrc={selectedProgramSrc}
//           />
//         )}
//       </SectionMachine>
//     ))}

//   </>
// )}

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
          gap: 6px;
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

const SpecificLocationWrapper = styled.section`
  height: auto;
  width: auto;
  padding: 2px;
  margin-top: 6px;
  border-radius: 16px 16px 36px 36px;
  background-color: #142033;
  ${flexBoxCenter}
  flex-direction: column;
`;

const ContentHeader = styled.div`
  width: 1206px;
  height: 32px;
  border-radius: 16px;
  ${layerBDark};
  ${justifyContentSpaceBetween};
  padding-left: 10px;
  margin-bottom: 2px;
  /* margin-top: 2px; */
  position: relative;
`;

const ContentHeaderTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #95ff45;
  /* ${(p) =>
    p.isExpanded ||
    css`
      visibility: hidden;
    `} */
`;

const MCTitleWrapper = styled.div`
  width: 1212px;
  height: auto;
  margin-top: 2px;
  border-radius: 18px;

  ${layerB}
  box-shadow: inset 0px 0px 3px #000000;
  ${flexBoxCenter}
  padding: 2px;

  position: relative;

  ${({ specificLocation, isLocation }) =>
    specificLocation
      ? css`
          width: 1210px;
          /* width: 1202px; */
          border-radius: 26px;
        `
      : isLocation &&
        css`
          width: 1208px;
          border-radius: 26px;
        `}

  ${(p) =>
    p.isExpanded &&
    css`
      border-radius: 22px 22px 14px 14px;
    `}
`;
const MCTitleInnerWrapper = styled.div`
  width: 1208px;
  height: auto;
  border-radius: 16px;

  ${layerA180Deg};
  ${flexBoxCenter}
  flex-direction: column;
  padding: 5px;

  ${({ specificLocation, isLocation }) =>
    specificLocation
      ? css`
          /* width: 1196px; */
          width: 1208px;
          border-radius: 22px;
        `
      : isLocation &&
        css`
          width: 1204px;
          border-radius: 22px;
        `}

  ${(p) =>
    p.isExpanded &&
    css`
      border-radius: 20px 20px 12px 12px;
    `}
`;

const SubLocationContentHeaderTitle = styled.span`
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
  top: 43%;
  left: 18%;
  z-index: 100;
`;

// New Two-Panel Layout Styled Components
const TwoPanelContainer = styled.div`
  display: flex;
  width: 1216px;
  gap: 8px;
  margin-top: 8px;
`;

const LeftPanel = styled.div`
  flex: 0 0 280px;
  ${flexDirectionColumn};
  gap: 8px;
`;

const RightPanel = styled.div`
  flex: 1;
  border-radius: 18px;
  ${layerC};
  ${flexBoxCenter};
  padding: 16px;
  min-height: 600px;
`;

const ZonesListContainer = styled.div`
  ${flexDirectionColumn};
  gap: 6px;
  border-radius: 18px;
  ${layerC};
  padding: 8px;
  max-height: 700px;
  overflow-y: auto;
`;

const ZoneItem = styled.div`
  border-radius: 12px;
  ${layerA180Deg};
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(2px);
  }
`;

const ZoneItemTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: #95ff45;
  margin-bottom: 3px;
  word-break: break-word;
`;

const ZoneItemCount = styled.div`
  font-size: 10px;
  letter-spacing: 0.8px;
  color: #fff;
  opacity: 0.7;
`;

const SwitchesListContainer = styled.div`
  ${flexDirectionColumn};
  gap: 6px;
  border-radius: 18px;
  ${layerC};
  padding: 8px;
  max-height: 700px;
  overflow-y: auto;
`;

const BackButton = styled.button`
  border-radius: 10px;
  ${layerBDark};
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  color: #fff;
  font-size: 11px;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  margin-bottom: 6px;

  &:hover {
    ${layerB};
    transform: translateX(-2px);
  }
`;

const SwitchItem = styled.div`
  border-radius: 10px;
  ${(p) => p.active ? layerB : layerA180Deg};
  padding: 8px 12px;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 1px;
  color: ${(p) => p.active ? '#95ff45' : '#fff'};
  transition: all 0.2s ease;
  border: ${(p) => p.active ? '2px solid #95ff45' : '2px solid transparent'};
  word-break: break-word;

  &:hover {
    ${layerB};
    color: #95ff45;
  }
`;

const SubLocationItem = styled.div`
  border-radius: 10px;
  ${layerA180Deg};
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(2px);
  }
`;

const SubLocationTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: #ff920c;
  margin-bottom: 3px;
  word-break: break-word;
`;

const SubLocationCount = styled.div`
  font-size: 9px;
  letter-spacing: 0.8px;
  color: #fff;
  opacity: 0.7;
`;

const PlaceholderContainer = styled.div`
  ${flexBoxCenter};
  width: 100%;
  height: 100%;
`;

const PlaceholderText = styled.div`
  font-size: 16px;
  letter-spacing: 1.4px;
  color: #fff;
  opacity: 0.5;
  text-align: center;
`;

// const handleControllerInHead = (btn, state, location, temp) => {

//   if (btn === 'instantHeat') {
//     if (swtName === 'ess') {
//       if (state === 'on') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(handleInstantHeat({ location, machine, temp, isF }));
//         // });
//         loopMachinesAndDispatchHandler(
//           'instantHeatOn',
//           location,
//           temp,
//           handleInstantHeat,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateSwitchesMasterControlService(machineIds, 'ESS', {
//         //       commandNumber: commandNumber,
//         //       instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
//         //       on_switch: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(handleInstantHeatOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           handleInstantHeatOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateSwitchesMasterControlService(machineIds, 'ESS', {
//         //       commandNumber: commandNumber,
//         //       on_switch: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     } else if (swtName === 'tgs') {
//       if (state === 'on') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tgsHandleInstantHeat({ location, machine, temp, isF }));
//         // });
//         loopMachinesAndDispatchHandler(
//           'instantHeatOn',
//           location,
//           temp,
//           tgsHandleInstantHeat,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TGS', {
//         //       commandNumber: commandNumber,
//         //       instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
//         //       on_switch: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tgsHandleInstantHeatOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tgsHandleInstantHeatOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TGS', {
//         //       commandNumber: commandNumber,
//         //       on_switch: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     } else {
//       if (state === 'on') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tesHandleInstantHeat({ location, machine, temp, isF }));
//         // });
//         loopMachinesAndDispatchHandler(
//           'instantHeatOn',
//           location,
//           temp,
//           tesHandleInstantHeat,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TES', {
//         //       commandNumber: commandNumber,
//         //       instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
//         //       on_switch: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tesHandleInstantHeatOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tesHandleInstantHeatOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TES', {
//         //       commandNumber: commandNumber,
//         //       on_switch: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     }
//   } else if (btn === 'snowSensor') {
//     // snowSensor
//     if (swtName === 'ess') {
//       if (state === 'off') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(handleSnowSensorOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           handleSnowSensorOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateSwitchesMasterControlService(machineIds, 'ESS', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(handleSnowSensor({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           handleSnowSensor,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateSwitchesMasterControlService(machineIds, 'ESS', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     } else if (swtName === 'tgs') {
//       if (state === 'off') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tgsHandleSnowSensorOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tgsHandleSnowSensorOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TGS', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tgsHandleSnowSensor({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tgsHandleSnowSensor,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TGS', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     } else {
//       if (state === 'off') {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tesHandleSnowSensorOff({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tesHandleSnowSensorOff,
//           swtName
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TES', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 0,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       } else {
//         // let machineIds = [];
//         // Object.keys(switchStatus[location]).forEach((machine) => {
//         //   machineIds.push(switchStatus[location][machine].deviceMac);
//         //   dispatch(tesHandleSnowSensor({ location, machine }));
//         // });
//         loopMachinesAndDispatchHandler(
//           false,
//           location,
//           null,
//           tesHandleSnowSensor,
//           swtName,
//           true
//         );
//         // getCommandNumberService('FAST_MASTER_CONTROL').then(
//         //   (commandNumber) => {
//         //     updateBlowersMasterControlService(machineIds, 'TES', {
//         //       commandNumber: commandNumber,
//         //       snow_enabled: 1,
//         //       actionType: 'FAST_MASTER_CONTROL',
//         //     });
//         //   }
//         // );
//       }
//     }
//   } else if (btn === 'fanOnly') {

//     if (state === 'off') {
//       // let machineIds = [];
//       // Object.keys(switchStatus[location]).forEach((machine) => {
//       //   machineIds.push(switchStatus[location][machine].deviceMac);
//       //   dispatch(tgsHandleFanOnly({ location, machine, state: false }));
//       // });
//       loopMachinesAndDispatchHandler(
//         'fanOnly',
//         location,
//         false,
//         tgsHandleFanOnly,
//         swtName
//       );
//       // getCommandNumberService('FAST_MASTER_CONTROL').then((commandNumber) => {
//       //   updateBlowersMasterControlService(machineIds, 'TGS', {
//       //     commandNumber: commandNumber,
//       //     fan: 0,
//       //     actionType: 'FAST_MASTER_CONTROL',
//       //   });
//       // });
//     } else {
//       // let machineIds = [];
//       // Object.keys(switchStatus[location]).forEach((machine) => {
//       //   machineIds.push(switchStatus[location][machine].deviceMac);
//       //   dispatch(tgsHandleFanOnly({ location, machine, state: true }));
//       // });
//       loopMachinesAndDispatchHandler(
//         'fanOnly',
//         location,
//         true,
//         tgsHandleFanOnly,
//         swtName,
//         true
//       );
//       // getCommandNumberService('FAST_MASTER_CONTROL').then((commandNumber) => {
//       //   updateBlowersMasterControlService(machineIds, 'TGS', {
//       //     commandNumber: commandNumber,
//       //     fan: 1,
//       //     actionType: 'FAST_MASTER_CONTROL',
//       //   });
//       // });
//     }
//   }
// };

// const openLocation = () => {
//   if (switchType === 'ess') {
//     openLocationHandler(
//       switchType,
//       essSwitch,
//       locationId,
//       machineId,
//       handleEssInitialState,
//       handleOpenMachineController
//     );
//     // dispatch(
//     //   handleOpenMasterControl({ swtName: switchType, status: false })
//     // );
//     // const locationArr = Object.keys(essSwitch).map(
//     //   (location) => location === locationId
//     // );
//     // dispatch(handleEssInitialState(locationArr));
//     // Object.keys(essSwitch).map((location) =>
//     //   Object.keys(essSwitch[location]).map((machine) =>
//     //     dispatch(
//     //       handleOpenMachineController({ location, machine, status: false })
//     //     )
//     //   )
//     // );

//     // if (machineId) {
//     //   dispatch(
//     //     handleOpenMachineController({
//     //       location: locationId,
//     //       machine: machineId,
//     //       status: true,
//     //     })
//     //   );
//     // }
//   } else if (switchType === 'tgs') {
//     openLocationHandler(
//       switchType,
//       tgsSwitch,
//       locationId,
//       machineId,
//       handleTgsInitialState,
//       tgsHandleOpenMachineController
//     );
//     // dispatch(
//     //   handleOpenMasterControl({ swtName: switchType, status: false })
//     // );
//     // const locationArr = Object.keys(tgsSwitch).map(
//     //   (location) => location === locationId
//     // );
//     // dispatch(handleTgsInitialState(locationArr));
//     // Object.keys(tgsSwitch).map((location) =>
//     //   Object.keys(tgsSwitch[location]).map((machine) =>
//     //     dispatch(
//     //       tgsHandleOpenMachineController({
//     //         location,
//     //         machine,
//     //         status: false,
//     //       })
//     //     )
//     //   )
//     // );

//     // if (machineId) {
//     //   dispatch(
//     //     tgsHandleOpenMachineController({
//     //       location: locationId,
//     //       machine: machineId,
//     //       status: true,
//     //     })
//     //   );
//     // }
//   } else if (switchType === 'tes') {
//     openLocationHandler(
//       switchType,
//       tesSwitch,
//       locationId,
//       machineId,
//       handleTesInitialState,
//       tesHandleOpenMachineController
//     );

//     // dispatch(
//     //   handleOpenMasterControl({ swtName: switchType, status: false })
//     // );
//     // const locationArr = Object.keys(tesSwitch).map(
//     //   (location) => location === locationId
//     // );
//     // dispatch(handleTesInitialState(locationArr));
//     // Object.keys(tesSwitch).map((location) =>
//     //   Object.keys(tesSwitch[location]).map((machine) =>
//     //     dispatch(
//     //       tesHandleOpenMachineController({
//     //         location,
//     //         machine,
//     //         status: false,
//     //       })
//     //     )
//     //   )
//     // );

//     // if (machineId) {
//     //   dispatch(
//     //     tesHandleOpenMachineController({
//     //       location: locationId,
//     //       machine: machineId,
//     //       status: true,
//     //     })
//     //   );
//     // }
//   }
//   const targetElement = document.getElementById(locationId);
//   if (targetElement) {
//     targetElement.scrollIntoView({ behavior: 'smooth' });
//   }
// };
