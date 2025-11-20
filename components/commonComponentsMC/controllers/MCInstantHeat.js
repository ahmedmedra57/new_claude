import styled, { css } from 'styled-components';
import { import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../../zustand-stores';

  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  layerB,
  layerA,
  layerA180Deg,
  layerA90Deg,
  justifyContentSpaceBetween,
  flexDirectionColumn,
  layerAGreen180Deg,
  layerBGreen,
  borderABlue,
  grayModeLayer,
  layerADisabled180Deg,
  DisableApplyButtonHole,
  DisableButtonIndentTop,
  readyTop180Deg,
} from '../../styles/commonStyles';
import { leastIndex } from 'd3-array';
import { useState } from 'react';

import MessageBoxButton from '../../userMessages/MessageBoxButton';
import InputTempMessage from '../../userMessages/inputTempMessage';

const MCInstantHeat = ({
  isMobile,
  tempInput,
  setTempInput,
  isActivated,
  handleOnClick,
  isMasterControl,
  isDisabled,
  isReady,
  location,
  swtName,
  machine,
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = swtName === 'ess'
      ? useESSSwitchStore()
      : swtName === 'tgs'
      ? useTGSSwitchStore()
      : useTESSwitchStore();
   const switchStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
    const { isEbp,EBP_mode } = switchStatus[location][machine];
  // temporary variables
  // const isF = false;
  // temporary variables

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    if (tempInput === '') {
      handleOnClick('instantHeat', 'tempMissing');
      return;
    } else {
      if (isActivated || isReady) {
        handleOnClick('instantHeat', 'off');
      } else {
        const temp = Number(tempInput.match(/\d+/));

        if (isF) {
          if (temp >= 250 && temp <= 1830) {
            handleOnClick('instantHeat', 'on', temp);
          } else {
            // message box

            handleOnClick('instantHeat', 'tempA');
          }
        } else {
          if (temp >= 121 && temp <= 999) {
            handleOnClick('instantHeat', 'on', temp);
          } else {
            handleOnClick('instantHeat', 'tempA');
          }
        }
      }
    }
  };

  const Logo = (EBP_mode === 0 && isEbp)|| isDisabled
    ? '/images/logo-instantHeat-disabled.svg'
    : '/images/logo-instantHeat.svg';
  return (
    <>
      {isMobile ? (
        <MobileWrapper
          isActivated={isActivated}
          isReady={isReady}
          isDisabled={isDisabled}
        >
          <ControllerForm
            onSubmit={handleSubmit}
            isActivated={isActivated}
            isReady={isReady}
            isDisabled={isDisabled}
          >
            <SectionCircle
              isActivated={isActivated}
              isReady={isReady}
              isDisabled={isDisabled}
            >
              <CircleHole
                isActivated={isActivated}
                isReady={isReady}
                isDisabled={isDisabled}
              >
                <CircleTop
                  isActivated={isActivated}
                  isReady={isReady}
                  isDisabled={isDisabled}
                >
                  <LogoImg src={Logo} />
                </CircleTop>
              </CircleHole>
            </SectionCircle>

            <SectionMobileMain
              isActivated={isActivated}
              isReady={isReady}
              isDisabled={isDisabled}
            >
              <MobileMainTop
                isActivated={isActivated}
                isReady={isReady}
                isDisabled={isDisabled}
                onClick={handleSubmit}
              >
                <MobileInput
                  isActivated={isActivated}
                  isReady={isReady}
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  placeholder={isF ? '`--- °F`' : `--- °C`}
                  type='text'
                  value={tempInput}
                  onChange={(e) => {
                    isActivated || setTempInput(e.target.value);
                  }}
                />

                <MobileButton onClick={handleSubmit}>
                  <MobileButtonTop
                    isActivated={isActivated}
                    isReady={isReady}
                    isDisabled={isDisabled}
                  >
                    instant heat <br></br>program
                  </MobileButtonTop>
                </MobileButton>
              </MobileMainTop>
            </SectionMobileMain>
          </ControllerForm>
        </MobileWrapper>
      ) : (
        <Wrapper>
          <MainOuterHole onSubmit={handleSubmit} 
           isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
          style={{
    pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
          >
            <MainOuterLayer
              isActivated={isActivated}
              isReady={isReady}
              isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
              style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
            >
              <MainInnerHole isActivated={isActivated} isDisabled={isDisabled}
              >
                <MainTop
                  isActivated={isActivated}
                  isReady={isReady}
                  isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                  style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                  onClick={handleSubmit}
                >
                  <SectionTitleAndInput>
                    <Button disabled={isDisabled}>
                      <Title>
                        instant heat <br></br>program
                      </Title>
                    </Button>

                    <InputDegree
                      isActivated={isActivated}
                      disabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                      isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                      style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                      placeholder={isF ? '`--- °F`' : `--- °C`}
                      type='text'
                      value={tempInput}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        isActivated || setTempInput(e.target.value);
                      }}
                    />
                  </SectionTitleAndInput>

                  <SectionButton
                    isActivated={isActivated}
                    isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                    style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                  >
                    <ButtonInner
                      isActivated={isActivated}
                      isReady={isReady}
                      isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                      style={{
    pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
           }}
                    >
                      <ButtonTop
                        isActivated={isActivated}
                        isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                        style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp)? 'not-allowed' : 'auto',
           }}
                      >
                        <LogoImg src={Logo} style={{
    pointerEvents: (EBP_mode === 0 && isEbp) ? 'none' : 'auto',
    cursor: (EBP_mode === 0 && isEbp)? 'not-allowed' : 'auto',
           }}/>
                      </ButtonTop>
                    </ButtonInner>
                  </SectionButton>
                </MainTop>
              </MainInnerHole>
            </MainOuterLayer>
          </MainOuterHole>
        </Wrapper>
      )}
    </>
  );
};

