import styled, { css } from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectAts from "./selectArts/SelectAts";
import SelectTc from "./selectTc/SelectTc";
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerC,
} from "../../styles/commonStyles";
import EditCancelApplyButtons from "../buttons/EditCancelApplyButtons";
import {
  handleSettingsDisplaySelectBox,
  handleSettingsMultipleDisplaySelectBox,
  selectForceCommandAndAdminSelect,
} from "../../store/slices/settings/force&CommandAndAdminSelectSlice";
import {
  handleFCUnSelectIndividualMachine,
  handleFCSelectIndividualMachine,
  selectForceAndCommands,
} from "../../store/slices/settings/forceAndCommandsSlice";
import Header from "../Header";
import useSelectLocationBox from "../useSelectLocation";
import InvisibleDivForEditButton from "../messageBoxes/InvisibleDivForEditButton";
import { selectEditCancelApplyButtons } from "../../store/slices/settings/editCancelApplyButtonsSlice";
import SettingAppliedMessage from "../../masterControl/userMessages/SettingAppliedMessage";
import { selectUserInfo } from "../../store/slices/userSlice";
import { useMediaQuery } from "react-responsive";
import TitleOfSelectedOption from "../TitleOfSelectedOption";
import SelectFCSwitchMachineOptions from "./SelectFCSwitchMachineOptions";
import ContainerLogin from "../../adminPassword/ContainerLogin";
import testData from "../../../test_data/testData";
import {
  getLocationsSpecificLocationsMachines,
  getSettingsHeaderData,
} from "../../../helpers/setting";

