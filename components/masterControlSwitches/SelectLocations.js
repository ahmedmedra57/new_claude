import { useEffect, useState } from "react";
import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore } from '../zustand-stores';
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
import { useMediaQuery } from "react-responsive";



import styled, { css } from "styled-components";

import SelectMachineItems from "./SelectMachineItems";
import {
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerBDark,
  layerBDisabled,
  layerC,
} from "../styles/commonStyles";
import testData from "../../test_data/testData";
import selectBoxResetHandler from "../../helpers/ess-tgs-tes-mc/selectBoxResetHandler";
import { transformSpecificLocationData } from "../../helpers/helpers";

const SelectLocations = ({
  size,
  name,
  disabled,
  scope,
  swtName,
  specificLocation,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });

  // size -> for different size
  // scope -> switch or location name

  // Global States
  // !! TODO: put the code below back after tests
  const { essSwitch, tgsSwitch, tesSwitch, flatEssSwitch } = swtName === "ess"
      ? useESSSwitchStore()
      : swtName === "tgs"
        ? useTGSSwitchStore()
        : useTESSwitchStore();
  const switchStatusE =
    swtName === "ess" ? essSwitch : swtName === "tgs" ? tgsSwitch : tesSwitch;

  let switchStatus =
    swtName === "ess" ? essSwitch : swtName === "tgs" ? tgsSwitch : tesSwitch;

  if (scope !== 'switch') {
    if (switchStatus[scope]?.isSpecificLocation) {
      switchStatus = switchStatus[scope].subLocations
    } else if (switchStatus && switchStatus[scope]) {
      switchStatus = { [scope]: switchStatus[scope] };
    } else if (switchStatus) {
      const parentLocation = Object.keys(switchStatus).find((ele) => {
        if (switchStatus[ele].isSpecificLocation) {
          return Object.keys(switchStatus[ele].subLocations).includes(scope)
        }
      })

      if (parentLocation) {
        switchStatus = { [scope]: switchStatus[parentLocation].subLocations[scope] }
      }
    }
  }

  // !!TEST DATA
  // const { essSwitch } = useESSSwitchStore();
  // const { tgsSwitch } = useTGSSwitchStore();
  // const { tesSwitch } = useTESSwitchStore();

  // const locations = useLocationsStore();

  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  // } = testData(essSwitch, tgsSwitch, locations);

  // const switchStatus =
  //   swtName === 'ess'
  //     ? testEssSwitch
  //     : swtName === 'tgs'
  //     ? testTgsSwitch
  //     : tesSwitch;
  // !!END OF TEST DATA

  const mCBySwitch = scope === 'switch'
    ? useMasterControlBySwitchSelectStore()
    : useMasterControlSelectByLocationStore();

  const { selectedOne } = mCBySwitch[name];

  // location states and variables
  const [displaySelectBox, setDisplaySelectBox] = useState(false);
    const arrowSrc = disabled
    ? "/images/masterCtr-select-btn-disabled.svg"
    : displaySelectBox
      ? "/images/masterCtr-select-btn.svg"
      : "/images/masterCtr-select-btn.svg";

  // initialize all the select for display
  const presetSelectBoxHandler = (
    allSelectFC,
    selectLocationFC,
    selectSpecificLocationFC,
    selectMachineFC,
    handleResetSelectedOne
  ) => {
    // isAllSelected
    dispatch(allSelectFC({ controller: name, status: false });
    // selectedOne
    dispatch(handleResetSelectedOne();

    // isLocationSelected
    // const locationArr = locations.map((_) => false);

    // const specificLocationArr = [];
    // const machineArr = Object.values(switchStatus).map((location) =>
    //   Object.values(location).map((value) => {
    //     if (value.machineType) {
    //       return false;
    //     } else {
    //       const specLocation = Object.keys(location).map((el) => false);
    //       const machinesList = Object.values(location).flatMap((specLocation) =>
    //         Object.keys(specLocation).map((el) => false)
    //       );
    //       specificLocationArr.push(specLocation);
    //       return machinesList;
    //     }
    //   })
    // );

    let switchData;
    // if(scope !== "switch") {
    // switchData = switchStatus[scope].isSpecificLocation? switchStatus[scope].subLocations : switchStatus;
    // } else {
    switchData = switchStatus;
    // }

    const { locationList, specificLocationList, machineList } =
      selectBoxResetHandler(switchData);

    // const { locationList, specificLocationList, machineList } =
    //   selectBoxResetHandler(switchStatus);

    // isLocationSelected
    dispatch(selectLocationFC({ arr: locationList, controller: name });

    //isSpecificLocationSelected
    dispatch(
      selectSpecificLocationFC({
        arr: specificLocationList,
        controller: name,
      });

    // isMachineSelected
    dispatch(selectMachineFC({ arr: machineList, controller: name });
  };

  useEffect(() => {
    if (displaySelectBox) {
      if (scope === "switch") {
        presetSelectBoxHandler(
          handleSelectAllBySwitch,
          handleLocationSelectBySwitch,
          handleSpecificLocationSelectBySwitch,
          handleMachineSelectBySwitch,
          handleResetSelectedOne
        );
      } else {

        presetSelectBoxHandler(
          handleSelectAllByLocation,
          handleLocationSelectByLocation,
          handleSpecificLocationSelectByLocation,
          handleMachineSelectByLocation,
          handleResetSelectedOneByLocation
        );
      }
    }
  }, [displaySelectBox]);

  return (
    <>
      {isMobile ? (
        <MobileWrapper
          displaySelectBox={displaySelectBox}
          isSmall={scope !== "switch"}
        >
          <SelectedOneAndArrowButtonWrapper
            isMobile={isMobile}
            isSmall={scope !== "switch"}
          >
            <SelectTop
              size={size}
              disabled={disabled}
              isMobile={isMobile}
              isSmall={scope !== "switch"}
            >
              {selectedOne
                ? selectedOne
                : scope === "switch"
                  ? "select locations"
                  : specificLocation
                    ? "select specific location"
                    : "select switches"}
            </SelectTop>

            <SelectArrowButton
              isSmall={scope !== "switch"}
              isMobile={isMobile}
              disabled={disabled}
              src={arrowSrc}
              onClick={() => disabled || setDisplaySelectBox(!displaySelectBox)}
            />
          </SelectedOneAndArrowButtonWrapper>

          {displaySelectBox && (
            <SelectMachineItems
              isMobile={isMobile}
              handleClose={() => setDisplaySelectBox(!displaySelectBox)}
              data={switchStatus}
              dataE={switchStatusE}
              swtName={swtName}
              name={name}
              scope={scope}
              specificLocation={specificLocation}
            />
          )}
        </MobileWrapper>
      ) : (
        <>
          {/* full screen */}
          {size !== 3 ? (
            <Wrapper
              disabled={disabled}
              displaySelectBox={displaySelectBox}
              size={size}
              isMobile={isMobile}
            >
              <SelectInnerWrapper
                disabled={disabled}
                displaySelectBox={displaySelectBox}
                size={size}
                isMobile={isMobile}
              >
                <SelectedOneAndArrowButtonWrapper
                  size={size}
                  isMobile={isMobile}
                >
                  <SelectTop
                    size={size}
                    disabled={disabled}
                    isMobile={isMobile}
                    isTop={selectedOne ? true : false}
                  >
                    {selectedOne
                      ? selectedOne
                      : scope === "switch"
                        ? "select locations"
                        : specificLocation
                          ? "select switches"
                          : "select specific location"}
                  </SelectTop>
                  <SelectArrowButton
                    isMobile={isMobile}
                    disabled={disabled}
                    src={arrowSrc}
                    onClick={() =>
                      disabled || setDisplaySelectBox(!displaySelectBox)
                    }
                  />
                </SelectedOneAndArrowButtonWrapper>
                {displaySelectBox && (
                  <SelectMachineItems
                    isMobile={isMobile}
                    handleClose={() => setDisplaySelectBox(!displaySelectBox)}
                    data={switchStatus}
                    dataE={switchStatusE}
                    swtName={swtName}
                    name={name}
                    scope={scope}
                  />
                )}
              </SelectInnerWrapper>
            </Wrapper>
          ) : (
            <Wrapper2 disabled={disabled} displaySelectBox={displaySelectBox}>
              <SelectInnerWrapper2
                disabled={disabled}
                displaySelectBox={displaySelectBox}
              >
                <SelectedOneAndArrowButtonWrapper2
                  size={size}
                  displaySelectBox={displaySelectBox}
                >
                  <SelectArrowButton
                    size={size}
                    disabled={disabled}
                    src={"/images/masterCtr-select-btn.svg"}
                    onClick={() =>
                      disabled || setDisplaySelectBox(!displaySelectBox)
                    }
                  />
                  <SelectTop2
                    isSelected={selectedOne}
                    imgSrc="/images/shutOff-select-location.svg"
                  >
                    <SelectedOne2 isAll={size === 3 && selectedOne === "all"}>
                      {selectedOne ? selectedOne : "select locations"}
                    </SelectedOne2>
                  </SelectTop2>
                </SelectedOneAndArrowButtonWrapper2>
              </SelectInnerWrapper2>

              {displaySelectBox && (
                <Wrapper
                  disabled={disabled}
                  displaySelectBox={displaySelectBox}
                  size={size}
                  isMobile={isMobile}
                  name={name}
                >
                  <SelectInnerWrapper
                    disabled={disabled}
                    displaySelectBox={displaySelectBox}
                    size={size}
                    isMobile={isMobile}
                  >
                    <SelectedOneAndArrowButtonWrapper
                      size={size}
                      isMobile={isMobile}
                    >
                      <SelectTop
                        size={size}
                        disabled={disabled}
                        isMobile={isMobile}
                      >
                        {selectedOne
                          ? selectedOne
                          : scope === "switch"
                            ? "select locations"
                            : specificLocation
                              ? "select switches"
                              : "select specific location"}
                      </SelectTop>
                      <SelectArrowButton
                        isMobile={isMobile}
                        disabled={disabled}
                        src={arrowSrc}
                        onClick={() =>
                          disabled || setDisplaySelectBox(!displaySelectBox)
                        }
                      />
                    </SelectedOneAndArrowButtonWrapper>
                    {displaySelectBox && (
                      <SelectMachineItems
                        isMobile={isMobile}
                        handleClose={() =>
                          setDisplaySelectBox(!displaySelectBox)
                        }
                        data={switchStatus}
                        dataE={switchStatusE}
                        swtName={swtName}
                        name={name}
                        scope={scope}
                        specificLocation={specificLocation}
                      />
                    )}
                  </SelectInnerWrapper>
                </Wrapper>
              )}
            </Wrapper2>
          )}
        </>
      )}
    </>
  );
};

export default SelectLocations;

const MobileWrapper = styled.div`
  ${(p) =>
    p.isSmall
      ? css`
          width: 299px;
          height: 68px;
          border-radius: 34px;
          ${layerA180Deg};
          ${flexBoxCenter};

          ${(p) =>
          p.displaySelectBox &&
          css`
              height: auto;
              flex-direction: column;
              justify-content: space-between;
              padding: 5px 0;
              border-radius: 32px;
            `};
        `
      : css`
          width: 310px;
          height: 68px;
          border-radius: 34px;
          ${layerA180Deg};
          ${flexBoxCenter};

          ${(p) =>
          p.displaySelectBox &&
          css`
              height: auto;
              flex-direction: column;
              justify-content: space-between;
              padding: 5px 0;
            `}
        `};
`;

// ------for desktop
const Wrapper = styled.div`
  width: 192rem;
  height: 37rem;
  border-radius: 27px;

  ${(p) =>
    p.displaySelectBox
      ? css``
      : css`
          ${layerC}
        `}

  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */

  ${flexBoxCenter}
  position: relative;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 201px;
      height: 37px;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 201rem;
      height: 28rem;
    `}
    
    ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}

    ${(p) =>
    p.size === 3 &&
    css`
      width: 77px;
      height: 43px;
    `}
    
    
    ${(p) =>
    p.name === "shutOff" &&
    css`
      position: absolute;
      top: 0px;
      right: 56px;
    `}
`;

const SelectInnerWrapper = styled.div`
  width: 190rem;
  height: 35rem;
  border-radius: 34px;
  ${flexBoxCenter}
  ${layerA180Deg};

  padding: 0 4px 0 3.5px;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 199px;
      height: 35px;
      padding: 0 4px 0 2.5px;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 199rem;
      height: 26rem;
    `}

    ${(p) =>
    p.displaySelectBox &&
    css`
      height: auto;
      flex-direction: column;
      ${layerA180Deg};
      ${justifyContentSpaceBetween};

      position: absolute;
      top: 1px;
      z-index: 100;
      border-radius: ${p.size === 2 ? `12px` : `18px`};
      ${p.displaySelectBox
        ? css`
            padding: 3px 4px 4px 2.5px;
          `
        : css`
            padding: 3px 4px 4px 3.5px;
          `}
    `}
  
   

    ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const SelectedOneAndArrowButtonWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}

  ${(p) =>
    p.isMobile
      ? css`
          ${(p) =>
          p.isSmall
            ? css`
                  height: auto;
                  padding: 0 10px 0 5px;
                `
            : css`
                  height: auto;
                  padding: 0 15px 0 6px;
                `}
        `
      : css`
          ${p.size === 1 &&
        css`
            padding: 0 4px 0 1px;
          `}
        `};
`;

const SelectArrowButton = styled.img`
  margin-right: 2rem;
  margin-top: 1rem;
  cursor: pointer;
  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}

  ${(p) =>
    p.size === 3 &&
    css`
      position: absolute;
      top: 6px;
      right: 2px;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 32px;
      height: 29px;
      margin-top: 4px;
    `}
`;

const SelectTop = styled.div`
  width: 157px;
  height: 27px;
  border-radius: 18px;

  ${layerADark}

  font-size: 8px;
  display: flex;
  align-items: center;
  padding-left: 20rem;

  ${(p) =>
    p.size === 1 &&
    css`
      width: 157rem;
      height: 27rem;
    `}
  ${(p) =>
    p.size === 2 &&
    css`
      width: 163rem;
      height: 18rem;
    `}

    ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      color: #808080;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      ${(p) =>
        p.isSmall
          ? css`
              width: 244px;
              height: 58px;
              border-radius: 29px;
              font-size: 12px;
              letter-spacing: 1.2px;
            `
          : css`
              width: 244px;
              height: 58px;
              border-radius: 29px;
              font-size: 12px;
              letter-spacing: 1.2px;
            `}
    `}
`;

// ************styles for shut off component****************
const Wrapper2 = styled.div`
  width: 77px;
  height: 43px;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: relative;

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}

  ${(p) =>
    p.displaySelectBox
      ? css``
      : css`
          ${layerBDark}
        `};
