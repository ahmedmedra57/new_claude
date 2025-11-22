import styled from 'styled-components';
import { flexBoxCenter, layerA } from '../styles/commonStyles';
import System from './system/System';
import { useEffect, useState } from 'react';
import WeatherBox from '../commonComponentsMC/WeatherBox';
import TitleBar from './TitleBar';
import SpecificLocationReportStatus from './SpecificLocationReportStatus';
import {
  getFaultsAlertsHandler,
  getWifiAlertStatusHandler,
} from '../../helpers/helpers';

const EachLocationReportStatus = ({
  location,
  mainIndex,
  // allLocations,
  // isHover,
  // setIsHover,
}) => {
  const [locationId] = Object.keys(location);
  const [faults, setFaults] = useState([]);
  const [systemEbp, setSystemEbp] = useState([]);
  const [systemGp, setSystemGp] = useState([]);
  const [isWeatherForecast, setIsWeatherForecast] = useState(false);
  const [parentLocationId, setParentLocationId] = useState(null);
  const [displaySpecificLocations, setDisplaySpecificLocations] =
    useState(false);
  const [filteredSwitches, setFilteredSwitches] = useState([]);

  let isSpecificLocation;
  Object.values(location).forEach((el) => {
    Object.keys(el).forEach((key) => {
      el[key].forEach((item) => {
        isSpecificLocation = Object.keys(item).includes('subLocationName');
      });
    });
    // isSpecificLocation = Object.keys(el).includes('essSwitches');
  });

  let switches = [];
  let specificLocations = [];
  let filteredSystems = [];
  if (!isSpecificLocation) {
    switches = Object.entries(Object.values(location)[0]);
  } else {
    let allSystems = [];

    specificLocations = Object.values(location).map((locationData) => {
      const subLocations = {};
      Object.keys(locationData).forEach((key) => {
        locationData[key].map((sub) => {
          if (!subLocations[sub.subLocationName]) {
            subLocations[sub.subLocationName] = [];
          }
          subLocations[sub.subLocationName].push([
            key,
            sub.machines.map((el) => ({ [el.machineName]: el.machineDetails })),
          ]);
        });
      });
      const result = Object.entries(locationData);
      return subLocations;
    });
    Object.values(location).forEach((locationData) => {
      const result = Object.entries(locationData);
      filteredSystems = result.reduce((acc, system) => {
        const machines = system[1]
          .filter((subLocation) => subLocation.machines.length)
          .flatMap((subLocation) => subLocation.machines);
        return machines.length
          ? [
              ...acc,
              [
                system[0],
                machines.map((el) => ({ [el.machineName]: el.machineDetails })),
              ],
            ]
          : acc;
      }, []);
    });

    // filteredSystems = allSystems
    //   .reduce((acc, system) => acc.concat(system), [])
    //   .reduce((acc, [mainKey, value]) => {
    //     if (value.length > 0) {
    //       const existingValue = acc.find(([key]) => key === mainKey);
    //       if (existingValue) {
    //         const [, existingArray] = existingValue;
    //         return acc.map(([key, array]) =>
    //           key === mainKey
    //             ? [key, existingArray.concat(value)]
    //             : [key, array]
    //         );
    //       } else {
    //         return [...acc, [mainKey, value]];
    //       }
    //     }
    //     return acc;
    //   }, []);
  }

  //TODO-Revisit-///////////////////////////////

  // const specificLocationKeyForWeather =
  //   specificLocations.length > 0 && specificLocations[0][0];

  // const filteredSwitches = switches.filter((el) => el[1].length > 0);

  // const [isHover, setIsHover] = useState([]);

  // const { setSwitchIsExpand } = useContext(ReportStatusContext);

  // const createInitStateHandler = useCallback(() => {
  //   const newArrLocations = [...allLocations];
  //   return newArrLocations.map((location) => {
  //     const newValue = Object.values(Object.values(location)[0]).filter(
  //       (value) => value.length > 0
  //     );
  //     return newValue.map((el) => Object.keys(el).fill(false));
  //   });
  // }, [allLocations]);

  // useEffect(() => {
  //   //*****  creates the arrays for the locations/systems/switches and sets them to false to be used for expand and close of each switch

  //   const createSwitchBtnExpandState = createInitStateHandler();

  //   //****  creates the arrays for the locations/systems/switches and sets them to 'expand' to be used as expand Btn name(its either expand or close) and for each switch

  //   // const createSwitchBtnExpandName = createInitStateHandler('expand');

  //   // ******* creates array fill with 'false' for hover effect on alert icon
  //   const copyAllLocations = [...allLocations];
  //   const newHoverArr = copyAllLocations.map((location) => {
  //     const falseArr = [];
  //     Object.values(Object.values(location)[0]).forEach((value) => {
  //       if (value.length > 0) {
  //         falseArr.push(false);
  //       }
  //     });
  //     return falseArr;
  //   });

  //   setIsHover(newHoverArr);
  //   setSwitchIsExpand(createSwitchBtnExpandState);
  //   // setSwitchExpandBtnName(createSwitchBtnExpandName);
  // }, [allLocations]);
  // console.log('allLocations:', allLocations);
  // console.log('switches:', switches);
  // console.log('specificLocations:', specificLocations);
  // const filteredSystemsData = specificLocations.flatMap(([_, switchesEl]) =>
  //   Object.entries(switchesEl)
  // );
  // console.log('!!!+++:', filteredSystemsData);

  // const getFaultsAlertsHandler = (data) => {
  //   // const faultsArr = [];
  //   const array = data.filter((switchEl) => switchEl[1].length > 0);

  //   const faultsState = array.map((el) => {
  //     return el[1].some((el) => {
  //       return Object.values(el)[0].gpEbpWifiAlertStatus.isFault === true;
  //     });
  //   });

  //   // faultsArr.push(faultsState);

  //   setFaults(faultsState);
  // };

  useEffect(() => {
    // ****logic to set fault to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes has a fault, it must be displayed on the system
    if (!isSpecificLocation) {
      const { faultsState, filteredData } = getFaultsAlertsHandler(switches);
      setFaults(faultsState);
      setFilteredSwitches(filteredData);
    }
    // else {
    //   // const filteredSystemsData = specificLocations.flatMap(([_, switchesEl]) =>
    //   //   Object.entries(switchesEl)
    //   // );
    //   // const { faultsState, filteredData } =
    //   //   getFaultsAlertsHandler(specificLocations);
    //   // setFaults(faultsState);
    //   // setFilteredSwitches(filteredData);
    // }

    // ************* logic to set ebp  to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on ebp, it must be displayed on the system

    const essEbp = getWifiAlertStatusHandler(
      'essSwitches',
      'isEbp',
      location,
      !isSpecificLocation
    );

    const tgsEbp = getWifiAlertStatusHandler(
      'tgsSwitches',
      'isEbp',
      location,
      !isSpecificLocation
    );

    const tesEbp = getWifiAlertStatusHandler(
      'tesSwitches',
      'isEbp',
      location,
      !isSpecificLocation
    );

    const combinedEbp = [...essEbp, ...tgsEbp, ...tesEbp];

    setSystemEbp(combinedEbp);

    // ******logic to set gp to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on gp, it must be displayed on the system

    const essGp = getWifiAlertStatusHandler(
      'essSwitches',
      'isGp',
      location,
      !isSpecificLocation
    );

    const tgsGp = getWifiAlertStatusHandler(
      'tgsSwitches',
      'isGp',
      location,
      !isSpecificLocation
    );

    const tesGp = getWifiAlertStatusHandler(
      'tesSwitches',
      'isGp',
      location,
      !isSpecificLocation
    );

    const combinedGp = [...essGp, ...tgsGp, ...tesGp];

    setSystemGp(combinedGp);
  }, [location]);

  // const getWifiAlertStatusHandler = useCallback(
  //   (switchData, accessKey) => {
  //     const gpEbpArray = [];
  //     let gpEbpState = null;

  //     if (isSpecificLocation) {
  //       gpEbpState =
  //         Object.values(location)[0][switchData]?.length > 0
  //           ? Object.values(location)[0]
  //               [switchData].map((el) =>
  //                 Object.values(el).some(
  //                   (gpEbp) => gpEbp.gpEbpWifiAlertStatus[accessKey]
  //                 )
  //               )
  //               .some((value) => value)
  //           : null;
  //     } else {
  //       gpEbpState = Object.values(location)
  //         .flatMap((specificLocationEl) => {
  //           const systemData = Object.values(specificLocationEl)[0][switchData];

  //           return systemData?.length > 0
  //             ? systemData
  //                 .map(
  //                   (machine) =>
  //                     Object.values(machine)[0].gpEbpWifiAlertStatus[accessKey]
  //                 )
  //                 .some((status) => status)
  //             : null;
  //         })
  //         .some((value) => value);
  //     }

  //     if (gpEbpState !== null) {
  //       gpEbpArray.push(gpEbpState);
  //     }
  //     return gpEbpArray;
  //   },
  //   [location]
  // );

  const displaySpecificLocationsHandler = (locationId) => {
    setDisplaySpecificLocations((prev) => !prev);
    setParentLocationId(locationId);
  };

  const displayWithSpecificLocationSystems = (
    <SystemBaseLayer1>
      <SystemBaseLayer2>
        <SystemWrapper>
          {filteredSystems.map((system, systemIdx) => {
            return (
              <System
                key={system}
                systemIndex={systemIdx}
                switchMachines={system}
                isFault={faults.length > 0 && faults}
                systemEbp={systemEbp}
                systemGp={systemGp}
                locationId={locationId}
                withSpecificLocations={true}
                // mainIndex={mainIndex}
                // location={location}
              />
            );
          })}
        </SystemWrapper>
        {displaySpecificLocations &&
          specificLocations.map((specificLocation, specificLocationIdx) => {
            return Object.keys(specificLocation).map(
              (specificLocationKey, specificLocationId) => {
                const specLocationValue = specificLocation[specificLocationKey];
                return (
                  <SpecificLocationReportStatus
                    key={specificLocationKey}
                    // specificLocations={specificLocation}
                    specLocationKey={specificLocationKey}
                    specLocationValue={specLocationValue}
                    specificLocationIdx={specificLocationId}
                    location={location}
                    locationKey={locationId}
                    // locationIndex={mainIndex}
                  />
                );
              }
            );
          })}
      </SystemBaseLayer2>
    </SystemBaseLayer1>
  );

  const displayOnlyLocationSystems = (
    <SystemBaseLayer1>
      <SystemBaseLayer2>
        <SystemWrapper>
          {filteredSwitches?.map((el, idx) => {
            return (
              <System
                key={el}
                mainIndex={mainIndex}
                systemIndex={idx}
                switchMachines={el}
                isFault={faults.length > 0 && faults}
                // location={location}
                systemEbp={systemEbp}
                systemGp={systemGp}
                locationId={locationId}
              />
            );
          })}
        </SystemWrapper>
      </SystemBaseLayer2>
    </SystemBaseLayer1>
  );

  // **** handles 'isHover' state thats above that control the appearance of FaultsReportHoverBox.js
  // const handleHover = (locationIdx, swtIdx, boolean) => {
  //   const copyIsHover = [...isHover];
  //   copyIsHover[locationIdx][swtIdx] = boolean;
  //   setIsHover(copyIsHover);
  // };

  // console.log('specificLocations:', specificLocations);
  // console.log('filteredSwitches:', filteredSwitches);

  return (
    <Wrapper>
      {isWeatherForecast && (
        <WeatherBoxWrapper>
          <WeatherBox
            handleCloseWeatherBox={setIsWeatherForecast}
            locationId={locationId}
            // specificLocationId={specificLocationKeyForWeather}
          />
        </WeatherBoxWrapper>
      )}
      <LocationBaseLayer>
        <LocationWrapper>
          <TitleBarWrapper>
            <TitleBar
              expandSpecificLocations={displaySpecificLocations}
              expandButtonHandler={displaySpecificLocationsHandler}
              location={location}
              handleCloseWeatherBox={setIsWeatherForecast}
              noSpecificLocation={!isSpecificLocation}
            />
          </TitleBarWrapper>
          {/* {filteredSwitches?.map((el, idx) => {
          return (
            <SystemWrapper key={el}>
              <System
                mainIndex={mainIndex}
                systemIndex={idx}
                switchMachines={el}
                isFault={faults.length > 0 && faults}
                location={location}
                systemEbp={systemEbp}
                systemGp={systemGp}
                // isHover={isHover}
                // handleHover={handleHover}
                locationId={locationId}
              />
            </SystemWrapper>
          );
        })} */}
          {!isSpecificLocation
            ? displayOnlyLocationSystems
            : displayWithSpecificLocationSystems}
        </LocationWrapper>
      </LocationBaseLayer>
    </Wrapper>
  );
};

