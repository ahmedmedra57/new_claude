import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components';
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

import SelectLocations from './SelectLocations';
import InputTempMessage from '../userMessages/inputTempMessage';

const WindFactor = ({
  scope,
  swtName,
  handleOnClick,
  handleClose,
  specificLocation,
  disabled
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // global
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = useSelector(
    scope === 'switch' ? selectMCBySwitch : selectMCByLocation
  );
  const { selectedOne } = switchStatus.windFactor;

  // local
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleApply = () => {
    if (!selectedOne) {
      // Message box
      setOpenMessageBox(true);
      setMessages([t('masterControl.windFactor.selectLocations'), t('masterControl.windFactor.selectLocationPrompt')]);
      // please select locations first
      handleOnClick(
        'windFactor',
        'selectA',
        scope,
        '_',
        '_',
        type,
        specificLocation
      );
    } else {
      handleOnClick('windFactor', 'on', scope);

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
                isExpanded={isExpanded}
              >
                <MobileHole>
                  <MobileTop>
                    <SectionCircle>
                      <CircleButton onClick={handleApply}>
                        <CircleHole>
                          <LogoImg src='images/logo-windFactor.svg' />
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>

                    <SectionHeatButton>
                      <HeatButton onClick={handleApply}>
                        {t('masterControl.programs.windFactor')}
                      </HeatButton>
                    </SectionHeatButton>

                    <SectionCircle>
                      <CircleButton
                        isExpanded={isExpanded}
                        onClick={() => {
                          setIsExpanded((prev) => !prev);
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
                  name='windFactor'
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                />
              )}
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.windFactor')}
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
                  name='windFactor'
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
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
                        <LogoImg src='images/logo-windFactor.svg' />
                      </CircleHole>
                    </CircleButton>
                  </SectionCircle>

                  <MobileHole isSmall={true}>
                    <MobileTop isSmall={true}>
                      <HeatButton onClick={handleApply} isSmall={true}>
                        {t('masterControl.programs.windFactor')}
                      </HeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.windFactor')}
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
            <Title>
              wind Factor program
              <img src='images/logo-windFactor.svg' />
            </Title>
            <SelectLocations
              size={2}
              name='windFactor'
              scope={scope}
              swtName={swtName}
              specificLocation={specificLocation}
            />
          </SectionTop>

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

export default WindFactor;

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

const SectionController = styled.section`
  width: 310px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 6px;
    `}


  ${(p) =>
    p.isSmall &&
    css`
      width: 299px;
      height: 50px;
      border-radius: 31px;
      ${justifyContentSpaceBetween};
      padding: 0 3.5px 0 6px;
      margin-bottom: 0;
    `};
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

// --- for desktop

const Wrapper = styled.div`
  width: 208px;
  height: 95px;
  border-radius: 7px;

  ${layerA180Deg}
  ${flexDirectionColumn}  
  padding: 2rem 0;
`;
const Title = styled.div`
  width: 201rem;
  height: 22rem;

  border-radius: 33px;
  font-size: 8rem;

  ${layerADark}
  ${justifyContentSpaceBetween}

  padding: 0 2rem 0 10rem;
  margin-bottom: 4rem;
`;

const SectionTop = styled.section``;

const SectionButton = styled.section`
  width: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 201px;
  height: 30px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      cursor: not-allowed;
    `}
`;
const ButtonInner = styled.div`
  width: 199px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;
const ButtonHole = styled.div`
  width: 191px;
  height: 20px;
  border-radius: 18px;

  ${layerCLighter};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const ButtonTop = styled.div`
  width: 189px;
  height: 18px;
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