`;

const SelectInnerWrapper2 = styled.div`
  width: 75px;
  height: 41px;
  border-radius: 4px;
  /* ${layerA180Deg} */
  ${justifyContentSpaceBetween}

  /* ${(p) =>
    p.displaySelectBox &&
    css`
      position: absolute;

      height: auto;
      flex-direction: column;

      background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%)
        0% 0% no-repeat padding-box;
      box-shadow: inset 0px 1px 1px #00000029, 0px 0px 2px #000000;
      border: 0.5px solid #000000;
      top: 0rem;

      z-index: 100;
      border-radius: 18px;
      padding: 5rem;
    `} */

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
    
    ${(p) =>
    p.displaySelectBox
      ? css``
      : css`
          ${layerA180Deg}
        `};
`;

const SelectedOneAndArrowButtonWrapper2 = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  padding: 0 0 2px 0;
  position: relative;

  ${(p) =>
    p.displaySelectBox &&
    css`
      visibility: hidden;
    `};
`;

const SelectTop2 = styled.div`
  width: 69px;
  height: 23px;
  background: url(${(p) => p.imgSrc}) no-repeat;

  ${flexBoxCenter}

  ${(p) =>
    p.isSelected &&
    css`
      padding-top: 10px;
    `}
`;

const SelectedOne2 = styled.span`
  font-size: 8px;

  ${(p) =>
    p.isAll &&
    css`
      width: 100%;
      padding-left: 2px;
    `}
`;