export default MCInstantHeat;
const MobileWrapper = styled.div`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
`;
const ControllerForm = styled.form`
  width: 299px;
  height: 50px;
  border-radius: 31px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 5px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `};

  ${(p) =>
    p.isActivated &&
    css`
      ${layerAGreen180Deg};
    `};
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;

const SectionCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;

  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const CircleHole = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${layerAGreen180Deg};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const CircleTop = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isActivated &&
    css`
      ${layerBGreen};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const SectionMobileMain = styled.section`
  width: 246px;
  height: 42px;
  border-radius: 26px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MobileMainTop = styled.div`
  width: 241px;
  height: 38px;
  border-radius: 23px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 4px;

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `};
  ${(p) =>
    p.isActivated &&
    css`
      ${layerAGreen180Deg};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MobileInput = styled.input`
  width: 91px;
  height: 30px;
  border-radius: 18px;
  ${layerA};
  font-size: 11px;
  ${flexBoxCenter};

  ::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MobileButton = styled.button`
  width: 137px;
  height: 30px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.isActivated &&
    css`
      ${layerBGreen};
      ${borderABlue};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MobileButtonTop = styled.div`
  width: 135px;
  height: 28px;
  border-radius: 17px;
  ${layerA180Deg};
  font-size: 12px;
  text-align: center;
  line-height: 95%;
  ${flexBoxCenter}
  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `};

  ${(p) =>
    p.isActivated &&
    css`
      ${layerAGreen180Deg};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;

// for Desktop
const Wrapper = styled.div`
  width: 397px;
  height: 145px;
  border-radius: 6px;

  ${flexBoxCenter};
  ${layerA90Deg};
`;
const MainOuterHole = styled.form`
  width: 389px;
  height: 126px;
  border-radius: 63px;
  ${layerA}
  ${flexBoxCenter}
`;

const MainOuterLayer = styled.div`
  width: 385px;
  height: 122px;
  border-radius: 61px;

  ${flexBoxCenter};
  ${layerA180Deg};

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MainInnerHole = styled.div`
  ${flexBoxCenter}
  ${layerB};

  width: 369px;
  height: 106px;
  border-radius: 53px;

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MainTop = styled.div`
  width: 367px;
  height: 104px;
  border-radius: 52px;
  ${layerA180Deg};

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeLayer180Deg};
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};

  ${justifyContentSpaceBetween};
  padding: 0 2px 0 10px;
`;
const SectionTitleAndInput = styled.section`
  height: 100%;
  width: 70%;

  ${flexDirectionColumn};
  padding: 10px 0 5px 25px;
`;
const Button = styled.button`
  width: 100%;
`;
const Title = styled.span`
  font-size: 21px;
  letter-spacing: 2.1px;
  line-height: 98%;
`;

const InputDegree = styled.input`
  width: 145px;
  height: 36px;
  border-radius: 25px;
  opacity: 1;
  font-size: 22px;
  letter-spacing: 2.2px;

  ${layerA}

  &::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop};
    `};
`;
const SectionButton = styled.section`
  width: 98px;
  height: 98px;
  border-radius: 50%;
  ${layerA}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}
   
    
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop};
    `};

  ${flexBoxCenter}
`;
const ButtonInner = styled.button`
  width: 94px;
  height: 94px;
  border-radius: 50%;
  ${layerA180Deg}

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
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};

  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 79px;
  height: 79px;
  border-radius: 50%;

  ${layerA}
  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop};
    `};

  ${flexBoxCenter}
`;
const LogoImg = styled.img`
  height: 120%;
`;
