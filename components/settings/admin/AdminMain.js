import styled, { css } from 'styled-components';
import { useState } from 'react';
import { useUserStore } from '../../zustand-stores';
import Thermocouple from './Thermocouple';
import ForceGasElectricSystem from './ForceGasElectricSystem';
import AddElementToBank from './AddElementToBank';
import SystemIdentification from './systemIdentification/SystemIdentification';
import {
import { useEditCancelApplyButtonsStore } from '../../../zustand-stores';
import { useAdminStore } from '../../../zustand-stores';
import { useForceCommandAndAdminSelectStore } from '../../../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerC,
  layerCLighter,
} from '../../styles/commonStyles';
import Header from '../Header';
import EditCancelApplyButtons from '../buttons/EditCancelApplyButtons';
import useSelectLocationBox from '../useSelectLocation';
import {
  handleAdminSelectIndividualMachine,
  handleAdminUnSelectIndividualMachine,
import ValveSettings from './valvetSettings/ValveSettings';
import SelectGasType from './SelectGasType';
import InvisibleDivForEditButton from '../messageBoxes/InvisibleDivForEditButton';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';
import ContainerLogin from '../../adminPassword/ContainerLogin';
import { useMediaQuery } from 'react-responsive';
import { useEffect } from 'react';
import TitleOfSelectedOption from '../TitleOfSelectedOption';
import { getSettingsHeaderData } from '../../../helpers/setting';
import HPMain from './hp/HPMain';

function AdminMain({
  handleClick,
  saveChanges,
  setSaveChanges,
  setSaveInputElement,
  setGasSelection,
  gasSelection,
  enableSwitch,
  setEnableSwitch,
  messageBoxContent,
  openMessageBox,
  handleCloseMessageBox,
  isCreateEditOrSave,
  setIsCreateOrEditOrSave,
  locationNameRef,
  civicAddress,
  setCivicAddress,
  specificLocation,
  setSpecificLocation,
  switches,
  setSwitches,
  selectedLocation,
  setSelectedLocation,
  numSwitches,
  setNumSwitches,
  numOfUOS,
  setNumOfUOS,
  numOfSSR,
  setNumOfSSR,
  UOSName,
  setUOSName,
  UOSDelete,
  setUOSDelete,
  isGroupedSwitchesSaved,
  setIsGroupedSwitchesSaved,
  isConfirmed,
  setIsConfirmed,
  // specificLocationRef,
  openHeaders,
  setOpenHeaders,
}) {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Redux
  
  const forceCommandAndAdminSelectState = useForceCommandAndAdminSelectStore();
  const selectUserInfoState = useUserStore();

  const { isAdministrator } = selectUserInfoState;
  const { displaySelectBox, displayMultipleSelectBox } =
    forceCommandAndAdminSelectState;

  const { selectedOne } = openHeaders[0]
    ? forceCommandAndAdminSelectState.ess
    : forceCommandAndAdminSelectState.displayMultipleSelectBox.admin.tgs.gasType
    ? forceCommandAndAdminSelectState.gasType
    : openHeaders[1]
    ? forceCommandAndAdminSelectState.tgs
    : openHeaders[2]
    ? forceCommandAndAdminSelectState.tes
    : forceCommandAndAdminSelectState.displayMultipleSelectBox.admin.sys
        .forceGasAndElectricSys
    ? forceCommandAndAdminSelectState.forceGasAndElectricSys
    : openHeaders[5] && forceCommandAndAdminSelectState.sys;

  const sysOpeningSelectBoxState =
    forceCommandAndAdminSelectState.displayMultipleSelectBox.admin;

  const systemsState = useAdminStore();
  const { ess, essSpec, tgs, tgsSpec, tes, tesSpec, sys, sysSpec, ate, hp } =
    systemsState;

  useEffect(() => {
    return () => {
      useAdminStore().resetAccessAdministrator();
      setSaveChanges({
        addElementToBank: false,
        trackTempControl: false,
        deactivateTrackTempControl: false,
        selectGasType: false,
        valveSettings: false,
        systemIdentification: false,
        // systemConfiguration: false,
        forceGasAndElectric: false,
      });
    };
  }, []);

  useSelectLocationBox(
    openHeaders,
    handleAdminUnSelectIndividualMachine,
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
    sysOpeningSelectBoxState.tgs.valveSettings,
    sysOpeningSelectBoxState.tgs.gasType,
    sysOpeningSelectBoxState.sys.forceGasAndElectricSys,
    sysOpeningSelectBoxState.sys.sysIdentification
    // sysOpeningSelectBoxState.sys.sysConfiguration
  );

  const headers = getSettingsHeaderData(isMobile);

  // redux
  const buttonsState = useEditCancelApplyButtonsStore();
  const { isEdit } = buttonsState;

  const UserInfoState = useUserStore();
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, isAteSwitch } =
    UserInfoState;

  // ******************************
  const handleOpenSelectLocations = (sysIndex) => {
    useSettingsOptionsStore().toggleDisplaySelectBox(sysIndex);
  };

  const handleOpenMultipleSelectLocations = (sysOptions, swt, contentTitle) => {
    useSettingsOptionsStore().toggleMultipleDisplaySelectBox({ sysOptions, swt, contentTitle });
  };

  const handleConfirmOrSave = (idx, str) => {
    const copySaveChanges = { ...saveChanges };

    switch (idx) {
      case 0:
        copySaveChanges.addElementToBank = true;
        break;
      case 1:
        copySaveChanges.trackTempControl = true;
        copySaveChanges.deactivateTrackTempControl = false;
        break;
      case 2:
        copySaveChanges.selectGasType = true;
        break;
      case 3:
        if (str) {
          copySaveChanges.systemIdentification = str;
        } else copySaveChanges.systemIdentification = true;
        break;
      case 4:
        copySaveChanges.deactivateTrackTempControl = true;
        copySaveChanges.trackTempControl = false;
        break;
      // case 4:
      //   copySaveChanges.systemConfiguration = true;
      //   break;
      case 5:
        copySaveChanges.forceGasAndElectric = true;
        break;
      case 6:
        copySaveChanges.valveSettings = true;
        break;
      default:
        break;
    }
    return setSaveChanges(copySaveChanges);
  };

  const [openPasswordBox, setOpenPasswordBox] = useState(true);

  // const errorMessageForSelectSwitches = {
  //   title: ['settings'],
  //   subtitle: 'administration settings',
  //   theme: 'ess-change options',
  //   message: 'please select switches to continue track temperature',
  // };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          {/* password pop up box */}
          {openPasswordBox && (
            <PasswordWrapper isMobile={true}>
              <ContainerLogin handleClose={() => setOpenPasswordBox(false)} />
            </PasswordWrapper>
          )}
          <Wrapper isMobile={true}>
            <TitleOfSelectedOption title={'admin.'} />
            <AllHeadersWrapper
              isMobile={true}
              isLastHeaderOpen={openHeaders[5]}
            >
              {headers.map(
                (
                  { title, button, activatedButton, deactivatedButton },
                  index
                ) => {
                  return (
                    <SystemHeaderWrapper
                      key={index}
                      isMobile={true}
                      isActive={openHeaders[index]}
                    >
                      <Header
                        index={index}
                        title={title}
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
                      {/* ess,  tes contents */}
                      {openHeaders[index] &&
                        isAdministrator &&
                        ((index === 0 && isEssSwitch) ||
                          (index === 2 && isTesSwitch)) && (
                          <FlexWrapper isMobile={true}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'538px'} />
                              </EditBoxWrapper>
                            )}
                            <ContentWrapper flexId={index} isMobile={true}>
                              <AddElementToBank
                                handleSaveButton={handleConfirmOrSave}
                                setSaveInputElement={setSaveInputElement}
                                isActivate={saveChanges.addElementToBank}
                              />
                              <Thermocouple
                                selectedOne={
                                  index === 0
                                    ? forceCommandAndAdminSelectState.ess
                                        .selectedOne
                                    : forceCommandAndAdminSelectState.tes
                                        .selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenSelectLocations
                                }
                                isActivate={saveChanges.trackTempControl}
                                isDeactivate={
                                  saveChanges.deactivateTrackTempControl
                                }
                                displaySelectBox={displaySelectBox}
                                sysIndex={index}
                                ess={ess}
                                tgs={tgs}
                                tes={tes}
                                // handleSelectIndividualMachine={
                                //   handleAdminSelectIndividualMachine
                                // }
                                // handleUnSelectIndividualMachine={
                                //   handleAdminUnSelectIndividualMachine
                                // }
                                handleActivateDeactivateButton={
                                  handleConfirmOrSave
                                }
                                isMobile={true}
                              />
                            </ContentWrapper>
                            <ButtonsWrapper isMobile={true}>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </FlexWrapper>
                        )}
                      {/* tgs contents */}
                      {openHeaders[index] &&
                        index === 1 &&
                        isTgsSwitch &&
                        isAdministrator && (
                          <FlexWrapper isMobile={true}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'998px'} />
                              </EditBoxWrapper>
                            )}
                            <ContentWrapper flexId={index} isMobile={true}>
                              <ValveSettings
                                selectedOne={
                                  forceCommandAndAdminSelectState.valveSettings
                                    .selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenMultipleSelectLocations
                                }
                                displaySelectBox={displayMultipleSelectBox}
                                sysIndex={index}
                                ess={ess}
                                tgs={tgs}
                                tes={tes}
                                // handleSelectIndividualMachine={
                                //   handleAdminSelectIndividualMachine
                                // }
                                // handleUnSelectIndividualMachine={
                                //   handleAdminUnSelectIndividualMachine
                                // }
                                handleSaveButton={handleConfirmOrSave}
                              />
                              <FlexGasWrapper isMobile={true}>
                                <SelectGasType
                                  selectedOne={
                                    forceCommandAndAdminSelectState.gasType
                                      .selectedOne
                                  }
                                  handleOpenSelectLocations={
                                    handleOpenMultipleSelectLocations
                                  }
                                  displaySelectBox={displayMultipleSelectBox}
                                  ess={ess}
                                  tgs={tgs}
                                  tes={tes}
                                  // handleSelectIndividualMachine={
                                  //   handleAdminSelectIndividualMachine
                                  // }
                                  // handleUnSelectIndividualMachine={
                                  //   handleAdminUnSelectIndividualMachine
                                  // }
                                  handleSaveButton={handleConfirmOrSave}
                                  setGasSelection={setGasSelection}
                                  gasSelection={gasSelection}
                                  isActivate={saveChanges.selectGasType}
                                />
                              </FlexGasWrapper>
                            </ContentWrapper>
                            <ButtonsWrapper isMobile={true}>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </FlexWrapper>
                        )}
                      {/* hp contents */}
                      {openHeaders[index] &&
                        index === 3 &&
                        isHpSwitch &&
                        isAdministrator &&
                        ''}
                      {/* ate contents */}
                      {openHeaders[index] &&
                        index === 4 &&
                        isAteSwitch &&
                        isAdministrator &&
                        ''}
                      {/* sys contents */}
                      {openHeaders[index] && index === 5 && isAdministrator && (
                        <FlexWrapper isMobile={true}>
                          <ContentWrapper flexId={index} isMobile={true}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'334px'} />
                              </EditBoxWrapper>
                            )}

                            <FlexGasWrapper isMobile={true}>
                              <ForceGasElectricSystem
                                selectedOne={
                                  forceCommandAndAdminSelectState
                                    .forceGasAndElectricSys.selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenMultipleSelectLocations
                                }
                                isActivate={saveChanges.forceGasAndElectric}
                                displaySelectBox={displayMultipleSelectBox}
                                ess={ess}
                                tgs={tgs}
                                tes={tes}
                                sys={sys}
                                handleSelectIndividualMachine={
                                  handleAdminSelectIndividualMachine
                                }
                                handleUnSelectIndividualMachine={
                                  handleAdminUnSelectIndividualMachine
                                }
                                handleSaveButton={handleConfirmOrSave}
                                enableSwitch={enableSwitch}
                                setEnableSwitch={setEnableSwitch}
                              />
                            </FlexGasWrapper>
                          </ContentWrapper>
                          <ButtonsWrapper>
                            <EditCancelApplyButtons
                              handleClick={handleClick}
                              sysIndex={index}
                            />
                          </ButtonsWrapper>
                        </FlexWrapper>
                      )}
                    </SystemHeaderWrapper>
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
          <BaseLayer1>
            <Wrapper>
              {headers.map(
                (
                  { title, button, activatedButton, deactivatedButton },
                  index
                ) => {
                  return (
                    <SystemHeaderWrapper key={index}>
                      <Header
                        index={index}
                        title={title}
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
                      {/* ess,  tes contents */}
                      {openHeaders[index] &&
                        ((index === 0 && isEssSwitch) ||
                          (index === 2 && isTesSwitch)) &&
                        isAdministrator && (
                          <FlexWrapper>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'217px'} />
                              </EditBoxWrapper>
                            )}
                            <ContentWrapper flexId={index}>
                              <AddElementToBank
                                handleSaveButton={handleConfirmOrSave}
                                setSaveInputElement={setSaveInputElement}
                                isActivate={saveChanges.addElementToBank}
                              />
                              <Thermocouple
                                selectedOne={
                                  index === 0
                                    ? forceCommandAndAdminSelectState.ess
                                        .selectedOne
                                    : forceCommandAndAdminSelectState.tes
                                        .selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenSelectLocations
                                }
                                isActivate={saveChanges.trackTempControl}
                                isDeactivate={
                                  saveChanges.deactivateTrackTempControl
                                }
                                displaySelectBox={displaySelectBox}
                                sysIndex={index}
                                ess={essSpec}
                                tgs={tgsSpec}
                                tes={tesSpec}
                                handleSelectIndividualMachine={
                                  handleAdminSelectIndividualMachine
                                }
                                handleUnSelectIndividualMachine={
                                  handleAdminUnSelectIndividualMachine
                                }
                                handleActivateDeactivateButton={
                                  handleConfirmOrSave
                                }
                              />
                            </ContentWrapper>
                            <ButtonsWrapper>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </FlexWrapper>
                        )}
                      {/* tgs contents */}
                      {openHeaders[index] &&
                        index === 1 &&
                        isTgsSwitch &&
                        isAdministrator && (
                          <FlexWrapper>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'548px'} />
                              </EditBoxWrapper>
                            )}
                            <ContentWrapper flexId={index}>
                              <ValveSettings
                                selectedOne={
                                  forceCommandAndAdminSelectState.valveSettings
                                    .selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenMultipleSelectLocations
                                }
                                displaySelectBox={displayMultipleSelectBox}
                                sysIndex={index}
                                ess={ess}
                                essSpec={essSpec}
                                tgs={tgs}
                                tgsSpec={tgsSpec}
                                tes={tes}
                                tesSpec={tesSpec}
                                // handleSelectIndividualMachine={
                                //   handleAdminSelectIndividualMachine
                                // }
                                // handleUnSelectIndividualMachine={
                                //   handleAdminUnSelectIndividualMachine
                                // }
                                handleSaveButton={handleConfirmOrSave}
                              />
                              <FlexGasWrapper>
                                <SelectGasType
                                  selectedOne={
                                    forceCommandAndAdminSelectState.gasType
                                      .selectedOne
                                  }
                                  handleOpenSelectLocations={
                                    handleOpenMultipleSelectLocations
                                  }
                                  isActivate={saveChanges.selectGasType}
                                  displaySelectBox={displayMultipleSelectBox}
                                  ess={essSpec}
                                  tgs={tgsSpec}
                                  tes={tesSpec}
                                  // handleSelectIndividualMachine={
                                  //   handleAdminSelectIndividualMachine
                                  // }
                                  // handleUnSelectIndividualMachine={
                                  //   handleAdminUnSelectIndividualMachine
                                  // }
                                  handleSaveButton={handleConfirmOrSave}
                                  setGasSelection={setGasSelection}
                                  gasSelection={gasSelection}
                                />
                              </FlexGasWrapper>
                            </ContentWrapper>
                            <ButtonsWrapper>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </FlexWrapper>
                        )}
                      {/* hp contents */}
                      {openHeaders[index] &&
                        index === 3 &&
                        isHpSwitch &&
                        isAdministrator && (
                          <FlexWrapper hp={true}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'548px'} />
                              </EditBoxWrapper>
                            )}
                            {/* <ContentWrapper> */}
                            <HPMain />
                            {/* </ContentWrapper> */}
                            <ButtonsWrapper hp={true}>
                              <EditCancelApplyButtons
                                handleClick={handleClick}
                                sysIndex={index}
                              />
                            </ButtonsWrapper>
                          </FlexWrapper>
                        )}
                      {/* ate contents */}
                      {openHeaders[index] &&
                        index === 4 &&
                        isAteSwitch &&
                        isAdministrator &&
                        ''}
                      {/* sys contents */}
                      {openHeaders[index] && index === 5 && isAdministrator && (
                        <FlexWrapper>
                          <ContentWrapper flexId={index}>
                            {!isEdit && (
                              <EditBoxWrapper>
                                <InvisibleDivForEditButton height={'334px'} />
                              </EditBoxWrapper>
                            )}
                            <SystemIdentification
                              handleConfirmOrSave={handleConfirmOrSave}
                              isCreateEditOrSave={isCreateEditOrSave}
                              setIsCreateOrEditOrSave={setIsCreateOrEditOrSave}
                              locationNameRef={locationNameRef}
                              civicAddress={civicAddress}
                              setCivicAddress={setCivicAddress}
                              specificLocation={specificLocation}
                              setSpecificLocation={setSpecificLocation}
                              switches={switches}
                              setSwitches={setSwitches}
                              selectedLocation={selectedLocation}
                              setSelectedLocation={setSelectedLocation}
                              numSwitches={numSwitches}
                              setNumSwitches={setNumSwitches}
                              numOfUOS={numOfUOS}
                              setNumOfUOS={setNumOfUOS}
                              numOfSSR={numOfSSR}
                              setNumOfSSR={setNumOfSSR}
                              UOSName={UOSName}
                              setUOSName={setUOSName}
                              UOSDelete={UOSName}
                              setUOSDelete={setUOSDelete}
                              isGroupedSwitchesSaved={isGroupedSwitchesSaved}
                              setIsGroupedSwitchesSaved={
                                setIsGroupedSwitchesSaved
                              }
                              isConfirmed={isConfirmed}
                              setIsConfirmed={setIsConfirmed}
                              // specificLocationRef={specificLocationRef}
                            />
                            {/* <SystemConfiguration
                        selectedOne={selectedOne}
                        handleOpenSelectLocations={handleOpenSelectLocations}
                        displaySelectBox={displaySelectBox}
                        sysIndex={index}
                        ess={ess}
                        tgs={tgs}
                        tes={tes}
                        sys={sys}
                        handleSelectIndividualMachine={
                          handleAdminSelectIndividualMachine
                        }
                        handleUnSelectIndividualMachine={
                          handleAdminUnSelectIndividualMachine
                        }
                        handleSaveButton={handleConfirmOrSave}
                        selectSystemConfig={selectSystemConfig}
                        setSelectSystemConfig={setSelectSystemConfig}
                      /> */}
                            <FlexStartWrapper forceGasElectricMargin={true}>
                              <ForceGasElectricSystem
                                selectedOne={
                                  forceCommandAndAdminSelectState
                                    .forceGasAndElectricSys.selectedOne
                                }
                                handleOpenSelectLocations={
                                  handleOpenMultipleSelectLocations
                                }
                                isActivate={saveChanges.forceGasAndElectric}
                                displaySelectBox={displayMultipleSelectBox}
                                ess={essSpec}
                                tgs={tgsSpec}
                                tes={tesSpec}
                                sys={sysSpec}
                                // handleSelectIndividualMachine={
                                //   handleAdminSelectIndividualMachine
                                // }
                                // handleUnSelectIndividualMachine={
                                //   handleAdminUnSelectIndividualMachine
                                // }
                                handleSaveButton={handleConfirmOrSave}
                                enableSwitch={enableSwitch}
                                setEnableSwitch={setEnableSwitch}
                              />
                            </FlexStartWrapper>
                          </ContentWrapper>
                          <ButtonsWrapper>
                            <EditCancelApplyButtons
                              handleClick={handleClick}
                              sysIndex={index}
                            />
                          </ButtonsWrapper>
                        </FlexWrapper>
                      )}
                    </SystemHeaderWrapper>
                  );
                }
              )}
              {openMessageBox && (
                <SettingAppliedMessage
                  message={messageBoxContent}
                  onClose={handleCloseMessageBox}
                />
              )}
            </Wrapper>
          </BaseLayer1>
        </BaseLayer>
      )}
    </>
  );
}

