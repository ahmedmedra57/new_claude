import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  readyTop180Deg,
  layerADisabled180Deg,
  layerBDisabled,
} from "../styles/commonStyles";
import testData from "../../test_data/testData";
import { getSpecificLocationNameOfALocation } from "../../helpers/helpers";

const SnowSensorMC = ({ location, buttonHandler, swtName, isMobile, disabled }) => {
  const {
    essSwitch,
    tgsSwitch,
    tesSwitch,
    flatEssSwitch,
    flatTesSwitch,
    flatTgsSwitch,
  } = useSelector(
    swtName === "ess"
      ? selectEssSwitch
      : swtName === "tgs"
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const switchStatus =
    swtName === "ess"
      ? flatEssSwitch
      : swtName === "tgs"
      ? flatTgsSwitch
      : flatTesSwitch;

  const switchStatusE =
    swtName === "ess" ? essSwitch : swtName === "tgs" ? tgsSwitch : tesSwitch;

  // !!TEST DATA
  // const { testEssSwitch, testTgsSwitch, testTesSwitch } = testData(
  //   essSwitch,
  //   tgsSwitch,
  //   null,
  //   tesSwitch
  // );
  // const switchStatus =
  //   swtName === 'ess'
  //     ? testEssSwitch
  //     : swtName === 'tgs'
  //     ? testTgsSwitch
  //     : testTesSwitch;

  // !! END OF TEST DATA

  const [isReady, setIsReady] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const verifySnowSensorHandler = (machines, status) => {
    return machines.every(
      (machine) =>
        switchStatus[machine.locationId][machine.machineId]?.snowSensor[status]
    );
  };
  const subLocationsIDs = switchStatusE[location]?.isSpecificLocation ? Object.keys(switchStatusE[location].subLocations) : [];

  useEffect(() => {
    const filteredSpecificLocation = getSpecificLocationNameOfALocation(
      switchStatus[location]
    );
    let isSnowSensorReady = false;
    let isSnowSensorActivated = false;
    let machines = [];
    if (switchStatusE[location]?.isSpecificLocation) {
      Object.keys(switchStatusE[location].subLocations).forEach(
        (subLocation) => {
          Object.keys(
            switchStatusE[location].subLocations[subLocation].devices
          ).forEach((machine) => {
            machines.push({ locationId: subLocation, machineId: machine });
          });
        }
      );
    } else {
      if (switchStatus[location]) {
        machines.push({
          locationId: location,
          machineId: Object.keys(switchStatus[location]),
        });
      }
    }
    if (machines.length === 0) {
      isSnowSensorActivated = false;
      isSnowSensorReady = false;
    } else {
      isSnowSensorReady = verifySnowSensorHandler(machines, "isReady");
      isSnowSensorActivated = verifySnowSensorHandler(machines, "isActivated");
    }
    if (isSnowSensorReady) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }

    if (isSnowSensorActivated) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [switchStatus[location], location,...subLocationsIDs.map((id) => switchStatus[id])]);

  const setButtonHandlerFC = (program, programStatus, location, temp) => {
    // const filteredSpecificLocation = getSpecificLocationNameOfALocation(
    //   switchStatus[location]
    // );
    buttonHandler(program, programStatus, location, temp);
  };

  const handleOnClick = () => {
    if (isReady || isActivated) {
      // turn off
      setButtonHandlerFC("snowSensor", "off", location, null);
    } else {
      setButtonHandlerFC("snowSensor", "on", location, null);
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileButton
          onClick={handleOnClick}
          isReady={isReady}
          isActivated={isActivated}
        >
          <MobileButtonTop isReady={isReady} isActivated={isActivated}>
            <Img src="/images/logo-snowSensor.svg" />
          </MobileButtonTop>
        </MobileButton>
      ) : (
        <Wrapper disabled={disabled}>
          <ButtonHole
            onClick={handleOnClick}
            isReady={isReady}
            isActivated={isActivated}
            disabled={disabled}
          >
            <IconHole isReady={isReady} isActivated={isActivated} disabled={disabled}>
              <IconInner isReady={isReady} isActivated={isActivated} disabled={disabled}>
                <IconTop isReady={isReady} isActivated={isActivated} disabled={disabled}>
                  <Img src="/images/logo-snowSensor.svg" />
                </IconTop>
              </IconInner>
            </IconHole>

            <ButtonInnerHole isActivated={isActivated} disabled={disabled}>
              <ButtonTop isReady={isReady} isActivated={isActivated} disabled={disabled}>
                snow sensor
              </ButtonTop>
            </ButtonInnerHole>
          </ButtonHole>
        </Wrapper>
      )}
    </>
  );
};

export default SnowSensorMC;

const MobileButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 26px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;

const MobileButtonTop = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 21px;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
    `}
`;

// -- for desk top
const Wrapper = styled.div`
  width: 207px;
  height: 30px;
  border-radius: 27px;
  ${layerB}
  ${flexBoxCenter}
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      cursor: not-allowed;
    `}
`;
const ButtonHole = styled.button`
  width: 205px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 2px 0 3px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const ButtonInnerHole = styled.div`
  width: 175px;
  height: 22px;
  border-radius: 20px;
  ${layerB}
  ${flexBoxCenter}
  ${(p) => p.isReady && css``}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const ButtonTop = styled.div`
  width: 173px;
  height: 20px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 8px;
  letter-spacing: 0.8px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;

const IconHole = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 20px;
  ${flexBoxCenter}
  ${layerB}
  ${(p) => p.isReady && css``}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;

const IconInner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const IconTop = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const Img = styled.img`
  height: 90%;
`;
