import { useEffect, useState } from "react";
import { import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../zustand-stores';


import styled, { css } from "styled-components";

  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerB,
  readyTop180Deg,
  layerBDisabled,
  layerADisabled180Deg,
} from "../styles/commonStyles";
import { isNumber } from "lodash";
import InputTempMessage from "../userMessages/inputTempMessage";
import {
  convertCelsiusToFahrenheit,
  convertFahrenheitToCelsius,
  getAllSpecificLocationNames,
  getSpecLocationHandler,
  getSpecificLocationNameOfALocation,
} from "../../helpers/helpers";
import testData from "../../test_data/testData";

const InstantHeatMC = ({ location, buttonHandler, swtName, isMobile, disabled }) => {
  // **** temporary value
  // const isF = false;
  // **** temporary value

  // Global Values
  const {
    essSwitch,
    tgsSwitch,
    tesSwitch,
    flatEssSwitch,
    flatTesSwitch,
    flatTgsSwitch,
  } = swtName === "ess"
      ? useESSSwitchStore()
      : swtName === "tgs"
      ? useTGSSwitchStore()
      : useTESSwitchStore();

  const switchStatus =
    swtName === "ess"
      ? flatEssSwitch
      : swtName === "tgs"
      ? flatTgsSwitch
      : flatTesSwitch;

  const switchStatusE =
    swtName === "ess"
      ? essSwitch
      : swtName === "tgs"
      ? tgsSwitch
      : tesSwitch;

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

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Local values
  const [inputTemp, setInputTemp] = useState("");
  const [isActivated, setIsActivated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFanOnlyActivated, setIsFanOnlyActivated] = useState(false);
  const [message, setMessage] = useState("");
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const programName = "instant heat";
  const verifyInstantHeatHandler = (machines, status) => {
      return machines.every(
        (machine) =>  switchStatus[machine.locationId][machine.machineId]?.instantHeat[status]
        
      );
  };

  const verifyIsFanOnlyHandler = (machines) => {
    return machines.every(
      (machine) => switchStatus[machine.locationId][machine.machineId]?.fanOnly
    );
  };
  const subLocationsIDs = switchStatusE[location]?.isSpecificLocation ? Object.keys(switchStatusE[location].subLocations) : [];
  // use Effect for display activated instant heat and their common temp.
  useEffect(() => {
    // for instant heat
    const filteredSpecificLocation = getSpecificLocationNameOfALocation(
      switchStatus[location]
    );
    let isInstantHeatActivated = false;
    let isInstantHeatReady = false;
    let isFanOnlyActivated = false;
    let machines = [];
    if(switchStatusE[location]?.isSpecificLocation){
      Object.keys(switchStatusE[location].subLocations).forEach((subLocation) => {
        Object.keys(switchStatusE[location].subLocations[subLocation].devices).forEach((machine) => {
          machines.push({machineId:machine,locationId:subLocation});
        })
      })
    }else{
      if (switchStatus[location]) {
          machines.push({machineId:Object.keys(switchStatus[location]),locationId:location});
      } 
    }
    if (machines.length === 0) {
      isInstantHeatReady = false;
      isInstantHeatActivated = false;
      if (swtName === "tgs") {
        isFanOnlyActivated = false;
      }
    } else {
      isInstantHeatActivated = verifyInstantHeatHandler(
        machines,
        "isActivated"
      );
      isInstantHeatReady = verifyInstantHeatHandler(machines, "isReady");
      if (swtName === "tgs") {
        isFanOnlyActivated = verifyIsFanOnlyHandler(machines);
      }
    }
    if (swtName === "tgs") {
      if (isFanOnlyActivated) {
        setIsFanOnlyActivated(true);
      } else {
        setIsFanOnlyActivated(false);
      }
    }
    if (isInstantHeatActivated || isInstantHeatReady) {
      if (isInstantHeatActivated) {
        setIsActivated(true);
        setIsReady(false);

      } else {
        setIsReady(true);
        setIsActivated(false);
      }

      // compare all inputTemps
      /*  const isSameInputTemp = Object.keys(switchStatus[location]).every(
        (machine, index) =>
          Object.values(switchStatus[location])[0]?.instantHeat?.inputTemp ===
          Object.values(switchStatus[location])[index]?.instantHeat?.inputTemp
      ); */

      /* if (isSameInputTemp) {
        const temp = isF
          ? `${
            +Object.values(switchStatus[location])[0]?.instantHeat?.inputTemp
            } °F`
          : `${
              Object.values(switchStatus[location])[0]?.instantHeat?.inputTemp
            } °C`;
        setInputTemp(isNumber(+temp.split(' ')[0]) ? temp : '---');
      } else {
        setInputTemp('');
      } */
    } else {
      setIsActivated(false);
      setIsReady(false);
    }

    //  fanOnly
    // if (swtName === 'tgs') {
    //   let isFanOnlyActivated = false;
    //   if (specificLocation) {
    //     isFanOnlyActivated =
    //       switchStatus[location] &&
    //       Object.keys(switchStatus[location]).length > 0 &&
    //       Object.keys(switchStatus[location]).every((machine) => {
    //         return switchStatus[location][machine].fanOnly;
    //       });
    //   } else if (filteredSpecificLocation.length > 0) {
    //     isFanOnlyActivated =
    //       switchStatus[location] &&
    //       Object.keys(switchStatus[location]).length > 0 &&
    //       Object.keys(switchStatus[location]).every((machine) => {
    //         return switchStatus[location][machine].fanOnly;
    //       });
    //   } else {
    //     isFanOnlyActivated =
    //       switchStatus[location] &&
    //       Object.keys(switchStatus[location]).length > 0 &&
    //       Object.keys(switchStatus[location]).every((machine) => {
    //         return switchStatus[location][machine].fanOnly;
    //       });
    //   }

    //   if (isFanOnlyActivated) {
    //     setIsFanOnlyActivated(true);
    //   } else {
    //     setIsFanOnlyActivated(false);
    //   }
    // }
  }, [isF, location, switchStatus,...subLocationsIDs.map((id) => switchStatusE[id])]);

  const setButtonHandlerFC = (program, programStatus, location, temp) => {
    const filteredSpecificLocation = getSpecificLocationNameOfALocation(
      switchStatus[location]
    );
    buttonHandler(program, programStatus, location, temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const temp = Number(inputTemp);
    //fahrenheit unit
    if (isActivated || isReady) {
      setButtonHandlerFC("instantHeat", "off", location, 0);
      setInputTemp("");
    } else {
      if (isF) {
        // fahrenheit unit
        if (temp >= 250 && temp <= 1830) {
          setButtonHandlerFC("instantHeat", "on", location, temp);
          // buttonHandler('instantHeat', 'on', location, temp, specificLocation);

          setInputTemp(`${temp} °C`);
        } else {
          handleMessage();
        }
      } else {
        // celsius unit
        if (temp >= 121 && temp <= 999) {
          setButtonHandlerFC("instantHeat", "on", location, temp);
          // buttonHandler(
          //   'instantHeat',
          //   'on',
          //   location,
          //   temp,
          //   specificLocation
          // );

          setInputTemp(`${temp} °F`);
        } else {
          handleMessage();
        }
      }
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const temp = Number(inputTemp);

  //   const filteredSpecificLocation = getSpecificLocationNameOfALocation(
  //     switchStatus[location]
  //   );

  //   if (isF) {
  //     //fahrenheit unit
  //     if (isActivated || isReady) {
  //       if (filteredSpecificLocation.length > 0 && !specificLocation) {
  //         filteredSpecificLocation.forEach((specLocation) =>
  //           buttonHandler('instantHeat', 'off', location, 0, specLocation)
  //         );
  //       } else {
  //         buttonHandler('instantHeat', 'off', location, 0, specificLocation);
  //       }
  //       setInputTemp('');
  //     } else {
  //       if (temp >= 250 && temp <= 1830) {
  //         if (filteredSpecificLocation.length > 0 && !specificLocation) {
  //           filteredSpecificLocation.forEach((specLocation) =>
  //             buttonHandler('instantHeat', 'on', location, temp, specLocation)
  //           );
  //         } else {
  //           buttonHandler(
  //             'instantHeat',
  //             'on',
  //             location,
  //             temp,
  //             specificLocation
  //           );
  //         }
  //         // buttonHandler('instantHeat', 'on', location, temp, specificLocation);
  //         // setInputTemp('---');
  //         setInputTemp(`${temp} °C`);
  //       } else {
  //         handleMessage();
  //       }
  //     }
  //   } else {
  //     //celsius unit
  //     if (isActivated || isReady) {
  //       buttonHandler('instantHeat', 'off', location, 0, specificLocation);
  //       setInputTemp('');
  //     } else {
  //       if (temp >= 121 && temp <= 999) {
  //         buttonHandler('instantHeat', 'on', location, temp, specificLocation);
  //         // setInputTemp('---');
  //         setInputTemp(`${temp} °F`);
  //       } else {
  //         handleMessage();
  //       }
  //     }
  //   }
  // };

  const handleFanOnly = () => {
    if (isFanOnlyActivated) {
      setButtonHandlerFC("fanOnly", "off", location, null);
    } else {
      setButtonHandlerFC("fanOnly", "on", location, null);
    }
    // if (isFanOnlyActivated) {
    //   buttonHandler('fanOnly', 'off', location, null, specificLocation);
    // } else {
    //   buttonHandler('fanOnly', 'on', location, null, specificLocation);
    // }
  };

  const handleMessage = () => {
    setMessage([
      `in order to finalize ${programName}, `,
      "please input your temperature",
      "( the minimum temperature is 121°C - 250°F )",
      "( the maximum temperature is 999°C - 1830°F )",
    ]);
    setOpenMessageBox(true);
  };

  const handleCloseMessage = () => {
    if (typeof inputTemp === "number") {
      if (isF) {
        setInputTemp(`${convertCelsiusToFahrenheit(inputTemp)} °F`);
      } else {
        setInputTemp(`${setInputTemp} °C`);
      }
    } else {
      setInputTemp("");
    }
    setOpenMessageBox(false);
  };

  return (
    <>
      {isMobile ? (
        <MobileWrapper isTgs={swtName === "tgs"}>
          <InstantHeatWrapperForm
            onSubmit={handleSubmit}
            swtName={swtName}
            isActivated={isActivated}
            isReady={isReady}
            disabled={disabled}
          >
            <ButtonHole
              isActivated={isActivated}
              isReady={isReady}
              onClick={handleSubmit}
              isMobile={isMobile}
              disabled={disabled}
            >
              <ButtonInner
                isActivated={isActivated}
                isReady={isReady}
                isMobile={isMobile}
              >
                <ButtonTop
                  isActivated={isActivated}
                  isReady={isReady}
                  isMobile={isMobile}
                >
                  <Img src="/images/logo-instantHeat.svg" />
                </ButtonTop>
              </ButtonInner>
            </ButtonHole>

            <TempInput
              isMobile={isMobile}
              type="text"
              onChange={(e) => setInputTemp(e.target.value)}
              value={inputTemp}
              placeholder={isF ? "0 °F" : "0 °C"}
              isActivated={isActivated}
              isReady={isReady}
            />
          </InstantHeatWrapperForm>

          {swtName === "tgs" && (
            <TgsMobileButtonHole
              isMobile={isMobile}
              isActivated={isFanOnlyActivated}
              onClick={handleFanOnly}
            >
              <TgsMobileButtonInner
                isActivated={isFanOnlyActivated}
                isMobile={isMobile}
              >
                <Img src="/images/tgs-fanOnly.svg" />
              </TgsMobileButtonInner>
            </TgsMobileButtonHole>
          )}
        </MobileWrapper>
      ) : (
        <Wrapper disabled={disabled}>
          {/* full screen */}
          <InnerWrapper
            isActivated={isActivated}
            isReady={isReady}
            swtName={swtName}
            disabled={disabled}
          >
            <ButtonAndInputForm onSubmit={handleSubmit} swtName={swtName} disabled={disabled}>
              <ButtonHole
                isActivated={isActivated}
                isReady={isReady}
                onClick={handleSubmit}
                disabled={disabled}
              >
                <ButtonInner isActivated={isActivated} isReady={isReady} disabled={disabled}>
                  <ButtonTop isActivated={isActivated} isReady={isReady} disabled={disabled}>
                    <Img src="/images/logo-instantHeat.svg" />
                  </ButtonTop>
                </ButtonInner>
              </ButtonHole>

              <TempInput
                type="text"
                onChange={(e) => setInputTemp(e.target.value)}
                value={inputTemp}
                placeholder={isF ? "0 °F" : "0 °C"}
                isActivated={isActivated}
                isReady={isReady}
                disabled={disabled}
              />

              <ActiveButtonHole
                onClick={handleSubmit}
                isActivated={isActivated}
                isReady={isReady}
                swtName={swtName}
                disabled={disabled}
              >
                <ACtiveButtonTop
                  isActivated={isActivated}
                  isReady={isReady}
                  swtName={swtName}
                  disabled={disabled}
                >
                  instant heat
                </ACtiveButtonTop>
              </ActiveButtonHole>
            </ButtonAndInputForm>

            {swtName === "tgs" && (
              <ButtonHole
                isActivated={isFanOnlyActivated}
                onClick={handleFanOnly}
                disabled={disabled}
              >
                <ButtonInner isActivated={isFanOnlyActivated} disabled={disabled}>
                  <ButtonTop isActivated={isFanOnlyActivated} disabled={disabled}>
                    <Img src="/images/tgs-fanOnly.svg" />
                  </ButtonTop>
                </ButtonInner>
              </ButtonHole>
            )}
            {openMessageBox && (
              <MessageBoxWrapper>
                <InputTempMessage
                  onClose={handleCloseMessage}
                  messages={message}
                  title={programName}
                />
              </MessageBoxWrapper>
            )}
          </InnerWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default InstantHeatMC;

const MobileWrapper = styled.div`
  height: 100%;

  ${(p) =>
    p.isTgs
      ? css`
          width: 149px;
          ${justifyContentSpaceBetween}
        `
      : css`
          ${flexBoxCenter}
        `}
`;

const InstantHeatWrapperForm = styled.form`
  width: 94px;
  height: 42px;
  border-radius: 26px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
padding: 0 3px 0 2px;

  ${({ isActivated, isReady }) =>
    isActivated
      ? css`
          ${activeLayer180Deg}
        `
      : isReady &&
        css`
          ${readyTop180Deg}
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      cursor: not-allowed;
    `}
`;

//  -- for desk top

const Wrapper = styled.div`
  width: 208px;
  height: 30px;
  border-radius: 27px;

  ${layerB};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      cursor: not-allowed;
    `}
`;
const InnerWrapper = styled.div`
  width: 206px;
  height: 28px;
  border-radius: 25px;

  ${layerA180Deg};
  ${(p) =>
    p.swtName === "tgs"
      ? css`
          ${justifyContentSpaceBetween}
          padding: 0 2px 0 2px;
        `
      : css`
          ${flexBoxCenter}
        `}

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg}
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;

const ButtonAndInputForm = styled.form`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween};
  padding: 0 2px;

  ${(p) =>
    p.swtName === "tgs" &&
    css`
      width: 173px;
      padding: 0;
    `}
`;
const TgsMobileButtonHole = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const TgsMobileButtonInner = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 21px;
  ${layerA}
  ${flexBoxCenter}
`;
const ButtonHole = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;

  ${layerB};
  ${flexBoxCenter};

  ${(p) =>
    p.isMobile &&
    css`
      width: 39px;
      height: 38px;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
    `}
`;
const ButtonInner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  ${layerA180Deg};

  ${(p) =>
    p.isMobile &&
    css`
      width: 37px;
      height: 36px;
    `}
  ${flexBoxCenter};

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg}
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `}
`;
const ButtonTop = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;

  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isMobile &&
    css`
      width: 29px;
      height: 28px;
    `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}
`;
const Img = styled.img`
  height: 100%;
`;
const TempInput = styled.input`
  width: 63px;
  height: 22px;
  border-radius: 20px;

  ${layerA};

  font-size: 8px;
  letter-spacing: 0.8px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 48px;
      height: 36px;
      border-radius: 21px;
      /* font-size: 9px;
      letter-spacing: 1px; */
    `}

  &::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}

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

const ActiveButtonHole = styled.button`
  border-radius: 20px;

  ${(p) =>
    p.swtName === "tgs"
      ? css`
          width: 79px;
          height: 22px;
        `
      : css`
          width: 92px;
          height: 22px;
        `}

  ${layerB};
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
const ACtiveButtonTop = styled.div`
  ${(p) =>
    p.swtName === "tgs"
      ? css`
          width: 77px;
          height: 20px;
          font-size: 7px;
          letter-spacing: 0.7px;
        `
      : css`
          width: 90px;
          height: 20px;
          font-size: 8px;
          letter-spacing: 0.8px;
        `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
      cursor: not-allowed;
    `}

  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isActivated
      ? css`
          ${activeLayer180Deg}
        `
      : p.isReady &&
        css`
          ${readyTop180Deg}
        `}
`;
const MessageBoxWrapper = styled.div`
  width: 1180px;
  height: 300px;
  position: absolute;

  ${flexBoxCenter}

  top: 40%;
  left: 0;
  z-index: 100;
`;
