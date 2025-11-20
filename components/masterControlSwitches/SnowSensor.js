import { useState } from 'react';
import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore } from '../zustand-stores';
import { useUnitsStore } from '../zustand-stores';

import { useMediaQuery } from 'react-responsive';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerC,
  layerA,
  readyTop180Deg,
  layerADisabled180Deg,
  layerBDisabled,
} from '../styles/commonStyles';

import styled, { css } from 'styled-components';

import SelectLocations from './SelectLocations';
import InputTempMessage from '../userMessages/inputTempMessage';

const SnowSensor = ({
  scope,
  handleOnClick,
  swtName,
  handleClose,
  // isSpecificLocation,
  specificLocation,
  disabled
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = scope === 'switch'
    ? useMasterControlBySwitchSelectStore()
    : useMasterControlSelectByLocationStore();
  const { selectedOne } = switchStatus.snowSensor;

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Local
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);
  // ********* temporary variables *********
  const defaultTemp = 350;
  // const isF = false;
  // ********* temporary variables *********

  // useEffect(() => {
  //   // Logic for access selected machine
  //   Object.keys(essSwitch).forEach((location) =>
  //     Object.keys(essSwitch[location]).forEach((machine) => {
  //       dispatch(handleUnSelectIndividualMachine({ location, machine });
  //     })
  //   );
  // }, []);

  // Logic for access selected machine --- checker
  // Object.keys(essSwitch).forEach((location) =>
  //   Object.keys(essSwitch[location]).forEach((machine) => {
  //     if (essSwitch[location][machine].isSelected) {
  //       // dispatch hear

  //     }
  //   })
  // );

  const handleApply = () => {
    if (!selectedOne) {
      // Message box
      // please select locations first
      handleOnClick(
        'snowSensor',
        'selectA',
        scope,
        '_',
        '_',
        type,
        specificLocation
      );
      setOpenMessageBox(true);
      setMessages(['select locations', 'please select location to continue']);
    } else {
      handleOnClick('snowSensor', 'on', scope);
      // if mobile and location scope, close the expanded state

      if (isMobile && scope !== 'switch') {
        handleClose();
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          {scope === 'switch' ? (
            <MobileWrapper isExpanded={isExpanded}>
              <SectionController
                isMobile={isMobile}
                isMargin={isMobile && isExpanded}
              >
                <MobileHole>
                  <MobileTop>
                    <SectionCircle>
                      <CircleButton onClick={handleApply}>
                        <CircleHole>
                          <LogoImg src='images/logo-snowSensor.svg' />
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>

                    <SectionHeatButton>
                      <HeatButton onClick={handleApply}>
                        snow sensor<br></br> program
                      </HeatButton>
                    </SectionHeatButton>

                    <SectionCircle>
                      <CircleButton
                        isExpanded={isExpanded}
                        onClick={() => {
                          setIsExpanded(!isExpanded);
                        }}
                      >
                        <CircleHole>
                          <CircleTop isExpanded={isExpanded}>
                            <LogoImg
                              isSm={true}
                              src={
                                isExpanded
                                  ? '/images/MC-expand-true.svg'
                                  : '/images/MC-expand-false.svg'
                              }
                            />
                          </CircleTop>
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>
                  </MobileTop>
                </MobileHole>
              </SectionController>

              {isExpanded && (
                <SelectLocations
                  name='snowSensor'
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                  // isSpecificLocation={isSpecificLocation}
                />
              )}
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={'master control'}
                    subtitle={'snow sensor program'}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          ) : (
            <MobileWrapper isExpanded={isExpanded} isSmall={true}>
              <SectionSelect>
                <SelectLocations
                  name='snowSensor'
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                  // isSpecificLocation={isSpecificLocation}
                />
              </SectionSelect>

              <ScopeWrapper>
                <SectionController
                  isMobile={isMobile}
                  isMargin={isMobile && isExpanded}
                  isSmall={true}
                >
                  <SectionCircle isSmall={true}>
                    <CircleButton onClick={handleApply} isSmall={true}>
                      <CircleHole isSmall={true}>
                        <LogoImg src='images/logo-snowSensor.svg' />
                      </CircleHole>
                    </CircleButton>
                  </SectionCircle>

                  <MobileHole isSmall={true}>
                    <MobileTop isSmall={true}>
                      <HeatButton onClick={handleApply} isSmall={true}>
                        snow sensor program
                      </HeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={'master control'}
                    subtitle={'snow sensor program'}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          )}
        </>
      ) : (
        <Wrapper>
          <SectionTop>
            <TitleWrapper>
              <Title>snow sensor program</Title>
              <ImgWrapper>
                <Img src='images/logo-snowSensor.svg' />
              </ImgWrapper>
            </TitleWrapper>

            <SelectLocations
              size={1}
              name='snowSensor'
              scope={scope}
              swtName={swtName}
              specificLocation={specificLocation}
              // isSpecificLocation={isSpecificLocation}
            />
          </SectionTop>

          <SectionController>
            <SectionDisplay>
              <DisplayTop>
                <DisplayTitle>
                  default trigger <br></br>temperature
                </DisplayTitle>
                <Divider></Divider>
                <DefaultTemp>
                  {defaultTemp} {isF ? '°F' : '°C'}
                </DefaultTemp>
              </DisplayTop>
              <InfoDefaultTemp>* change temp. in settings</InfoDefaultTemp>
            </SectionDisplay>

            <SectionButton>
              <ButtonWrapper onClick={handleApply} disabled={disabled}>
                <ButtonHole disabled={disabled}>
                  <ButtonTop disabled={disabled}>apply</ButtonTop>
                </ButtonHole>
              </ButtonWrapper>
            </SectionButton>
            {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                title={'master control'}
                messages={messages}
              />
            </MessageBoxWrapper>
          )}
          </SectionController>
        </Wrapper>
      )}
    </>
  );
};
export default SnowSensor;

