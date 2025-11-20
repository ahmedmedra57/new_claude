import styled, { css } from "styled-components";
import { useState } from "react";
import { useLocationsStore } from '../../../zustand-stores';
import ValveConfirmButton from "./ValveConfirmButton";
import {
import { useEditCancelApplyButtonsStore } from '../../../zustand-stores';
import { useAdminStore } from '../../../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  scrollbarY,
} from "../../../styles/commonStyles";
import InputValveSettingsMessage from "./InputValveSettingsMessage";
import SelectLocationsBox from "../../SelectLocationsBox";
import ValveSearchBar from "./ValveSearchBar";
import { useEffect } from "react";
import {
  handleGasValuePosition,
  handleResetUnApplyMachinesOfGasInputs,
  selectAdmin,
import { useMediaQuery } from "react-responsive";

function ValveSettings({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  sysIndex,
  ess,
  essSpec,
  tgs,
  tgsSpec,
  tes,
  tesSpec,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
  handleSaveButton,
}) {
  // media query
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });

  const data = [
    { title: "start position:" },
    { title: "min position:" },
    { title: "max position:" },
  ];

    const ButtonsState = useEditCancelApplyButtonsStore();
  const { isEdit } = ButtonsState;
  const adminState = useAdminStore();
  const tgsState = adminState.tgs;
  const locations = useLocationsStore();

  const [warningMessage, setWarningMessage] = useState(false);
  const [inputSearch, setInputSearch] = useState([""]);
  const [selectSearchMethod, setSelectSearchMethod] = useState(null);
  const [searchedMachines, setSelectedMachines] = useState([]);
  // handles the 3 input fields to direct each data entered gets save at the right place in useState at useContext
  const handleInput = (inputIdx, location, machine, inputNumber) => {
    const value = Number(inputNumber);

    if (value >= 0 && value <= 100) {
      switch (inputIdx) {
        case 0:
          useAdminStore().setGasValuePosition({
              location,
              machine,
              position: "startPosition",
              value,
            });
          break;
        case 1:
          useAdminStore().setGasValuePosition({
              location,
              machine,
              position: "minPosition",
              value,
            });
          break;
        case 2:
          useAdminStore().setGasValuePosition({
              location,
              machine,
              position: "maxPosition",
              value,
            });
          break;
        default:
          break;
      }
    } else {
      setWarningMessage(true);
    }
  };

  const onClose = () => {
    setWarningMessage(false);
  };

  const handleResetUnConfirmUnApplyMachinesStates = (
    location,
    ConfirmOrApplyKey
  ) => {
    const machines = Object.keys(tgs[location]);
    machines.forEach((machine) =>
      useAdminStore().setGasValuePosition({
          location,
          machine,
          position: ConfirmOrApplyKey,
          value: false,
        });
  };

  const handleRemoveUnApplyMachinesInputs = (location) => {
    const machinesInfo = Object.entries(tgs[location]);

    machinesInfo.forEach((machine) => {
      useSettingsOptionsStore().resetUnApplyMachinesOfGasInputs({
          location,
          machine: machine[0],
          isApplyState: machine[1].gasValue.isApply,
        });
    });
  };

  useEffect(() => {
    // reset all the isConfirm states of gasValue in Tgs to false on Mount
    const locations = tgs && Object.keys(tgs);

    locations.map((location) =>
      handleResetUnConfirmUnApplyMachinesStates(location, "isConfirm");

    return () =>
      locations.map((location) => handleRemoveUnApplyMachinesInputs(location);
  }, []);

  useEffect(() => {
    if (selectSearchMethod === 0) {
      const machineNumber =
        inputSearch[0].length > 7 && inputSearch[0].split(" - ").pop();
      const value = inputSearch[0].length > 7 && inputSearch[0].split(" - ");
      const location = value && value[0];
      if (location && machineNumber) {
        const { gasType, sysIdentification, gasValue } =
          tgs[location][machineNumber];
        setSelectedMachines([
          {
            location,
            machineNumber,
            gasType,
            tes: sysIdentification.isHeatingSysWithTes,
            switchSize: sysIdentification.switchSize,
            application: sysIdentification.application,
            startPosition: gasValue.startPosition,
            minPosition: gasValue.minPosition,
            maxPosition: gasValue.maxPosition,
          },
        ]);
      }
    } else if (selectSearchMethod === 1) {
      let selectedLocations = [];
      const newLocations = Object.entries(tgsSpec);
      newLocations.forEach(([location, value]) => {
       if(value.isSpecificLocation){
        Object.keys(value?.subLocations).forEach((subLocation) => {
          Object.entries(value?.subLocations[subLocation]?.devices).forEach(
            ([machineNumber, el]) => {
              if (el.isSelectedValveSettings) {
                const AllLocationsInfo = {
                  location,
                  machineNumber,
                  gasType: el.gasType,
                  tes: el.sysIdentification.isHeatingSysWithTes,
                  switchSize: el.sysIdentification.switchSize,
                  application: el.sysIdentification.application,
                  startPosition: el.gasValue.startPosition,
                  minPosition: el.gasValue.minPosition,
                  maxPosition: el.gasValue.maxPosition,
                };
                selectedLocations.push(AllLocationsInfo);
              }
            }
          );
        })
        // Object.entries(value?.subLocations).forEach(([machineNumber, el]) => {
        //   console.log("newLocations", location,value);
        //   if (el.isSelected) {
        //     const AllLocationsInfo = {
        //       location,
        //       machineNumber,
        //       gasType: el.gasType,
        //       tes: el.sysIdentification.isHeatingSysWithTes,
        //       switchSize: el.sysIdentification.switchSize,
        //       application: el.sysIdentification.application,
        //       startPosition: el.gasValue.startPosition,
        //       minPosition: el.gasValue.minPosition,
        //       maxPosition: el.gasValue.maxPosition,
        //     };
        //     selectedLocations.push(AllLocationsInfo);
        //   }
        // });
       }else{
        Object.entries(value?.devices).forEach(([machineNumber, el]) => {
          if (el.isSelectedValveSettings) {
            const AllLocationsInfo = {
              location,
              machineNumber,
              gasType: el.gasType,
              tes: el.sysIdentification.isHeatingSysWithTes,
              switchSize: el.sysIdentification.switchSize,
              application: el.sysIdentification.application,
              startPosition: el.gasValue.startPosition,
              minPosition: el.gasValue.minPosition,
              maxPosition: el.gasValue.maxPosition,
            };
            selectedLocations.push(AllLocationsInfo);
          }
        });
       }
      });
      setSelectedMachines(selectedLocations);
    } else {
      setSelectedMachines([]);
    }
  }, [inputSearch, tgs, selectSearchMethod]);

  const handleConfirmButton = (location, machine) => {
    if (
      tgsState[location][machine].gasValue.startPosition &&
      tgsState[location][machine].gasValue.minPosition &&
      tgsState[location][machine].gasValue.maxPosition
    ) {
      return useAdminStore().setGasValuePosition({
          location,
          machine,
          position: "isConfirm",
          value: true,
        });
    }
    return;
  };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper isMobile={true}>
            <WrapperTitle isMobile={true}>
              <Title isMobile={true}>valve settings</Title>
            </WrapperTitle>
            <FlexWrapperRow isMobile={true}>
              {/* search bar */}
              <SearchWrapper isMobile={true}>
                <ValveSearchBar
                  system={tgs}
                  inputSearch={inputSearch}
                  setInputSearch={setInputSearch}
                  setSelectSearchMethod={setSelectSearchMethod}
                />
              </SearchWrapper>

              {/* select box */}
              <SelectLocationsBoxWrapper
                onClick={() => setSelectSearchMethod(1)}
              >
                <SelectLocationsBox
                  selectedOne={selectedOne}
                  handleOpenSelectLocations={handleOpenSelectLocations}
                  displaySelectBox={displaySelectBox}
                  // sysIndex={sysIndex}
                  sysIndex={"valveSettings"}
                  swt={"tgs"}
                  sysOptions={"admin"}
                  ess={ess}
                  tgs={tgs}
                  tes={tes}
                  multipleSelectBoxes={true}
                  program={"admin"}
                  // handleSelectIndividualMachine={handleSelectIndividualMachine}
                  // handleUnSelectIndividualMachine={
                  //   handleUnSelectIndividualMachine
                  // }
                  // isMobileValveSettings={true}
                  isMobileValveSettings={isMobile}
                  isMobileGasType={isMobile}
                />
              </SelectLocationsBoxWrapper>
            </FlexWrapperRow>
            <ScrollBarWrapper isMobile={true}>
              {searchedMachines?.map(
                (
                  {
                    location,
                    machineNumber,
                    application,
                    gasType,
                    switchSize,
                    tes,
                    startPosition,
                    minPosition,
                    maxPosition,
                  },
                  idx
                ) => {
                  const locationName = locations.all[location].locationName;
                  const machineName =
                    locations.all[location].devices[machineNumber].machineName;
                  return (
                    <FlexWrapper key={idx}>
                      <MachineSerialNumberBackground isMobile={true}>
                        <MachineName
                          isMobile={true}
                        >{`${locationName} - ${machineName}`}</MachineName>
                      </MachineSerialNumberBackground>
                      <WrapperData isMobile={true}>
                        <SmallTitle isMobile={true}>
                          gas value position
                        </SmallTitle>
                        <FlexColumn>
                          {data.map((value, index) => {
                            return (
                              <WrapperIndent isMobile={true} key={index}>
                                <DataSubtitle isMobile={true}>
                                  {value.title}
                                </DataSubtitle>
                                <DataContainer isMobile={true}>
                                  <DataIndent
                                    type="number"
                                    value={
                                      index === 0
                                        ? startPosition
                                        : index === 1
                                        ? minPosition
                                        : maxPosition
                                    }
                                    onChange={(e) => {
                                      isEdit &&
                                        handleInput(
                                          index,
                                          location,
                                          machineNumber,
                                          e.target.value
                                        );
                                    }}
                                  ></DataIndent>
                                  <PercentageSign>%</PercentageSign>
                                </DataContainer>
                              </WrapperIndent>
                            );
                          })}
                        </FlexColumn>
                        <WrapperButton isMobile={true}>
                          <ValveConfirmButton
                            buttonName={"confirm"}
                            handleConfirm={handleConfirmButton}
                            handleClick={handleSaveButton}
                            location={location}
                            machine={machineNumber}
                          />
                        </WrapperButton>
                      </WrapperData>
                    </FlexWrapper>
                  );
                }
              )}
            </ScrollBarWrapper>
            {warningMessage && (
              <>
                <InputValveSettingsMessage
                  title={"warning"}
                  onClose={onClose}
                  message={"please input a number between 0 and 100"}
                />
              </>
            )}
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            <WrapperTitle>
              <Title>valve settings</Title>
            </WrapperTitle>
            <FlexWrapperRow>
              {/* select box */}
              <SelectLocationsBoxWrapper
                // onClick={() => setSelectSearchMethod(1)}
              >
                <SelectLocationsBox
                  selectedOne={selectedOne}
                  handleOpenSelectLocations={handleOpenSelectLocations}
                  displaySelectBox={displaySelectBox}
                  // sysIndex={sysIndex}
                  sysIndex={"valveSettings"}
                  swt={"tgs"}
                  sysOptions={"admin"}
                  ess={essSpec}
                  tgs={tgsSpec}
                  tes={tesSpec}
                  setSelectSearchMethod={setSelectSearchMethod}
                  isValueSettings={true}
                  multipleSelectBoxes={true}
                  program={"admin"}
                  // handleSelectIndividualMachine={handleSelectIndividualMachine}
                  // handleUnSelectIndividualMachine={
                  //   handleUnSelectIndividualMachine
                  // }
                  isMobileValveSettings={isMobile}
                  isMobileGasType={isMobile}
                />
              </SelectLocationsBoxWrapper>
              {/* search bar */}
              <SearchWrapper>
                <ValveSearchBar
                  system={tgsSpec}
                  inputSearch={inputSearch}
                  setInputSearch={setInputSearch}
                  setSelectSearchMethod={setSelectSearchMethod}
                />
              </SearchWrapper>
            </FlexWrapperRow>
            <ScrollBarWrapper>
              {searchedMachines?.map(
                (
                  {
                    location,
                    machineNumber,
                    application,
                    gasType,
                    switchSize,
                    tes,
                    startPosition,
                    minPosition,
                    maxPosition,
                  },
                  idx
                ) => {
                  const locationName = locations.all[location].locationName;
                  const machineName =
                    locations.all[location]?.devices[machineNumber]?.machineName;
                  return (
                    <FlexWrapper key={idx}>
                      <MachineSerialNumberBackground>
                        <MachineName>{`${locationName} - ${machineName}`}</MachineName>
                      </MachineSerialNumberBackground>
                      <WrapperData>
                        <WrapperData2>
                          <WrapperData3>
                            <SmallTitle>
                              gas value <br /> position
                            </SmallTitle>
                            <WrapperIndent>
                              {data.map((value, index) => {
                                return (
                                  <MapDiv key={index}>
                                    <DataSubtitle>{value.title}</DataSubtitle>
                                    <DataContainer>
                                      <DataIndent
                                        type="number"
                                        value={
                                          index === 0
                                            ? startPosition
                                            : index === 1
                                            ? minPosition
                                            : maxPosition
                                        }
                                        onChange={(e) => {
                                          isEdit &&
                                            handleInput(
                                              index,
                                              location,
                                              machineNumber,
                                              e.target.value
                                            );
                                        }}
                                      ></DataIndent>
                                      <PercentageSign>%</PercentageSign>
                                    </DataContainer>
                                  </MapDiv>
                                );
                              })}
                            </WrapperIndent>
                            <WrapperButton>
                              <ValveConfirmButton
                                buttonName={"confirm"}
                                handleConfirm={handleConfirmButton}
                                handleClick={handleSaveButton}
                                location={location}
                                machine={machineNumber}
                              />
                            </WrapperButton>
                          </WrapperData3>
                        </WrapperData2>
                      </WrapperData>
                    </FlexWrapper>
                  );
                }
              )}
            </ScrollBarWrapper>
            {warningMessage && (
              <>
                <InputValveSettingsMessage
                  title={"warning"}
                  onClose={onClose}
                  message={"please input a number between 0 and 100"}
                />
              </>
            )}
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
}

export default ValveSettings;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 281px;
          height: 788px;
        `
      : css`
          width: 841px;
          height: 329px;
        `}

  ${layerB}

  border-radius: 9px;

  ${flexBoxCenter}
`;
const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 279px;
          height: 786px;
        `
      : css`
          width: 839px;
          height: 327px;
        `}

  ${layerA180Deg}

  border-radius: 8px;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 271px;
          height: 32px;
          border-radius: 24px;
        `
      : css`
          width: 831px;
          height: 32px;
          border-radius: 16px;
        `}

  ${layerA}

  ${flexBoxCenter}
`;

const Title = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css``
      : css`
          margin-left: 8rem;
        `}
  text-align: center;
  letter-spacing: 1.2px;
  font-size: 12px;
`;

const FlexWrapperRow = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          ${flexBoxCenter}
          flex-direction: column;
        `
      : css`
          width: 99.3%;
          ${justifyContentSpaceBetween};
        `}
`;

const SelectLocationsBoxWrapper = styled.div`
  z-index: 10;
`;

const SearchWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile &&
    css`
      margin-bottom: 2px;
    `}