function ForceAndCommandMain({
  handleClick,
  buttonsState,
  setButtonsState,
  selected,
  setSelected,
  activeSelect,
  setActiveSelect,
  tCNumber,
  setTCNumber,
  isSave,
  setIsSave,
  messageBoxContent,
  openMessageBox,
  handleCloseMessageBox,
  isAppliedAtsButtonState,
  setIsAppliedAtsButtonState,
  openHeaders,
  setOpenHeaders,
}) {
  // media query
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });

  // the contents of select ATS of GP and EBP of Ess, Tgs and Tes
  const essGpEbp = [
    "reactivate ess when powered by ebp (emergency backup power)",
    "block and do not allow ess to operate when on ebp (emergency backup power)",
  ];

  const tesGpEbp = [
    "switch to typhoon gas powered heating system when on (emergency backup power)",
    "reactivate tes when powered by ebp (emergency backup power)",
    "tes to remain off when powered by ebp (emergency backup power)",
  ];

  const tgsGpEbp = [
    "reactive to tgs-typhoon gas power heating system when on ebp emergency backup power",
    "block and do not allow tgs to operate when on ebp (emergency backup power)",
  ];

  const headers = getSettingsHeaderData(isMobile);

  const [openPasswordBox, setOpenPasswordBox] = useState(true);

  // redux
  const dispatch = useDispatch();

  const buttonState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = buttonState;

  const systemsState = useSelector(selectForceAndCommands);
  const { ess, essSpec, tgs, tgsSpec, tes, tesSpec, sys,sysSpec, ate, hp } =
    systemsState;

  // !!TEST DATA
  // const { testEssSwitch, testTgsSwitch, testTesSwitch, testAllLocations } =
  //   testData(ess, tgs, null, tes);
  // console.log('testAllLocations:', testAllLocations);
  // console.log('testTesSwitch:', testTesSwitch);
  // console.log('testTgsSwitch', testTgsSwitch);
  // console.log('testEssSwitch', testEssSwitch);

  // !! END OF TEST DATA

  const forceCommandAndAdminSelectState = useSelector(
    selectForceCommandAndAdminSelect
  );

  const { isAdministrator } = useSelector(selectUserInfo);

  const sysOpeningSelectBoxState =
    forceCommandAndAdminSelectState.displayMultipleSelectBox.forceAndCommands
      .sys;

  const { displaySelectBox, displayMultipleSelectBox } =
    forceCommandAndAdminSelectState;
  const { selectedOne } = openHeaders[0]
    ? forceCommandAndAdminSelectState.ess
    : openHeaders[1]
    ? forceCommandAndAdminSelectState.tes
    : openHeaders[2]
    ? forceCommandAndAdminSelectState.tgs
    : sysOpeningSelectBoxState.outsideTemp
    ? forceCommandAndAdminSelectState.outsideTemp
    : sysOpeningSelectBoxState.burningChamber
    ? forceCommandAndAdminSelectState.burningChamber
    : sysOpeningSelectBoxState.encloseTemp
    ? forceCommandAndAdminSelectState.encloseTemp
    : sysOpeningSelectBoxState.currEss
    ? forceCommandAndAdminSelectState.currEss
    : sysOpeningSelectBoxState.currTgs
    ? forceCommandAndAdminSelectState.currTgs
    : sysOpeningSelectBoxState.currTes &&
      forceCommandAndAdminSelectState.currTes;

  const UserInfoState = useSelector(selectUserInfo);
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, isAteSwitch } =
    UserInfoState;

  // custom hook with logic to unselect for SelectLocationBox.js
  // !!TEST
  useSelectLocationBox(
    openHeaders,
    handleFCUnSelectIndividualMachine,
    selectedOne,
    ess,
    essSpec,
    tgs,
    tgsSpec,
    tes,
    tesSpec,
    sys,
    sysSpec,
    ate,
    hp,
    undefined,
    undefined,
    undefined,
    undefined,
    sysOpeningSelectBoxState.outsideTemp,
    sysOpeningSelectBoxState.burningChamber,
    sysOpeningSelectBoxState.encloseTemp,
    sysOpeningSelectBoxState.currEss,
    sysOpeningSelectBoxState.currTgs,
    sysOpeningSelectBoxState.currTes
  );
  // !!END
  // useSelectLocationBox(
  //   openHeaders,
  //   handleFCUnSelectIndividualMachine,
  //   selectedOne,
  //   ess,
  //   tgs,
  //   tes,
  //   sys,
  //   ate,
  //   hp,
  //   undefined,
  //   undefined,
  //   undefined,
  //   undefined,
  //   sysOpeningSelectBoxState.outsideTemp,
  //   sysOpeningSelectBoxState.burningChamber,
  //   sysOpeningSelectBoxState.encloseTemp,
  //   sysOpeningSelectBoxState.currEss,
  //   sysOpeningSelectBoxState.currTgs,
  //   sysOpeningSelectBoxState.currTes
  // );

  const handleSelectAtsClearApplyButtons = (sysIdx, index) => {
    const copySelected = [...selected];
    const copyButtonsState = [...buttonsState];
    switch (index) {
      case 0:
        copySelected[sysIdx] = null;
        setSelected(copySelected);
        copyButtonsState[sysIdx] = false;
        const copyIsAppliedAtsButtonState = [...isAppliedAtsButtonState];
        copyIsAppliedAtsButtonState[sysIdx] = false;
        setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);

        break;
      case 1:
        copyButtonsState[sysIdx] = true;
        break;
      default:
        break;
    }

    setButtonsState(copyButtonsState);
  };

  const handleSaveSelectedOfSelectAts = (sysIdx, index) => {
    const copySelected = [...selected];
    copySelected[sysIdx] = index;
    setSelected(copySelected);

  };

  const handleOpenSelectLocations = (sysIndex) => {
    dispatch(handleSettingsDisplaySelectBox(sysIndex));
  };

  const handleOpenMultipleSelectLocations = (sysOptions, swt, contentTitle) => {
    dispatch(
      handleSettingsMultipleDisplaySelectBox({ sysOptions, swt, contentTitle })
    );
  };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          {openPasswordBox && (
            <PasswordWrapper>
              <ContainerLogin handleClose={() => setOpenPasswordBox(false)} />
            </PasswordWrapper>
          )}
          <Wrapper isMobile={true}>
            <TitleOfSelectedOption title={"force & commands"} />
            <AllHeadersWrapper
              isMobile={true}
              isLastHeaderOpen={openHeaders[5]}
            >
              {headers.map(
                (
                  { title, button, activatedButton, deactivatedButton },
                  index
                ) => {
                  const SelectedMachines =
                    index === 0
                      ? forceCommandAndAdminSelectState.ess.selectedOne
                      : index === 1
                      ? forceCommandAndAdminSelectState.tgs.selectedOne
                      : forceCommandAndAdminSelectState.tes.selectedOne;
                  return (
                    <HeaderBaseLayer
                      key={index}
                      isMobile={true}
                      isActive={openHeaders[index]}
                    >
                      <Header
                        title={title}
                        button={button}
                        activatedButton={activatedButton}
                        deactivatedButton={deactivatedButton}
                        index={index}
                        setOpenHeaders={setOpenHeaders}
                        openHeaders={openHeaders}
                        isActive={
                          index === 0
                            ? isEssSwitch
                            : index === 1
                            ? isTgsSwitch
                            : index === 2
                            ? isTesSwitch
                            : index === 3
                            ? isHpSwitch
                            : index === 4
                            ? isAteSwitch
                            : true
                        }
                        isAdministrator={isAdministrator}
                        handleOpenPasswordBox={() => setOpenPasswordBox(true)}
                      />
                      {/* ess, tgs and tes contents */}
                      {openHeaders[index] &&
                        isAdministrator &&
                        ((index === 0 && isEssSwitch) ||
                          (index === 1 && isTgsSwitch) ||
                          (index === 2 && isTesSwitch)) && (
                          <>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton
                                  height={
                                    index === 0
                                      ? "288px"
                                      : index === 1
                                      ? "307px"
                                      : "368px"
                                  }
                                />
                              </EditBoxWrapper>
                            )}
                            {/* select location box */}
                            <SelectLocationBaseLayer>
                              <SelectLocationWrapper
                                isExpanded={displaySelectBox[index]}
                              >
                                <Flex isExpanded={displaySelectBox[index]}>
                                  <SelectLocationIndent>
                                    <Title>
                                      {SelectedMachines
                                        ? SelectedMachines
                                        : "select location"}
                                    </Title>
                                  </SelectLocationIndent>
                                  <ArrowImg
                                    src={"./images/select-arrow-icon.svg"}
                                    onClick={() =>
                                      handleOpenSelectLocations(index)
                                    }
                                  />
                                </Flex>
                                {displaySelectBox[index] && (
                                  <SelectionBoxWrapper>
                                    <SelectFCSwitchMachineOptions
                                      handleClose={() =>
                                        handleOpenSelectLocations(index)
                                      }
                                      data={
                                        index === 0
                                          ? ess
                                          : index === 1
                                          ? tgs
                                          : tes
                                      }
                                      sysIndex={index}
                                      swtName={
                                        index === 0
                                          ? "ess"
                                          : index === 1
                                          ? "tgs"
                                          : "tes"
                                      }
                                    />
                                  </SelectionBoxWrapper>
                                )}
                              </SelectLocationWrapper>
                            </SelectLocationBaseLayer>

                            {/* select ats */}
                            <SelectAts
                              gpEbp={
                                index === 0
                                  ? essGpEbp
                                  : index === 1
                                  ? tgsGpEbp
                                  : tesGpEbp
                              }
                              sysIndex={index}
                              handleSelectAts={handleSelectAtsClearApplyButtons}
                              handleSaveSelectedOfSelectAts={
                                handleSaveSelectedOfSelectAts
                              }
                              selected={selected}
                              buttonColor={isAppliedAtsButtonState[index]}
                              handleClick={handleClick}
                            />
                            {/* <ButtonsWrapper>
                            <EditCancelApplyButtons
                              handleClick={handleClick}
                              sysIndex={index}
                            />
                          </ButtonsWrapper> */}
                          </>
                        )}

                      {/* hp contents */}
                      {openHeaders[index] &&
                        index === 3 &&
                        isHpSwitch &&
                        isAdministrator &&
                        ""}
                      {/* ate contents */}
                      {openHeaders[index] &&
                        index === 4 &&
                        isAteSwitch &&
                        isAdministrator &&
                        ""}
                      {/* sys contents */}
                      {openHeaders[index] && index === 5 && isAdministrator && (
                        <>
                          {/* <ContentLightBaseLayer flexId={true}> */}
                          {!isEdit && (
                            <EditBoxWrapper>
                              <InvisibleDivForEditButton height={"870px"} />
                            </EditBoxWrapper>
                          )}
                          <SelectTc
                            handleOpenSelectLocations={
                              handleOpenMultipleSelectLocations
                            }
                            displaySelectBox={displayMultipleSelectBox}
                            ess={ess}
                            tgs={tgs}
                            tes={tes}
                            sys={sys}
                            handleSelectIndividualMachine={
                              handleFCSelectIndividualMachine
                            }
                            handleUnSelectIndividualMachine={
                              handleFCUnSelectIndividualMachine
                            }
                            activeSelect={activeSelect}
                            setActiveSelect={setActiveSelect}
                            tCNumber={tCNumber}
                            setTCNumber={setTCNumber}
                            isSave={isSave}
                            setIsSave={setIsSave}
                            handleThreeButtonsClick={handleClick}
                            sysIndex={index}
                          />
                          {/* </ContentLightBaseLayer> */}
                          {/* <ButtonsWrapper>
                          <EditCancelApplyButtons
                            handleClick={handleClick}
                            sysIndex={index}
                          />
                        </ButtonsWrapper> */}
                        </>
                      )}
                    </HeaderBaseLayer>
                  );
                }
              )}
              {openMessageBox && (
                <SettingAppliedMessage
                  message={messageBoxContent}
                  onClose={handleCloseMessageBox}
                />
              )}
            </AllHeadersWrapper>
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          {openPasswordBox && (
            <PasswordWrapper>
              <ContainerLogin handleClose={() => setOpenPasswordBox(false)} />
            </PasswordWrapper>
          )}
          <Wrapper>
            <AllHeadersWrapper>
              {headers.map(
                (
                  { title, button, activatedButton, deactivatedButton },
                  index
                ) => {
                  return (
                    <HeaderBaseLayer key={index}>
                      <Header
                        title={title}
                        index={index}
                        button={button}
                        activatedButton={activatedButton}
                        deactivatedButton={deactivatedButton}
                        setOpenHeaders={setOpenHeaders}
                        openHeaders={openHeaders}
                        isActive={
                          index === 0
                            ? isEssSwitch
                            : index === 1
                            ? isTgsSwitch
                            : index === 2
                            ? isTesSwitch
                            : index === 3
                            ? isHpSwitch
                            : index === 4
                            ? isAteSwitch
                            : true
                        }
                        isAdministrator={isAdministrator}
                        handleOpenPasswordBox={() => setOpenPasswordBox(true)}
                      />
                      {/* ess, tgs and tes contents */}
                      {openHeaders[index] &&
                        isAdministrator &&
                        ((index === 0 && isEssSwitch) ||
                          (index === 1 && isTgsSwitch) ||
                          (index === 2 && isTesSwitch)) && (
                          <ContentDarkBaseLayer>
                            <ContentLightBaseLayer>
                              {!isEdit && (
                                <EditBoxWrapper>
                                  <InvisibleDivForEditButton
                                    height={
                                      index === 0
                                        ? "288px"
                                        : index === 1
                                        ? "307px"
                                        : "368px"
                                    }
                                  />
                                </EditBoxWrapper>
                              )}
                              <SelectAts
                                gpEbp={
                                  index === 0
                                    ? essGpEbp
                                    : index === 1
                                    ? tgsGpEbp
                                    : tesGpEbp
                                }
                                sysIndex={index}
                                handleSelectAts={
                                  handleSelectAtsClearApplyButtons
                                }
                                handleSaveSelectedOfSelectAts={
                                  handleSaveSelectedOfSelectAts
                                }
                                selected={selected}
                                displaySelectBox={displaySelectBox}
                                selectedOne={
                                  index === 0
                                    ? forceCommandAndAdminSelectState.ess
                                        .selectedOne
                                    : index === 1
                                    ? forceCommandAndAdminSelectState.tgs
                                        .selectedOne
                                    : forceCommandAndAdminSelectState.tes
                                        .selectedOne
                                }
                                // openHeaders={openHeaders}
                                ess={essSpec}
                                tgs={tgsSpec}
                                tes={tesSpec}
                                // ess={ess}
                                // tgs={tgs}
                                // tes={tes}
                                handleOpenSelectLocations={
                                  handleOpenSelectLocations
                                }
                                buttonColor={isAppliedAtsButtonState[index]}
                              />
                            </ContentLightBaseLayer>
                            <ButtonsWrapper>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </ContentDarkBaseLayer>
                        )}
                      {/* {openHeaders[index] &&
                      isAdministrator &&
                      ((index === 0 && isEssSwitch) ||
                        (index === 1 && isTgsSwitch) ||
                        (index === 2 && isTesSwitch)) && (
                        <ContentDarkBaseLayer>
                          <ContentLightBaseLayer>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton
                                  height={
                                    index === 0
                                      ? '288px'
                                      : index === 1
                                      ? '307px'
                                      : '368px'
                                  }
                                />
                              </EditBoxWrapper>
                            )}
                            <SelectAts
                              gpEbp={
                                index === 0
                                  ? essGpEbp
                                  : index === 1
                                  ? tgsGpEbp
                                  : tesGpEbp
                              }
                              sysIndex={index}
                              handleSelectAts={handleSelectAtsClearApplyButtons}
                              handleSaveSelectedOfSelectAts={
                                handleSaveSelectedOfSelectAts
                              }
                              selected={selected}
                              displaySelectBox={displaySelectBox}
                              selectedOne={
                                index === 0
                                  ? forceCommandAndAdminSelectState.ess
                                      .selectedOne
                                  : index === 1
                                  ? forceCommandAndAdminSelectState.tgs
                                      .selectedOne
                                  : forceCommandAndAdminSelectState.tes
                                      .selectedOne
                              }
                              // openHeaders={openHeaders}
                              ess={ess}
                              tgs={tgs}
                              tes={tes}
                              handleOpenSelectLocations={
                                handleOpenSelectLocations
                              }
                              buttonColor={isAppliedAtsButtonState[index]}
                            />
                          </ContentLightBaseLayer>
                          <ButtonsWrapper>
                            <EditCancelApplyButtons
                              handleClick={handleClick}
                              sysIndex={index}
                            />
                          </ButtonsWrapper>
                        </ContentDarkBaseLayer>
                      )} */}
                      {/* hp contents */}
                      {openHeaders[index] &&
                        isAdministrator &&
                        index === 3 &&
                        isHpSwitch &&
                        ""}
                      {/* ate contents */}
                      {openHeaders[index] &&
                        isAdministrator &&
                        index === 4 &&
                        isAteSwitch &&
                        ""}
                      {/* sys contents */}
                      {openHeaders[index] && isAdministrator && index === 5 && (
                        <ContentDarkBaseLayer>
                          <ContentLightBaseLayer flexId={true}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={"486px"} />
                              </EditBoxWrapper>
                            )}
                            <SelectTc
                              handleOpenSelectLocations={
                                handleOpenMultipleSelectLocations
                              }
                              displaySelectBox={displayMultipleSelectBox}
                              ess={essSpec}
                              tgs={tgsSpec}
                              tes={tesSpec}
                              sys={sysSpec}
                              handleSelectIndividualMachine={
                                handleFCSelectIndividualMachine
                              }
                              handleUnSelectIndividualMachine={
                                handleFCUnSelectIndividualMachine
                              }
                              activeSelect={activeSelect}
                              setActiveSelect={setActiveSelect}
                              tCNumber={tCNumber}
                              setTCNumber={setTCNumber}
                              isSave={isSave}
                              setIsSave={setIsSave}
                            />
                          </ContentLightBaseLayer>
                          <ButtonsWrapper>
                            <EditCancelApplyButtons
                              handleClick={handleClick}
                              sysIndex={index}
                            />
                          </ButtonsWrapper>
                        </ContentDarkBaseLayer>
                      )}
                    </HeaderBaseLayer>
                  );
                }
              )}
              {openMessageBox && (
                <SettingAppliedMessage
                  message={messageBoxContent}
                  onClose={handleCloseMessageBox}
                />
              )}
            </AllHeadersWrapper>
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
}

