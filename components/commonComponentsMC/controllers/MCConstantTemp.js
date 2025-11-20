import styled, { css } from "styled-components";
import {
  activeInput,
  activeLayer180Deg,
  flexBoxCenter,
  layerB,
  layerA,
  layerA180Deg,
  layerA90Deg,
  justifyContentSpaceBetween,
  grayModeLayer,
  DisableButtonIndentTop,
  readyTop180Deg,
} from "../../styles/commonStyles";
import { selectUnits } from "../../store/slices/settings/unitsSlice";
import { useSelector } from "react-redux";
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';

const MCConstantTemp = ({
  isMobile,
  handleOnClick,
  isActivated,
  tempInput,
  setTempInput,
  isReady,
  isDisabled,
  swtName,
    location,
    machine
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
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
  // temporary variables
  // const isF = false;
  // const isActivated = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    if (tempInput === "") {
      return;
    } else {
      if (isActivated || isReady) {
        handleOnClick("constantTemp", "off");
      } else {

        const temp = Number(tempInput.replace(/[^\d.-]/g, ''));

        if (isF) {
          if (temp > 76 && temp < 249) {
            handleOnClick("constantTemp", "on", temp);
          } else {
            // message box
            setTempInput("");
            handleOnClick("constantTemp", "tempB");
          }
        } else {
          if (temp > 24 && temp < 121) {
            handleOnClick("constantTemp", "on", temp);
          } else {
            setTempInput("");
            handleOnClick("constantTemp", "tempB");
          }
        }
      }
    }
  };

  const Logo = (EBP_mode === 0 && isEbp)|| isDisabled
    ? "/images/logo-constantTemp-disabled.svg"
    : "/images/logo-constantTemp.svg";

  return (
    <>
      {isMobile ? (
        <MobileWrapper isActivated={isActivated} isDisabled={isDisabled}>
          <ControllerForm
            onSubmit={handleSubmit}
            isActivated={isActivated}
            isReady={isReady}
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
              <MobileMainTop
                isActivated={isActivated}
                isDisabled={isDisabled}
                onClick={handleSubmit}
                isReady={isReady}
              >
                <MobileInput
                  isActivated={isActivated}
                  isDisabled={isDisabled}
                  disabled={isDisabled}
                  placeholder={isF ? "`--- °F`" : `--- °C`}
                  type="text"
                  value={tempInput}
                  onChange={(e) => isActivated || setTempInput(e.target.value)}
                />

                <MobileButton onClick={handleSubmit}>
                  <MobileButtonTop
                    isActivated={isActivated}
                    isReady={isReady}
                    isDisabled={isDisabled}
                  >
                    opt. const. <br></br>temperature<br></br>program
                  </MobileButtonTop>
                </MobileButton>
              </MobileMainTop>
            </SectionMobileMain>
          </ControllerForm>
        </MobileWrapper>
      ) : (
        <Wrapper>
          <MainOuterHole onSubmit={handleSubmit}>
            <MainOuterLayer
              isActivated={isActivated}
              isReady={isReady}
              isDisabled={(EBP_mode === 0 && isEbp)||isDisabled}
              style={{
                  pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                  cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                         }}
            >
              <MainInnerHole isActivated={isActivated} isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}>
                <MainTop
                  isActivated={isActivated}
                  isReady={isReady}
                  isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                  style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                >
                  <Button onClick={handleSubmit}>
                    <Title>
                      optional constant <br></br> temperature
                    </Title>
                  </Button>

                  <InputDegree
                    isActivated={isActivated}
                    isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                    disabled={(EBP_mode === 0 && isEbp)||isDisabled}
                    style={{
                        pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                        cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                               }}
                    placeholder={isF ? "`--- °F`" : `--- °C`}
                    type="text"
                    value={tempInput}
                    onChange={(e) =>
                      isActivated || setTempInput(e.target.value)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />

                  <SectionButton
                    isActivated={isActivated}
                    isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                    style={{
                        pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                        cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                               }}
                  >
                    <ButtonInner
                      isActivated={isActivated}
                      isReady={isReady}
                      isDisabled={(EBP_mode === 0 && isEbp)|| isDisabled}
                      style={{
                          pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                          cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                                 }}
                      onClick={handleSubmit}
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

export default MCConstantTemp;

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
    p.isActivated &&
    css`
      ${activeLayer180Deg}/* background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 2px #000000;
      border: 0.5px solid #000000; */
    `};
  ${({ isReady }) =>
    isReady &&
    css`
      ${readyTop180Deg}
    `}
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
  ${({ isReady }) =>
    isReady &&
    css`
      ${readyTop180Deg}
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
  ${({ isReady }) =>
    isReady &&
    css`
      ${readyTop180Deg}
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
    `}

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
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
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
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 3px #000000;
      border: 0.5px solid #142033;
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
  font-size: 8px;
  text-align: center;
  line-height: 95%;
  ${flexBoxCenter}
  ${({ isReady }) =>
    isReady &&
    css`
      ${readyTop180Deg}
    `}

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

// for desktop
const Wrapper = styled.div`
  width: 397px;
  height: 94px;
  border-radius: 6px;

  ${flexBoxCenter};
  ${layerA90Deg};
`;
const MainOuterHole = styled.form`
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

const Button = styled.div`
  width: 60%;
  ${flexBoxCenter}
`;

const Title = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  line-height: 98%;
  text-align: center;
  ${flexBoxCenter}
`;

const InputDegree = styled.input`
  width: 70px;
  height: 36px;
  border-radius: 25px;
  ${layerA}

  &::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput};
    `};
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop};
    `};

  ${justifyContentSpaceBetween};
  padding: 0 7px 0 10px;
`;

const SectionButton = styled.section`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  ${layerA}

  ${(p) =>
    p.isReady &&
    css`
      ${readyTop180Deg}
    `}
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

  ${flexBoxCenter};
`;
const ButtonInner = styled.button`
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
  height: 100%;
  margin-bottom: 3px;
`;
