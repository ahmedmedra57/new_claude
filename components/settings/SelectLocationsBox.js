import styled, { css } from "styled-components";
import {
  ButtonReady,
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  layerA,
  layerA180Deg,
} from "../styles/commonStyles";
import SettingsSelectSwitchMachineOptions from "./SettingsSelectSwitchMachineOptions";

const SelectLocationsBox = ({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  sysIndex,
  ess,
  tgs,
  tes,
  sys,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  multipleSelectBoxes,
  setSelectSearchMethod,
  isValueSettings,
  sysOptions,
  swt,
  isMobileTC,
  isMobileGasType,
  isMobileValveSettings,
  isMobileSelectTC,
  isActivate,
  isDeactivate,
  program,
}) => {
  let data = {};
  if (multipleSelectBoxes) {
    data =
      sysIndex === 0 || sysIndex === "currEss"
        ? ess
        : sysIndex === 1 ||
          sysIndex === "valveSettings" ||
          sysIndex === "gasType" ||
          sysIndex === "currTgs" ||
          sysIndex === "burningChamber" ||
          sysIndex === "forceGasAndElectricSys"
        ? tgs
        : sysIndex === 2 || sysIndex === "currTes"
        ? tes
        : sys;
  } else {
    data =
      sysIndex === 0 ? ess : sysIndex === 1 ? tgs : sysIndex === 2 ? tes : sys;
  }
  const selectLocationHandler = () => {
    multipleSelectBoxes
      ? handleOpenSelectLocations(sysOptions, swt, sysIndex)
      : handleOpenSelectLocations(sysIndex);
  };
  return (
    <SelectLocationBaseLayer
      isMobileTC={isMobileTC || isMobileGasType}
      isMobileValveSettings={isMobileValveSettings}
    >
      <SelectLocationWrapper
        isMobileTC={isMobileTC || isMobileGasType}
        isMobileValveSettings={isMobileValveSettings}
        isZIndex={
          multipleSelectBoxes
            ? displaySelectBox[sysOptions][swt][sysIndex]
            : displaySelectBox[sysIndex]
        }
        isActivate={isActivate}
        isDeactivate={isDeactivate}
      >
        <FlexRowWrapper
          isMobileTC={isMobileTC || isMobileGasType}
          isMobileValveSettings={isMobileValveSettings}
        >
          <SelectLocationIndent
            isMobileTC={isMobileTC || isMobileGasType}
            isMobileValveSettings={isMobileValveSettings}
            isActivate={isActivate}
          >
            <Title
              isMobileTC={isMobileTC || isMobileGasType}
              isMobileValveSettings={isMobileValveSettings}
            >
              {selectedOne ? selectedOne : "select location"}
            </Title>
          </SelectLocationIndent>
          <ArrowImg
            isMobileTC={isMobileTC || isMobileGasType}
            src={"./images/select-arrow-icon.svg"}
            onClick={selectLocationHandler}
            // onClick={() => {
            //   multipleSelectBoxes
            //     ? handleOpenSelectLocations(sysOptions, swt, sysIndex)
            //     : handleOpenSelectLocations(sysIndex);
            // }}
          />
        </FlexRowWrapper>

        {multipleSelectBoxes
          ? displaySelectBox[sysOptions][swt][sysIndex] && (
              <SelectionBoxWrapper
                isMobileTC={isMobileTC || isMobileGasType}
                // isMobileValveSettings={isMobileValveSettings}
              >
                {/* <FlexRowWrapper
                  margin={true}
                  isMobileTC={isMobileTC || isMobileGasType}
                  // isMobileValveSettings={isMobileValveSettings}
                >
                  <SelectLocationIndent
                    isMobileTC={isMobileTC || isMobileGasType}
                    // isMobileValveSettings={isMobileValveSettings}
                  >
                    <Title>
                      {selectedOne ? selectedOne : 'select location'}
                    </Title>
                  </SelectLocationIndent>
                  <ArrowImg
                    src={'./images/select-arrow-icon.svg'}
                    onClick={() =>
                      handleOpenSelectLocations(sysOptions, swt, sysIndex)
                    }
                  />
                </FlexRowWrapper> */}
                <SettingsSelectSwitchMachineOptions
                  handleClose={selectLocationHandler}
                  // handleClose={() =>
                  //   handleOpenSelectLocations(sysOptions, swt, sysIndex)
                  // }
                  data={data}
                  sysIndex={sysIndex}
                  system={swt}
                  setSelectSearchMethod={setSelectSearchMethod}
                  isValueSettings={isValueSettings}
                  // handleSelectIndividualMachine={handleSelectIndividualMachine}
                  // handleUnSelectIndividualMachine={
                  //   handleUnSelectIndividualMachine
                  // }
                  program={program}
                  isMobileGasType={isMobileGasType}
                  isMobileSelectTC={isMobileSelectTC}
                />
              </SelectionBoxWrapper>
            )
          : displaySelectBox[sysIndex] && (
              <SelectionBoxWrapper
                isMobileTC={isMobileTC}
                isMobileValveSettings={isMobileValveSettings}
              >
                {/* <FlexRowWrapper
                  margin={true}
                  isMobileTC={isMobileTC}
                  isMobileValveSettings={isMobileValveSettings}
                >
                  <SelectLocationIndent
                    isMobileTC={isMobileTC}
                    isMobileValveSettings={isMobileValveSettings}
                  >
                    <Title isMobileTC={isMobileTC}>
                      {selectedOne ? selectedOne : 'select location'}
                    </Title>
                  </SelectLocationIndent>
                  <ArrowImg
                    isMobileTC={isMobileTC}
                    src={'./images/select-arrow-icon.svg'}
                    onClick={() => {
                      handleOpenSelectLocations(sysIndex);
                    }}
                  />
                </FlexRowWrapper> */}
                <SettingsSelectSwitchMachineOptions
                  handleClose={selectLocationHandler}
                  // handleClose={() => handleOpenSelectLocations(sysIndex)}
                  data={data}
                  sysIndex={sysIndex}
                  // handleSelectIndividualMachine={handleSelectIndividualMachine}
                  // handleUnSelectIndividualMachine={
                  //   handleUnSelectIndividualMachine
                  // }
                  program={program}
                  isMobileTC={isMobileTC}
                  isMobileValveSettings={isMobileValveSettings}
                />
              </SelectionBoxWrapper>
            )}
      </SelectLocationWrapper>
    </SelectLocationBaseLayer>
  );
};