export default ForceAndCommandMain;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: auto;
          padding-bottom: 2px;
          padding-top: 2px;
          margin-bottom: 4px;
          border-radius: 16px;
        `
      : css`
          width: 873px;
          height: auto;
          padding-bottom: 2px;
          padding-top: 2px;
          border-radius: 7px;
        `}

  ${layerA}

  ${justifyContentSpaceAround}
  flex-direction: column;
`;

const PasswordWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 360px;
        `
      : css`
          height: 448px;
        `}

  width: 869px;
  /* border: 1px solid red; */
  position: absolute;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 310px;
          height: auto;
          padding-bottom: 2px;
          padding-top: 5px;
          border-radius: 14px;
          ${layerA90Deg}
        `
      : css`
          width: 869px;
          height: auto;
          padding-bottom: 2px;
          padding-top: 2px;
          border-radius: 5px;
          ${layerA180Deg}
        `}

  ${flexBoxCenter}
  flex-direction: column;
`;

const AllHeadersWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 298px;
          height: auto;
          border-radius: 27px;
          margin-top: 6px;
          margin-bottom: 3px;
          ${({ isLastHeaderOpen }) =>
            isLastHeaderOpen &&
            css`
              border-radius: 27px 27px 14px 14px;
            `}
        `
      : css`
          width: 859px;
          height: auto;
          margin-top: 4px;
          margin-bottom: 4px;
          border-radius: 38px;
        `}

  ${layerA}

  ${flexBoxCenter}
  flex-direction: column;