`;

const ScrollBarWrapper = styled.div`
  /* scroll bar */
  ${scrollbarY}

  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 258px;
          /* min-height: 224px; */
          height: 642px;
          margin-top: 1px;
          margin-bottom: 1px;
          border-radius: 6px 12px 24px 24px;
          ::-webkit-scrollbar {
            display: none;
          }
        `
      : css`
          width: 828px;
          height: 232px;
          border-radius: 0 0 0 28px;
        `}

  ${layerA}



  

 

  /* scroll-behavior: smooth;
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  } */
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const FlexWrapper = styled.div`
  margin-top: -3px;
  display: flex;
  flex-direction: column;
`;

const MachineSerialNumberBackground = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 24px;
          width: 193px;
          margin-top: 10px;
          background: url("/images/settings-mobile-valveSettings-hat.svg");
        `
      : css`
          height: 22px;
          width: 408px;
          margin-left: -9px;
          background: url("/images/settings-valveSettings-hat.svg");
        `}

  ${justifyContentFlexStart}
`;

const MachineName = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          max-width: 180px;
          margin-top: 2px;
          margin-left: 2px;
          font-size: 10px;
          letter-spacing: 1px;
        `
      : css`
          margin-top: 9px;
          margin-left: 14px;
          text-align: center;
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;

const WrapperData = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 253px;
          height: 182px;
          border-radius: 0px 22px 22px 22px;
          ${justifyContentSpaceEvenly}
          flex-direction: column;
        `
      : css`
          width: 812px;
          height: 50px;
          margin-bottom: 2px;
          border-radius: 0px 25px 25px 25px;
        `}

  ${layerA180Deg}

  ${flexBoxCenter}