export default SelectLocationsBox;

const SelectLocationBaseLayer = styled.div`
  ${({ isMobileTC, isMobileValveSettings }) =>
    isMobileTC
      ? css`
          width: 267px;
          height: 49px;
          border-radius: 34px;
        `
      : isMobileValveSettings
      ? css`
          width: 269px;
          height: 49px;
          margin-top: 4px;
          border-radius: 34px;
        `
      : css`
          width: 262px;
          height: 32px;
          border-radius: 16px;
        `}

  ${layerA}

  /* ${flexBoxCenter} */
  /* flex-direction:column; */
  position: relative;
`;

const SelectLocationWrapper = styled.div`
  ${({ isMobileTC, isMobileValveSettings }) =>
    isMobileTC
      ? css`
          width: 265px;
          min-height: 47px;
          border-radius: 33px;
          ${({ isZIndex }) =>
            isZIndex &&
            css`
              border-radius: 25px 25px 28px 28px;
            `}
        `
      : isMobileValveSettings
      ? css`
          width: 267px;
          min-height: 47px;
          border-radius: 33px;
        `
      : css`
          width: 260px;
          min-height: 30px;
          padding-top: 3px;
          padding-bottom: 3px;
          border-radius: 15px;
        `}

  ${layerA180Deg}
position:absolute;
  top: 1px;
  left: 1px;
  ${flexBoxCenter}
  flex-direction: column;
  ${({ isZIndex }) =>
    isZIndex &&
    css`
      z-index: 12;
    `}

  ${({ isActivate, isDeactivate }) =>
    isDeactivate
      ? css`
          ${ButtonReady}
        `
      : isActivate &&
        css`
          background: transparent
            linear-gradient(180deg, #ff920c 0%, #804906 100%) 0% 0% no-repeat
            padding-box;
          box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
          border: 0.5px solid #000000;
        `}
`;

const FlexRowWrapper = styled.div`
  ${({ isMobileTC, isMobileGasType, isMobileValveSettings }) =>
    isMobileTC || isMobileGasType || isMobileValveSettings
      ? css`
          width: 100%;
          height: 100%;
          /* margin-top: 4px;
          margin-bottom: 6px; */
          ${justifyContentSpaceAround};
        `
      : css`
          ${flexBoxCenter}
          ${({ margin }) =>
            margin &&
            css`
              margin-top: 2rem;
              margin-bottom: 4rem;
            `}
        `}
`;

const SelectLocationIndent = styled.div`
  ${layerA}
  ${({ isMobileTC, isMobileValveSettings }) =>
    isMobileTC
      ? css`
          width: 223px;
          height: 38px;
          margin-top: 4px;
          margin-bottom: 6px;
          border-radius: 22px;
          ${flexBoxCenter}
        `
      : isMobileValveSettings
      ? css`
          width: 228px;
          height: 38px;
          margin-top: 4px;
          margin-bottom: 6px;
          border-radius: 22px;
          ${flexBoxCenter}
        `
      : css`
          width: 229px;
          height: 24px;
          border-radius: 16px;
          ${justifyContentFlexStart}
          ${({ isActivate }) =>
            isActivate &&
            css`
              background: #774200 0% 0% no-repeat padding-box;
              box-shadow: inset 0px 0px 3px #000000;
            `}
        `}
`;

const Title = styled.p`
  ${({ isMobileTC }) =>
    isMobileTC
      ? css`
          font-size: 10px;
          letter-spacing: 1px;
          text-align: center;
        `
      : css`
          text-align: left;
          font-size: 12px;
          letter-spacing: 1px;
          margin-left: 8px;
        `}
`;

const ArrowImg = styled.img`
  width: 22px;
  height: 17px;
  margin-top: 2px;
  margin-right: 2px;
  /* 
  ${({ isMobileTC }) =>
    isMobileTC &&
    css`
      margin-right: 2px;
    `} */
  cursor: pointer;
`;

const SelectionBoxWrapper = styled.div`
  ${({ isMobileTC }) =>
    isMobileTC
      ? css`
          width: 101%;
        `
      : css`
          width: 100%;
        `}

  /* max-height: 304px;

  ${layerA180Deg}

  border-radius: 15px;
  opacity: 1;
  z-index: 12;
 
  ${flexBoxCenter}
  flex-direction: column; */

  margin-top: 4px;
`;