export default EachLocationReportStatus;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  position: relative;
`;

const WeatherBoxWrapper = styled.div`
  position: absolute;
  z-index: 10;
`;

const LocationBaseLayer = styled.div`
  width: 1220px;
  height: auto;
  margin-bottom: 10px;
  padding: 2px;

  background: #233a54 0% 0%;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 19px 19px 40px 40px;

  ${flexBoxCenter}
`;

const LocationWrapper = styled.div`
  width: 1216px;
  height: auto;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 18px 18px 39px 39px;
  border: 0.5px solid #000000;

  ${layerA};
  ${flexBoxCenter};
  /* margin-top: 10px; */
  /* padding-top: 2px;
  padding-bottom: 1px; */
  flex-direction: column;
  gap: 2px;
`;

const TitleBarWrapper = styled.div`
  width: 1209px;
  height: 32px;
`;

const SystemBaseLayer1 = styled.div`
  width: 1210px;
  height: auto;
  min-height: 90px;
  padding: 2px;

  background: #233a54 0% 0%;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 13px 13px 37px 37px;

  ${flexBoxCenter}
`;

const SystemBaseLayer2 = styled.div`
  width: 100%;
  height: auto;
  min-height: 88px;
  padding: 5px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0%;
  box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 1px #000000;
  border: 0.5px solid #000000;
  border-radius: 11px 11px 35px 35px;

  ${flexBoxCenter}
  flex-direction: column;
`;

const SystemWrapper = styled.div`
  width: 1192px;
  height: auto;
  padding: 2px;
  /* min-height: 71px; */

  background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 2px #000000;
  border-radius: 37px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 6px;
`;