export default AdminMain;

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

  position: relative;

  ${flexBoxCenter}
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

const BaseLayer1 = styled.div`
  width: 869px;
  height: auto;
  padding-top: 2px;
  padding-bottom: 2px;

  ${layerA180Deg}

  border-radius: 5px;
  opacity: 1;

  ${justifyContentSpaceEvenly}
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
          width: 859px;
          height: auto;
          margin-top: 4px;
          margin-bottom: 4px;

          ${layerA}

          border-radius: 38px;
        `}

  ${flexBoxCenter};
  flex-direction: column;
`;

const AllHeadersWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile &&
    css`
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
    `}

  ${layerA}

  ${flexBoxCenter}
  flex-direction: column;
`;

const SystemHeaderWrapper = styled.div`
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
              border-radius: 25px 25px 29px 29px;
              padding-bottom: 4px;
            `}
        `
      : css`
          width: 855px;
          height: auto;
          padding: 2px;
          margin-top: 2px;
          border-radius: 36px;
          &:last-child {
            margin-bottom: 2px;
          }
        `}

  ${layerC}


  ${flexBoxCenter}
  flex-direction: column;
`;

const FlexWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 286px;
          height: auto;
          padding-top: 1px;
          padding-bottom: 1px;
          border-radius: 9px 9px 26px 26px;
        `
      : css`
          width: 851px;
          height: auto;
          margin-top: 8px;

          border-radius: 14px 14px 34px 34px;
        `}

  ${layerA180Deg}
  ${flexBoxCenter}
  flex-direction: column;
  position: relative;
`;

const ContentWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 282px;
          height: auto;
          padding-top: 1px;
          padding-bottom: 1px;
          ${layerCLighter}
          /* border-radius: 9px 9px 20px 20px; */
          border-radius: 9px;

          ${({ flexId }) =>
            flexId === 5
              ? css`
                  display: flex;
                  justify-content: space-evenly;
                  align-items: flex-start;
                  flex-wrap: wrap;
                `
              : flexId === 1
              ? css`
                  ${justifyContentSpaceEvenly}

                  gap: 6px;
                `
              : (flexId === 0 || flexId === 2) &&
                css`
                  ${flexBoxCenter}
                  gap: 2px;
                `}

          flex-direction: column;
        `
      : css`
          width: 845px;
          height: auto;
          padding-top: 2px;
          padding-bottom: 2px;
          margin-top: 2px;

          ${layerADark}

          border-radius: 11px;

          ${({ flexId }) =>
            flexId === 5
              ? css`
                  display: flex;
                  justify-content: space-evenly;
                  align-items: flex-start;
                  flex-wrap: wrap;
                `
              : flexId === 1
              ? css`
                  ${justifyContentSpaceEvenly}
                  flex-direction: column;
                  gap: 6px;
                `
              : (flexId === 0 || flexId === 2) &&
                css`
                  ${flexBoxCenter}
                  gap:9px
                `}
        `}
`;

const EditBoxWrapper = styled.div`
  z-index: 100;
  position: absolute;
  top: 0px;
`;

const FlexStartWrapper = styled.div`
  width: 100%;
  ${({ forceGasElectricMargin }) =>
    forceGasElectricMargin &&
    css`
      margin-top: 4px;
      margin-left: 2px;
    `}
  ${justifyContentFlexStart}
`;

const FlexGasWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          ${flexBoxCenter}
        `
      : css`
          margin-left: 2px;
          ${justifyContentFlexStart}
        `}

  width: 100%;
`;

const ButtonsWrapper = styled.div`
  ${({ isMobile, hp }) =>
    isMobile
      ? css`
          width: 100%;
          ${flexBoxCenter}
          margin-bottom: 12px;
        `
      : hp
      ? css`
          width: 100%;
          margin-top: 8px;
          margin-right: 24px;
          margin-bottom: 4px;
          ${justifyContentFlexEnd};
        `
      : css`
          width: 100%;
          margin-top: 8px;
          margin-right: 2px;
          margin-bottom: 12px;
          ${justifyContentFlexEnd};
        `}
`;