const MobileWrapper = styled.div`
  position: relative;
  ${(p) =>
    p.isSmall
      ? css`
          ${flexDirectionColumn};
        `
      : css`
          width: 314px;
          height: 72px;
          border-radius: 36px;
          ${flexBoxCenter}
          ${layerC}

          ${(p) =>
            p.isExpanded &&
            css`
              height: auto;
              border-radius: 36px;
              ${flexDirectionColumn};
              padding: 2px 0;
            `}
            margin-bottom: 8px;
        `}
`;

const ScopeWrapper = styled.div`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA}
  ${flexBoxCenter};
  margin-bottom: 6px;
`;

const MobileHole = styled.div`
  width: 299px;
  height: 58px;
  border-radius: 29px;

  ${layerA};
  ${flexBoxCenter};
  ${(p) =>
    p.isSmall &&
    css`
      width: 246px;
      height: 42px;
      border-radius: 26px;
    `}
`;
const MessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 50px;
  left: 30px;

  z-index: 100;
`;

const MobileTop = styled.div`
  width: 293px;
  height: 52px;
  border-radius: 26px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 2px;

  ${(p) =>
    p.isSmall &&
    css`
      width: 241px;
      height: 38px;
      border-radius: 23px;
      ${flexBoxCenter};
    `}
`;

const SectionCircle = styled.section`
  ${(p) =>
    p.isSmall
      ? css`
          width: 40px;
          height: 40px;
        `
      : css`
          width: 48px;
          height: 48px;
        `}
  border-radius: 50%;
  ${layerC};
  ${flexBoxCenter};
`;
const CircleButton = styled.button`
  ${(p) =>
    p.isSmall
      ? css`
          width: 38px;
          height: 38px;
        `
      : css`
          width: 46px;
          height: 46px;

          ${(p) =>
            p.isExpanded &&
            css`
              ${readyTop180Deg}
            `}
        `}
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      ${readyTop180Deg}
    `}
`;
const CircleHole = styled.div`
  ${(p) =>
    p.isSmall
      ? css`
          width: 30px;
          height: 30px;
        `
      : css`
          width: 36px;
          height: 36px;
        `}

  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
`;
const CircleTop = styled.div`
  ${(p) =>
    p.isSmall
      ? css``
      : css`
          width: 34px;
          height: 34px;

          ${(p) =>
            p.isExpanded &&
            css`
              ${readyTop180Deg}
            `}
        `}

  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded &&
    css`
      ${readyTop180Deg}
    `}
`;

