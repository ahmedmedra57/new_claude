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
  grayModeLayer,
  DisableButtonIndentTop,
} from '../../styles/commonStyles';
import { useSelector } from 'react-redux';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';


const MCSnowSensor = ({
  handleOnClick,
  isActivated,
  isReady,
  defaultTemp,
  isMobile,
  isDisabled,
  swtName,
  location,
  machine
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  // temporary variables
  // const isF = false;
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
      swtName === 'ess'
        ? selectEssSwitch
        : swtName === 'tgs'
        ? selectTgsSwitch
        : selectTesSwitch
    );
const switchStatus =
    swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;
    const { isEbp,EBP_mode } = switchStatus[location][machine];
    
  const handleClick = () => {
    if (isDisabled) return;
    if (isReady || isActivated) {
      handleOnClick('snowSensor', 'off');
    } else {
      handleOnClick('snowSensor', 'on');
    }
  };

  const Logo = (EBP_mode === 0 && isEbp)|| isDisabled
    ? '/images/logo-snowSensor-disabled.svg'
    : '/images/logo-snowSensor.svg';

  return (
    <>
      {isMobile ? (
        <MobileWrapper>
          <Button
            onClick={handleClick}
            isActivated={isActivated}
            isDisabled={isDisabled}
          >
            <SectionCircle isActivated={isActivated} isDisabled={isDisabled}>
              <CircleHole
                isActivated={isActivated}
                isDisabled={isDisabled}
                isReady={isReady}
              >
                <CircleTop isActivated={isActivated} isDisabled={isDisabled}>
                  <LogoImg src={Logo} />
                </CircleTop>
              </CircleHole>
            </SectionCircle>

            <SectionMobileMain
              isActivated={isActivated}
              isDisabled={isDisabled}
            >
              <MobileMainHole
                isActivated={isActivated}
                isDisabled={isDisabled}
                isReady={isReady}
              >
                <MobileMainTop
                  isReady={isReady}
                  isActivated={isActivated}
                  isDisabled={isDisabled}
                >
                  snow sensor<br></br>program
                </MobileMainTop>
              </MobileMainHole>
            </SectionMobileMain>
          </Button>
        </MobileWrapper>
      ) : (
        <Wrapper>
          <MainOuterHole
          isDisabled={(EBP_mode === 0 && isEbp)||isDisabled }
            style={{
               pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
               cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                      }}
          >
            <MainOuterLayer
              isReady={isReady}
              isActivated={isActivated}
              isDisabled={(EBP_mode === 0 && isEbp)||isDisabled }
              onClick={handleClick}
              style={{
                  pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                  cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                         }}
              
            >
              <MainInnerHole isActivated={isActivated} isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}>
                <MainTop
                  isReady={isReady}
                  isActivated={isActivated}
                  isDisabled={(EBP_mode === 0 && isEbp)||isDisabled}
                  style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                >
                  <Title>
                    snow sensor <br></br>program
                  </Title>
                  <DefaultDegreeWrapper
                    isReady={isReady}
                    isActivated={isActivated}
                    isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                    style={{
                        pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                        cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                               }}
                  >
                    <DefaultDegree>
                      default <br></br>temp.
                    </DefaultDegree>
                    <Divider></Divider>
                    <DefaultDegree degree={true}>{defaultTemp}</DefaultDegree>
                  </DefaultDegreeWrapper>

                  <SectionButton
                    isActivated={isActivated}
                    isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                    style={{
                        pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                        cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                               }}
                  >
                    <ButtonInner
                      isReady={isReady}
                      isActivated={isActivated}
                      isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                      style={{
                          pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                          cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                                 }}
                    >
                      <ButtonTop
                        isActivated={isActivated}
                        isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                        style={{
                            pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                            cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                                   }}
                      >
                        <LogoImg src={Logo} />
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

export default MCSnowSensor;

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

  ${(p) => p.isReady && css``}
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
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
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
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
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
      background: #124000;
      box-shadow: inset 0px 0px 2px #000000;
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
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isActivated &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
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
    p.isReady &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `};

  ${(p) =>
    p.isActivated &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
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
const MainOuterHole = styled.button`
  width: 389px;
  height: 78px;
  border-radius: 39px;
  ${layerA}
  ${flexBoxCenter}
`;

const MainOuterLayer = styled.div`
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
      ${activeLayer180Deg}
    `}
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};

  ${justifyContentSpaceBetween};

  padding: 0 2px 0 10px;
`;

const Title = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  line-height: 98%;
`;

const DefaultDegreeWrapper = styled.div`
  width: 145px;
  height: 36px;
  border-radius: 25px;
  ${layerA}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `};
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop}
    `};

  ${justifyContentSpaceBetween};
  padding: 0 7px 0 10px;
`;

const DefaultDegree = styled.span`
  font-size: 10px;
  line-height: 98%;

  ${(p) =>
    p.degree
      ? css`
          font-size: 14px;
        `
      : css`
          padding-top: 3px;
        `}
`;
const Divider = styled.div`
  height: 75%;
  border: 1.5px solid #fff;
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

  ${(p) => p.isReady && css``}
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
