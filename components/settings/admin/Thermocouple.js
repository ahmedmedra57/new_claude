import styled, { css } from 'styled-components';
import {
  ButtonReady,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
} from '../../styles/commonStyles';
import SaveButton from '../buttons/SaveButton';
import SelectLocationsBox from '../SelectLocationsBox';
import ActivateButton from '../buttons/ActivateButton';
import { useState } from 'react';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';

function Thermocouple({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  sysIndex,
  ess,
  tgs,
  tes,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  handleActivateDeactivateButton,
  isMobile,
  isActivate,
  isDeactivate,
}) {
  const { isApply } = useSelector(selectEditCancelApplyButtons);

  const messageBoxContent = {
    title: 'settings',
    subtitle: 'administration settings',
    theme: sysIndex === 0 ? 'ess-change options' : 'tes-change options',
    message:
      'please select switches to continue track temperature control t/c.',
  };

  const [openMessageBox, setOpenMessageBox] = useState(false);

  const handleCloseMessageBox = () => {
    setOpenMessageBox(false);
  };

  const handleOpenMessageBox = () => {
    setOpenMessageBox(true);
  };

  const activationButtonsData = [
    {
      isSelected: isDeactivate,
      index: 4,
      buttonTitle: ['deactivate', 'deactivated'],
    },
    {
      isSelected: isActivate,
      index: 1,
      buttonTitle: ['activate', 'activated'],
    },
  ];

  return (
    <BaseLayer isMobile={isMobile}>
      <Wrapper
        isMobile={isMobile}
        isDeactivate={isDeactivate && isApply}
        isActivate={isActivate && isApply}
      >
        <TitleWrapper isMobile={isMobile} isActivate={isActivate && isApply}>
          <Title isMobile={isMobile}>
            track temperature <br /> control t/c
          </Title>
        </TitleWrapper>
        <SelectLocationsBoxWrapper isMobile={isMobile}>
          <SelectLocationsBox
            selectedOne={selectedOne}
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            sysIndex={sysIndex}
            ess={ess}
            tgs={tgs}
            tes={tes}
            sysOptions={'admin'}
            program={'admin'}
            // handleSelectIndividualMachine={handleSelectIndividualMachine}
            // handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
            isMobileTC={isMobile}
            isDeactivate={isDeactivate && isApply}
            isActivate={isActivate && isApply}
          />
        </SelectLocationsBoxWrapper>
        <NoThermocoupleWrapper
          isMobile={isMobile}
          isActivate={isActivate && isApply}
        >
          <FlexWrapper isMobile={isMobile}>
            <Description>
              No thermocouple temperature control (will run on full power)
            </Description>
          </FlexWrapper>
        </NoThermocoupleWrapper>

        <WrapperButtons isMobile={isMobile}>
          {activationButtonsData.map(
            ({ isSelected, index, buttonTitle }, idx) => (
              <ActivateButton
                key={idx}
                handleButtons={() => handleActivateDeactivateButton(index)}
                isSelected={isSelected}
                buttonTitles={buttonTitle}
                isApplied={isApply}
                selectedOne={selectedOne}
                handleOpenMessageBox={handleOpenMessageBox}
              />
            )
          )}

          {/* <ActivateButton
            handleButtons={() => handleActivateDeactivateButton(4)}
            isSelected={isDeactivate}
            buttonTitles={['deactivate', 'deactivated']}
            isApplied={isApply}
            selectedOne={selectedOne}
            handleOpenMessageBox={handleOpenMessageBox}
          />
          <ActivateButton
            handleButtons={() => handleActivateDeactivateButton(1)}
            isSelected={isActivate}
            buttonTitles={['activate', 'activated']}
            isApplied={isApply}
            selectedOne={selectedOne}
            handleOpenMessageBox={handleOpenMessageBox}
          /> */}
        </WrapperButtons>
        {openMessageBox && (
          <SettingAppliedMessage
            message={messageBoxContent}
            onClose={handleCloseMessageBox}
          />
        )}
      </Wrapper>
    </BaseLayer>
  );
}

export default Thermocouple;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 282px;
          height: 192px;
        `
      : css`
          width: 274px;
          height: 205px;
        `}

  ${layerB}

  border-radius: 10px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 280px;
          height: 190px;
          ${justifyContentSpaceEvenly}
        `
      : css`
          width: 272px;
          height: 203px;
          ${justifyContentSpaceAround}
        `}

  ${layerA180Deg}

  border-radius: 9px;
  flex-direction: column;

  ${({ isDeactivate, isActivate }) =>
    isDeactivate
      ? css`
          ${ButtonReady}

          box-shadow: 0px 0px 2px #000000;
        `
      : isActivate &&
        css`
          background: transparent
            linear-gradient(180deg, #ff920c 0%, #804906 100%) 0% 0% no-repeat
            padding-box;
          box-shadow: 0px 0px 2px #000000;
          border: 0.5px solid #000000;
        `}
`;

const TitleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 269px;
          border-radius: 24px;
        `
      : css`
          width: 264px;
          border-radius: 16px;
        `}
  height: 32px;

  ${layerA}

  ${flexBoxCenter}
  
${({ isActivate }) =>
    isActivate &&
    css`
      background: #774200 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 3px #000000;
    `}
`;

const Title = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 180px;
          height: 27px;
          letter-spacing: 1.2px;
          ${flexBoxCenter}
        `
      : css`
          width: 178px;

          letter-spacing: 0.9px;
        `}

  text-align: center;
  font-size: 12px;
`;

const SelectLocationsBoxWrapper = styled.div`
  z-index: 10;
`;

const NoThermocoupleWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 269px;
          height: 44px;
          border-radius: 24px;
        `
      : css`
          width: 264px;
          height: 54px;
          border-radius: 22px;
        `}

  ${layerA}

  ${flexBoxCenter}

  ${({ isActivate }) =>
    isActivate &&
    css`
      background: #774200 0% 0% no-repeat padding-box;
      box-shadow: inset 0px 0px 3px #000000;
    `}
`;

const FlexWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 200px;
          height: 38px;
        `
      : css`
          width: 188px;
          height: 32px;
        `}

  ${flexBoxCenter}
`;

const Description = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
`;

const WrapperButtons = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          ${flexBoxCenter}
          width: 98%;
        `
      : css`
          width: 96%;
          ${justifyContentFlexEnd}
          gap: 6px;
        `}
`;