`;

const HeaderBaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 294px;
          height: auto;
          padding-top: 2px;
          padding-bottom: 2px;
          margin-bottom: 3px;
          &:first-child {
            margin-top: 2px;
          }
          border-radius: 30px;
          ${({ isActive }) =>
            isActive &&
            css`
              border-radius: 25px 25px 31px 31px;
              padding-bottom: 3px;
            `}
        `
      : css`
          width: 855px;
          height: auto;
          padding: 2px;
          margin-top: 2px;
          border-radius: 36px;
        `}

  &:last-child {
    margin-bottom: 2px;
  }

  ${layerC}

  ${flexBoxCenter}
  flex-direction: column;
`;

const ContentDarkBaseLayer = styled.div`
  width: 851px;
  height: auto;
  margin-top: 8px;
  padding-bottom: 16px;

  ${layerA180Deg}

  border-radius: 14px 14px 34px 34px;
  opacity: 1;
  ${justifyContentFlexStart}
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
  margin-right: 2px;
  ${justifyContentFlexEnd}
`;

const ContentLightBaseLayer = styled.div`
  width: 845px;
  height: auto;
  margin-top: 2px;
  padding-bottom: 2px;

  ${layerADark}

  border-radius: 11px;
  opacity: 1;
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
`;

const SelectLocationBaseLayer = styled.div`
  width: 289px;
  height: auto;
  margin-top: 6px;
  padding-top: 2px;
  padding-bottom: 2px;

  border-radius: 36px;
  z-index: 10;

  ${layerA}
  ${flexBoxCenter}
  flex-direction: column;
  /* position: relative; */
`;

const SelectLocationWrapper = styled.div`
  ${({ isExpanded }) =>
    isExpanded
      ? css`
          width: 285;
          height: auto;

          flex-direction: column;
          border-radius: 36px 36px 32px 32px;
          /* position: absolute;
          left: 1px;
          top: 1px; */
        `
      : css`
          width: 285px;
          height: 68px;

          border-radius: 34px;
        `}
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const Flex = styled.div`
  ${({ isExpanded }) =>
    isExpanded &&
    css`
      margin-top: 4.5px;
    `}
  width: 100%;

  ${justifyContentSpaceAround}
  ${flexBoxCenter}
  gap:12px;
`;

const SelectLocationIndent = styled.div`
  width: 230px;
  height: 58px;

  border-radius: 29px;

  ${layerA}

  ${flexBoxCenter}
`;

const Title = styled.p`
  margin-left: 8px;
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const ArrowImg = styled.img`
  margin-top: 4px;
  margin-right: 5px;
  cursor: pointer;
`;

const SelectionBoxWrapper = styled.div`
  width: 285px;
  height: auto;

  /* ${layerA180Deg} */

  /* border-radius: 32px; */
`;