`;

const WrapperData2 = styled.div`
  width: 803px;
  height: 40px;

  ${layerB}

  border-radius: 24px;
  opacity: 1;

  ${flexBoxCenter}
`;
const WrapperData3 = styled.div`
  width: 799px;
  height: 36px;

  ${layerA180Deg}

  border-radius: 33px;
  opacity: 1;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const SmallTitle = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          margin-top: 6px;
          font-size: 12px;
          letter-spacing: 1.2px;
        `
      : css`
          height: 22px;
          margin-left: 16px;

          text-align: left;
          font-size: 10px;
          letter-spacing: 1px;
        `}
`;

const FlexColumn = styled.div`
  width: 100%;
  height: 100%;
  margin-top: -6px;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const WrapperIndent = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 243px;
          height: 30px;

          ${justifyContentSpaceBetween}
        `
      : css`
          width: 556px;
          height: 30px;
          ${flexBoxCenter}
        `}

  border-radius: 24px;
  ${layerA}
`;

const MapDiv = styled.div`
  height: 100%;
  width: 100%;
  padding-right: 1px;

  ${justifyContentFlexEnd}
  gap:30rem;
`;

const DataSubtitle = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 12px;
          letter-spacing: 1.2px;
          margin-left: 10px;
        `
      : css`
          width: 64px;
          height: 22px;
          text-align: left;
          font-size: 10px;
          letter-spacing: 1px;
          &:first-child {
            padding-left: 6px;
          }
        `}
`;

const DataContainer = styled.div`
  width: 70px;
  height: 28px;
  border-radius: 15px;

  ${({ isMobile }) =>
    isMobile &&
    css`
      margin-right: 1px;
    `}

  ${layerA180Deg}

  ${flexBoxCenter}
`;

const DataIndent = styled.input`
  width: 46px;
  height: 20px;
  margin-left: 3px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1.2px;

  ${layerADark}

  border-radius: 18px 6px 6px 18px;
  opacity: 1;

  ${flexBoxCenter}
`;

const PercentageSign = styled.p`
  margin-left: 6px;
  font-size: 12px;
`;

const WrapperButton = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          margin-bottom: 4px;
        `
      : css`
          margin-right: 3px;
        `}
`;
