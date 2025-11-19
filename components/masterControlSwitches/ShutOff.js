import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { selectMCBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { selectMCByLocation } from '../store/slices/masterControlSelectByLocationSlice';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  layerCLighter,
  layerA,
  readyTop180Deg,
  layerADisabled180Deg,
  layerBDisabled,
} from '../styles/commonStyles';
import styled, { css } from 'styled-components';

import SelectLocations from './SelectLocations';
import InputTempMessage from '../userMessages/inputTempMessage';

const ShutOff = ({
  scope,
  swtName,
  handleOnClick,
  handleClose,
  isMasterControl,
  specificLocation,
  disabled
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = useSelector(
    scope === 'switch' ? selectMCBySwitch : selectMCByLocation
  );
  const { selectedOne } = switchStatus.shutOff;

  // local
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleApply = () => {
    if (!selectedOne) {
      // Message box
      setOpenMessageBox(true);
      setMessages(['select locations', 'please select location to continue']);
      // please select locations first
      handleOnClick(
        'shutOff',
        'selectA',
        scope,
        '_',
        '_',
        type,
        specificLocation
      );
    } else {
      handleOnClick('shutOff', 'on', scope);
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
                    <SectionHeatButton>
                      <HeatButton onClick={handleApply}>m.c off</HeatButton>
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
                  name='shutOff'
                  scope={scope}
                  swtName={swtName}
                  disabled={disabled}
                  specificLocation={specificLocation}
                />
              )}
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={'master control'}
                    subtitle={'m.c. off'}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          ) : (
            <MobileWrapper isExpanded={isExpanded} isSmall={scope !== 'switch'}>
              <SelectLocations
                name='shutOff'
                scope={scope}
                swtName={swtName}
                disabled={disabled}
                specificLocation={specificLocation}
              />
              <SectionShutOffButton>
                <ShutOffButton onClick={handleApply}>
                  <LayerB>
                    <ShutOffButtonHole>
                      <ShutOffButtonTop>deactivate</ShutOffButtonTop>
                    </ShutOffButtonHole>
                  </LayerB>
                </ShutOffButton>
              </SectionShutOffButton>
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={'master control'}
                    subtitle={'m.c. off'}
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
          <Title>deactivate</Title>

          <SelectLocations
            size={3}
            name='shutOff'
            scope={scope}
            swtName={swtName}
            disabled={disabled}
            specificLocation={specificLocation}
          />

          <SectionButton>
            <ButtonWrapper onClick={handleApply} disabled={disabled}>
              <ButtonInner disabled={disabled}>
                <ButtonHole disabled={disabled}>
                  <ButtonTop disabled={disabled}>apply</ButtonTop>
                </ButtonHole>
              </ButtonInner>
            </ButtonWrapper>
          </SectionButton>
        </Wrapper>
      )}
    </>
  );
};
export default ShutOff;

const MobileWrapper = styled.div`
  position: relative;
  ${(p) =>
    p.isSmall
      ? css`
          ${flexDirectionColumn};
          margin: 6px 0 3px 0;
        `
      : css`
          width: 314px;
          height: 72px;
          border-radius: 36px;
          ${layerC};
          ${flexBoxCenter};
          ${(p) =>
            p.isExpanded &&
            css`
              height: auto;
              border-radius: 36px;
              ${flexDirectionColumn};
              padding: 2px 0;
            `}
        `}
`;

const SectionShutOffButton = styled.section`
  width: 299px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg};
  ${flexBoxCenter};
  margin-top: 6px;
`;
const ShutOffButton = styled.button`
  width: 288px;
  height: 58px;
  border-radius: 29px;
  ${layerA};
  ${flexBoxCenter};
`;
const LayerB = styled.div`
  width: 282px;
  height: 52px;
  border-radius: 26px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ShutOffButtonHole = styled.div`
  width: 267px;
  height: 36px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const ShutOffButtonTop = styled.div`
  width: 265px;
  height: 34px;
  border-radius: 17px;
  ${layerA180Deg};
  ${flexBoxCenter};

  font-size: 12px;
  letter-spacing: 1.2px;
`;

const SectionController = styled.section`
  width: 310px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.isMargin &&
    css`
      margin-bottom: 6px;
    `}
`;

const MobileHole = styled.div`
  width: 299px;
  height: 58px;
  border-radius: 29px;
  ${layerA};
  ${flexBoxCenter};
`;
const MobileTop = styled.div`
  width: 293px;
  height: 52px;
  border-radius: 26px;
  padding: 0 2px 0 7px;
  ${justifyContentSpaceBetween};
  ${layerA180Deg};
`;

const SectionCircle = styled.section`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  ${layerC}
  ${flexBoxCenter}
`;
const CircleButton = styled.button`
  width: 46px;
  height: 46px;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
`;
const CircleTop = styled.div`
  width: 34px;
  height: 34px;
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
  width: 233px;
  height: 36px;
  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}
`;
const HeatButton = styled.button`
  width: 231px;
  height: 34px;
  border-radius: 17px;

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
  line-height: 95%;
  padding-top: 2px;
`;

const Wrapper = styled.div`
  width: 86px;
  height: 200px;
  border-radius: 7px;

  ${layerA180Deg}
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 2px;
`;

const Title = styled.div`
  ${flexBoxCenter}

  width: 77px;
  height: 22px;
  border-radius: 33px;
  ${layerADark}

  font-size: 8px;
  margin-bottom: 3px;
`;
const SectionButton = styled.section`
  ${flexBoxCenter}
  margin-top: 3px;
`;

const ButtonWrapper = styled.button`
  ${flexBoxCenter}

  width: 77px;
  height: 30px;
  border-radius: 18px;
  ${layerCLighter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const ButtonInner = styled.div`
  ${flexBoxCenter}

  width: 75px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;
const ButtonHole = styled.div`
  ${flexBoxCenter}

  width: 67px;
  height: 20px;
  border-radius: 18px;
  ${layerCLighter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const ButtonTop = styled.div`
  ${flexBoxCenter}

  width: 65px;
  height: 18px;
  border-radius: 25px;
  ${layerA180Deg}

  font-size: 10px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
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
