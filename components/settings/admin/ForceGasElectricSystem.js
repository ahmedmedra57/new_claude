import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
} from '../../styles/commonStyles';
import SelectLocationsBox from '../SelectLocationsBox';
import { useState } from 'react';
import SettingAppliedMessage from '../../masterControl/userMessages/SettingAppliedMessage';

function ForceGasElectricSystem({
  selectedOne,
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  sys,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  handleSaveButton,
  enableSwitch,
  setEnableSwitch,
  isActivate,
}) {
  const messageBoxContent = {
    title: 'settings',
    subtitle: 'administration settings',
    theme: 'system commands-change options',
    message:
      'please select switches to continue force - gas & electric system simultaneously on for 15 minutes.',
  };

  const buttonsState = useSelector(selectEditCancelApplyButtons);
  const { isEdit } = buttonsState;

  const enableSwitchImg = '/images/forceGasElectricSystem-enableSwitch.svg';

  const disableSwitchImg = '/images/forceGasElectricSystem-disableSwitch.svg';

  const [openMessageBox, setOpenMessageBox] = useState(false);

  const handleOpenMessageBox = () => {
    setOpenMessageBox(true);
  };

  const handleCloseMessageBox = () => {
    setOpenMessageBox(false);
  };

  return (
    <BaseLayer>
      <Wrapper>
        <WrapperTitle>
          <Title>
            Force - gas & electric system simultaneously on for 15 minutes
          </Title>
        </WrapperTitle>
        {/* select location box */}
        <SelectLocationWrapper>
          <SelectLocationsBox
            selectedOne={selectedOne}
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            sysIndex={'forceGasAndElectricSys'}
            multipleSelectBoxes={true}
            sysOptions={'admin'}
            swt={'sys'}
            program={'admin'}
            ess={ess}
            tgs={tgs}
            tes={tes}
            sys={sys}
            // handleSelectIndividualMachine={handleSelectIndividualMachine}
            // handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
          />
        </SelectLocationWrapper>
        <ImageAndButtonWrapper>
          {/* toggle enable disable img */}
          <Img
            src={enableSwitch ? enableSwitchImg : disableSwitchImg}
            onClick={() => {
              isEdit && setEnableSwitch((prev) => !prev);
            }}
          />
          {/* activate button */}
          <ButtonWrapper>
            <Button
              onClick={() =>
                selectedOne ? handleSaveButton(5) : handleOpenMessageBox()
              }
              isActivate={isEdit && isActivate && selectedOne}
            >
              <ButtonHole>
                <ButtonTop>
                  <ButtonTitle>
                    {isEdit && isActivate ? 'activated' : 'activate'}
                  </ButtonTitle>
                </ButtonTop>
              </ButtonHole>
            </Button>
          </ButtonWrapper>
        </ImageAndButtonWrapper>
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

export default ForceGasElectricSystem;

const BaseLayer = styled.div`
  width: 274px;
  height: 137px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;

  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 272px;
  height: 135px;

  ${layerA180Deg}

  border-radius: 8px;
  opacity: 1;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  width: 264px;
  height: 44px;

  ${layerA}

  border-radius: 22px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 12rem;
  text-align: center;
  letter-spacing: 1.2px;
  color: #ffffff;
`;

const SelectLocationWrapper = styled.div`
  z-index: 10;
`;

const ImageAndButtonWrapper = styled.div`
  width: 264px;
  height: 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const Img = styled.img`
  cursor: pointer;
  width: 124px;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  width: 123px;
  height: 29px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  width: 121px;
  height: 27px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ isActivate }) =>
    isActivate &&
    css`
      border: 1px solid #95ff45;
    `}
`;

const ButtonHole = styled.div`
  width: 115px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 113px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTitle = styled.div`
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;