// ==================

// useEffect(() => {
//   if (!selectedOne) {
//     if (scope === 'switch') {
//       presetSelectBoxHandler(
//         handleSelectAllBySwitch,
//         handleLocationSelectBySwitch,
//         handleSpecificLocationSelectBySwitch,
//         handleMachineSelectBySwitch
//       );
//       // const locations = Object.keys(switchStatus);
//       // // unSelect all
//       // dispatch(handleSelectAllBySwitch({ controller: name, status: false });
//       // // unSelect all the locations
//       // const locationArr = locations.map((location) => false);
//       // dispatch(
//       //   handleLocationSelectBySwitch({ arr: locationArr, controller: name })
//       // );
//       // // unSelect all the individual machines into Back end(later)
//       // const machineArr = Object.values(switchStatus).map((location) =>
//       //   Object.keys(location).map((machine) => false)
//       // );
//       // dispatch(
//       //   handleMachineSelectBySwitch({ arr: machineArr, controller: name })
//       // );
//     } else {
//       presetSelectBoxHandler(
//         handleSelectAllByLocation,
//         handleLocationSelectByLocation,
//         handleSpecificLocationSelectByLocation,
//         handleMachineSelectByLocation
//       );

//       // const locations = Object.keys(switchStatus);
//       // // unSelect all
//       // dispatch(
//       //   handleSelectAllByLocation({ controller: name, status: false })
//       // );

//       // // unSelect all the locations
//       // const locationArr = locations.map((location) => false);
//       // dispatch(
//       //   handleLocationSelectByLocation({ arr: locationArr, controller: name })
//       // );

//       // // unSelect all the individual machines into Back end(later)
//       // const machineArr = Object.values(switchStatus).map((location) =>
//       //   Object.keys(location).map((machine) => false)
//       // );
//       // dispatch(
//       //   handleMachineSelectByLocation({ arr: machineArr, controller: name })
//       // );
//     }
//   }
// }, [dispatch, name, scope, selectedOne, switchStatus]);
