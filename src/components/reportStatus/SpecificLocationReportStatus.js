import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA } from '../styles/commonStyles';
import System from './system/System';
import { useEffect, useState } from 'react';
import WeatherBox from '../commonComponentsMC/WeatherBox';
import TitleBar from './TitleBar';
import {
  getFaultsAlertsHandler,
  getWifiAlertStatusHandler,
} from '../../helpers/helpers';

const SpecificLocationReportStatus = ({
  specificLocations,
  specLocationKey,
  specLocationValue,
  specificLocationIdx,
  location,
  // locationIndex,
  locationKey,
}) => {
  // const machines = Object.entries(Object.values(specLocationValue));
  const specificLocationData = specLocationValue;
 
  // const filteredMachines = machines.filter((el) => el[1].length > 0);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [totalMachines, setTotalMachines] = useState(0);
  const [faults, setFaults] = useState([]);
  const [systemEbp, setSystemEbp] = useState([]);
  const [systemGp, setSystemGp] = useState([]);
  const [isWeatherForecast, setIsWeatherForecast] = useState(false);

  useEffect(() => {
    // ****logic to set fault to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes has a fault, it must be displayed on the system
    const { filteredData, faultsState } =
      getFaultsAlertsHandler(specLocationValue);
  
    setFilteredMachines(filteredData);
    setFaults(faultsState);
const total = filteredData.reduce((acc, [, systemData]) => {
  if (Array.isArray(systemData.machines)) {
    return acc + systemData.machines.length;
  } else if (Array.isArray(systemData)) {
    return acc + systemData.length;
  }
  return acc;
}, 0);
setTotalMachines(total);

    // ************* logic to set ebp  to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on ebp, it must be displayed on the system

    const essEbp = getWifiAlertStatusHandler(
      'essSwitches',
      'isEbp',
      specificLocationData,
      true,
      true
    );

    const tgsEbp = getWifiAlertStatusHandler(
      'tgsSwitches',
      'isEbp',
      specificLocationData,
      true,
      true
    );

    const tesEbp = getWifiAlertStatusHandler(
      'tesSwitches',
      'isEbp',
      specificLocationData,
      true,
      true
    );

    const combinedEbp = [...essEbp, ...tgsEbp, ...tesEbp];

    setSystemEbp(combinedEbp);

    // ******logic to set gp to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on gp, it must be displayed on the system

    const essGp = getWifiAlertStatusHandler(
      'essSwitches',
      'isGp',
      specificLocationData,
      true,
      true
    );

    const tgsGp = getWifiAlertStatusHandler(
      'tgsSwitches',
      'isGp',
      specificLocationData,
      true,
      true
    );

    const tesGp = getWifiAlertStatusHandler(
      'tesSwitches',
      'isGp',
      specificLocationData,
      true,
      true
    );

    const combinedGp = [...essGp, ...tgsGp, ...tesGp];

    setSystemGp(combinedGp);
  }, [specificLocationData]);

  // console.log('SystemGp:', systemGp);
  // console.log('SystemEbp:', systemEbp);
  // useEffect(() => {
  //   // ****logic to set fault to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes has a fault, it must be displayed on the system

  //   // const filteredResult = machines.filter(
  //   //   (switchEl) => switchEl[1].length > 0
  //   // );

  //   // const faultsArr = [];
  //   const faultsState = filteredMachines.map((el) => {
  //     return el[1].some((el) => {
  //       return Object.values(el)[0].gpEbpWifiAlertStatus.isFault === true;
  //     });
  //   });

  //   // faultsArr.push(faultsState);

  //   setFaults(faultsState);

  //   // ************* logic to set ebp  to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on ebp, it must be displayed on the system

  //   //   const ebpOfEachSystem = [];

  //   //   const essEbp =
  //   //     Object.values(location)[0].essSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .essSwitches.map((el) =>
  //   //             Object.values(el).some(
  //   //               (isEbp) => isEbp.gpEbpWifiAlertStatus.isEbp
  //   //             )
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (essEbp !== null) {
  //   //     ebpOfEachSystem.push(essEbp);
  //   //   }

  //   //   const tgsEbp =
  //   //     Object.values(location)[0].tgsSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .tgsSwitches.map((el) =>
  //   //             Object.values(el).some(
  //   //               (isEbp) => isEbp.gpEbpWifiAlertStatus.isEbp
  //   //             )
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (tgsEbp !== null) {
  //   //     ebpOfEachSystem.push(tgsEbp);
  //   //   }

  //   //   const tesEbp =
  //   //     Object.values(location)[0].tesSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .tesSwitches.map((el) =>
  //   //             Object.values(el).some(
  //   //               (isEbp) => isEbp.gpEbpWifiAlertStatus.isEbp
  //   //             )
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (tesEbp !== null) {
  //   //     ebpOfEachSystem.push(tesEbp);
  //   //   }

  //   //   setSystemEbp(ebpOfEachSystem);

  //   //   // ******logic to set gp to be active shown either on ess, tgs or tes. if one of the machine under the system of ess, tgs or tes is running on gp, it must be displayed on the system

  //   //   const gpOfEachSystem = [];

  //   //   const essGp =
  //   //     Object.values(location)[0].essSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .essSwitches.map((el) =>
  //   //             Object.values(el).some((isGp) => isGp.gpEbpWifiAlertStatus.isGp)
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (essGp !== null) {
  //   //     gpOfEachSystem.push(essGp);
  //   //   }

  //   //   const tgsGp =
  //   //     Object.values(location)[0].tgsSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .tgsSwitches.map((el) =>
  //   //             Object.values(el).some((isGp) => isGp.gpEbpWifiAlertStatus.isGp)
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (tgsGp !== null) {
  //   //     gpOfEachSystem.push(tgsGp);
  //   //   }

  //   //   const tesGp =
  //   //     Object.values(location)[0].tesSwitches.length > 0
  //   //       ? Object.values(location)[0]
  //   //           .tesSwitches.map((el) =>
  //   //             Object.values(el).some((isGp) => isGp.gpEbpWifiAlertStatus.isGp)
  //   //           )
  //   //           .some((value) => value)
  //   //       : null;

  //   //   if (tesGp !== null) {
  //   //     gpOfEachSystem.push(tesGp);
  //   //   }

  //   //   setSystemGp(gpOfEachSystem);
  // }, [location]);

  // const getWifiAlertStatusHandler = (switchData, accessKey) => {
  //   const ebpOfEachSystem = [];

  //   const essEbp =
  //     Object.values(location)[0].essSwitches.length > 0
  //       ? Object.values(location)[0]
  //           .essSwitches.map((el) =>
  //             Object.values(el).some(
  //               (isEbp) => isEbp.gpEbpWifiAlertStatus.isEbp
  //             )
  //           )
  //           .some((value) => value)
  //       : null;

  //   if (essEbp !== null) {
  //     ebpOfEachSystem.push(essEbp);
  //   }
  // };

  return (
    <Wrapper>
      {isWeatherForecast && (
        <WeatherBoxWrapper>
          <WeatherBox
            handleCloseWeatherBox={setIsWeatherForecast}
            locationId={locationKey}
            specificLocationId={specLocationKey}
          />
        </WeatherBoxWrapper>
      )}
      <SpecificLocationWrapper zeroSW={filteredMachines.length === 0}>
        <TitleBarWrapper>
          <TitleBar
            location={location}
            handleCloseWeatherBox={setIsWeatherForecast}
            specificLocationKey={specLocationKey}
            machinesTotal={totalMachines}
          />
        </TitleBarWrapper>

        {filteredMachines?.map((el, idx) => {
          return (
            <SystemWrapper key={idx}>
              <System
                // mainIndex={locationIndex}
                systemIndex={idx}
                switchMachines={el}
                isFault={faults.length > 0 && faults}
                // location={location}
                systemEbp={systemEbp}
                systemGp={systemGp}
                locationId={locationKey}
                specificLocationId={specLocationKey}
              />
            </SystemWrapper>
          );
        })}
      </SpecificLocationWrapper>
    </Wrapper>
  );
};

export default SpecificLocationReportStatus;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const WeatherBoxWrapper = styled.div`
  position: absolute;
  z-index: 10;
`;

const SpecificLocationWrapper = styled.div`
  width: 1192px;
  height: auto;
  ${({ zeroSW }) =>
    zeroSW
      ? css`
          border-radius: 18px;
        `
      : css`
          border-radius: 18px 18px 37px 37px;
        `}

  ${layerA};
  ${flexBoxCenter};
  margin-top: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  flex-direction: column;
  gap: 8px;
`;

const TitleBarWrapper = styled.div`
  width: 1188px;
  height: 32px;
`;

const SystemWrapper = styled.div`
  width: 1188px;
  min-height: 71px;
`;