const LogoImg = styled.img`
  height: 120%;
  ${(p) =>
    p.isSm &&
    css`
      height: auto;
    `}
`;

const SectionHeatButton = styled.section`
  width: 188px;
  height: 36px;
  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}
`;
const HeatButton = styled.button`
  border-radius: 17px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isSmall
      ? css`
          width: 231px;
          height: 28px;
          font-size: 12px;
        `
      : css`
          width: 186px;
          height: 34px;
          line-height: 95%;
          padding-top: 2px;
          font-size: 10px;
        `}
`;

const SectionSelect = styled.section`
  width: 303px;
  height: auto;
  border-radius: 34px;
  ${layerA};
  ${flexBoxCenter};
  padding: 2px 0;
  margin-bottom: 6px;
`;

// -- for desktop
const Wrapper = styled.div`
  width: 208px;
  height: 200px;
  border-radius: 7px;

  ${layerA180Deg}
  ${flexDirectionColumn}  

  padding: 2rem 0;
`;

const TitleWrapper = styled.div`
  width: 201rem;
  height: 22rem;

  border-radius: 33px;

  ${layerADark};
  ${justifyContentSpaceBetween};

  padding: 0 1px 0 10rem;
  margin-bottom: 4rem;
`;
const Title = styled.span`
  font-size: 8px;
`;
const ImgWrapper = styled.div`
  height: 100%;
  width: 20px;
  ${flexBoxCenter};
  padding-bottom: 0.8px;
`;
const Img = styled.img`
  height: 120%;
  /* margin-bottom: 0.6px; */
`;

const SectionTop = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionController = styled.div`
  ${(p) =>
    p.isMargin &&
    css`
      margin-bottom: 6px;
    `}

  ${(p) =>
    p.isMobile
      ? css`
          width: 310px;
          height: 68px;
          border-radius: 34px;
          ${layerA180Deg};
          ${flexBoxCenter};

          ${(p) =>
            p.isSmall &&
            css`
              width: 299px;
              height: 50px;
              border-radius: 31px;
              ${justifyContentSpaceBetween};
              padding: 0 3.5px 0 6px;
            `};
        `
      : css`
          width: 201px;
          height: 97px;
          border-radius: 18px;
          ${layerADark};
          ${flexDirectionColumn};
          padding: 1px;
        `}
`;
const SectionDisplay = styled.section`
  width: 199px;
  height: 54px;
  border-radius: 17px;

  ${layerA180Deg}
  ${flexDirectionColumn}  
  padding: 4px 0;
`;

const DisplayTop = styled.div`
  width: 190px;
  height: 27px;
  border-radius: 18px;

  ${layerADark}
  ${justifyContentSpaceBetween}  

  padding: 0 10px;
`;

const DisplayTitle = styled.span`
  font-size: 8px;
  letter-spacing: 0.8px;
`;
const Divider = styled.div`
  height: 20px;
  width: 1px;
  border: 1px solid white;
`;
const DefaultTemp = styled.span`
  letter-spacing: 1.2px;
  font-size: 12px;
`;

const InfoDefaultTemp = styled.span`
  font-size: 8px;
  letter-spacing: 0.8px;
`;

const SectionButton = styled.section`
  width: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 199px;
  height: 35px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const ButtonHole = styled.div`
  ${flexBoxCenter}

  width: 191px;
  height: 27px;
  border-radius: 18px;

  ${layerC}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
      cursor: not-allowed;
    `}
`;
const ButtonTop = styled.div`
  width: 189px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  font-size: 10px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      color: #808080;
    `}
`;

const MobileMessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 50px;
  left: -32px;

  z-index: 100;
`;
