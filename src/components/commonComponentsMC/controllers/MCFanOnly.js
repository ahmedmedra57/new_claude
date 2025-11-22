import styled, { css } from 'styled-components';

import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  layerB,
  layerA,
  layerA180Deg,
  layerA90Deg,
  readyTop180Deg,
  justifyContentSpaceBetween,
  layerAGreen180Deg,
  layerBGreen,
  grayModeLayer,
  DisableButtonIndentTop,
} from '../../styles/commonStyles';

const MCFanOnly = ({
  handleOnClick,
  isActivated,
  isMobile,
  isWifi,
  isDisabled,
  isFanDisabled,
}) => {
  const handleClick = () => {
    if (!isWifi) return;
    if (isActivated) {
      handleOnClick('fanOnly', 'off');
    } else {
      handleOnClick('fanOnly', 'on');
    }
  };

  // const logo = !isWifi
  //   ? '/images/logo-fanOnly-disabled.svg'
  //   : '/images/tgs-fanOnly.svg';

  const logo = isFanDisabled
    ? '/images/logo-fanOnly-disabled.svg'
    : '/images/tgs-fanOnly.svg';

  return (
    <>
      {isMobile ? (
        <MobileWrapper>
          <Button
            onClick={handleClick}
            isActivated={isActivated}
            // isDisabled={!isWifi}
            isDisabled={isDisabled}
          >
            <SectionCircle
              isActivated={isActivated}
              // isDisabled={!isWifi}
              isDisabled={isDisabled}
            >
              <CircleHole
                isActivated={isActivated}
                isDisabled={isDisabled}
                //  isDisabled={!isWifi}
              >
                <CircleTop
                  isActivated={isActivated}
                  // isDisabled={!isWifi}
                  isDisabled={isDisabled}
                >
                  <LogoImg src={logo} />
                </CircleTop>
              </CircleHole>
            </SectionCircle>

            <SectionMobileMain
              isActivated={isActivated}
              // isDisabled={!isWifi}
              isDisabled={isDisabled}
            >
              <MobileMainHole
                isActivated={isActivated}
                // isDisabled={!isWifi}
                isDisabled={isDisabled}
              >
                <MobileMainTop
                  isActivated={isActivated}
                  // isDisabled={!isWifi}
                  isDisabled={isDisabled}
                >
                  fan only
                </MobileMainTop>
              </MobileMainHole>
            </SectionMobileMain>
          </Button>
        </MobileWrapper>
      ) : (
        <Wrapper>
          <MainOuterHole>
            <MainOuterLayer
              isActivated={isActivated}
              isDisabled={isFanDisabled}
              // isDisabled={!isWifi}
              onClick={handleClick}
            >
              <MainInnerHole
                isActivated={isActivated}
                // isDisabled={!isWifi}
                isDisabled={isFanDisabled}
              >
                <MainTop
                  isActivated={isActivated}
                  // isDisabled={!isWifi}
                  isDisabled={isFanDisabled}
                >
                  <Title>fan only</Title>

                  <SectionButton
                    isActivated={isActivated}
                    // isDisabled={!isWifi}
                    isDisabled={isFanDisabled}
                  >
                    <ButtonInner
                      isActivated={isActivated}
                      // isDisabled={!isWifi}
                      isDisabled={isFanDisabled}
                    >
                      <ButtonTop
                        isActivated={isActivated}
                        // isDisabled={!isWifi}
                        isDisabled={isFanDisabled}
                      >
                        <LogoImg src={logo} />
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

export default MCFanOnly;

const MobileWrapper = styled.div`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
`;
const Button = styled.button`
  width: 299px;
  height: 50px;
  border-radius: 31px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 5px;

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
const MobileMainHole = styled.div`
  width: 241px;
  height: 38px;
  border-radius: 23px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 4px;

  ${(p) =>
    p.isActivated &&
    css`
      ${layerAGreen180Deg}
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;

const MobileMainTop = styled.div`
  width: 231px;
  height: 28px;
  border-radius: 17px;
  ${layerA180Deg};
  ${flexBoxCenter};

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

  font-size: 12px;
  letter-spacing: 1.2px;
  line-height: 98%;
`;

// for desktop
const Wrapper = styled.div`
  width: 397px;
  height: 94px;
  border-radius: 6px;

  ${flexBoxCenter};
  ${layerA90Deg};
`;
const MainOuterHole = styled.div`
  width: 389px;
  height: 78px;
  border-radius: 39px;

  ${layerA};
  ${flexBoxCenter}
`;

const MainOuterLayer = styled.button`
  width: 385px;
  height: 74px;
  border-radius: 37px;

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
  width: 369px;
  height: 58px;
  border-radius: 29px;

  ${layerB};
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `}
    ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MainTop = styled.div`
  width: 367px;
  height: 56px;
  border-radius: 28px;
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

  ${justifyContentSpaceBetween}

  padding: 0 2px 0 45px;
`;

const Title = styled.span`
  font-size: 18px;
  letter-spacing: 1.8px;
  width: 80%;
`;

const SectionButton = styled.section`
  width: 50px;
  height: 50px;
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
      ${grayModeLayer};
    `};

  ${flexBoxCenter}
`;
const ButtonInner = styled.div`
  width: 48px;
  height: 48px;
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
  width: 40px;
  height: 40px;
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
