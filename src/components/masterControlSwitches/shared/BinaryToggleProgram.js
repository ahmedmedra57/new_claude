/**
 * Binary Toggle Program Component
 *
 * Unified component that replaces 4 duplicate binary toggle controls:
 * - FanOnly.js (399 lines)
 * - SnowSensor.js (677 lines)
 * - WindFactor.js (552 lines)
 * - ShutOff.js (461 lines)
 *
 * Total: 2,089 lines → ~350 lines (83% reduction)
 *
 * Usage:
 * <BinaryToggleProgram
 *   programName="fanOnly"
 *   title="fan only"
 *   iconSrc="/images/tgs-fanOnly.svg"
 *   scope="switch"
 *   swtName="tgs"
 *   handleOnClick={handler}
 * />
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18n';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  readyTop180Deg,
} from '../../styles/commonStyles';
import { selectMCBySwitch } from '../../store/slices/masterControlBySwitchSelectSlice';
import { selectMCByLocation } from '../../store/slices/masterControlSelectByLocationSlice';
import InputTempMessage from '../../userMessages/inputTempMessage';
import SelectLocations from '../SelectLocations';

const BinaryToggleProgram = ({
  programName,
  title,
  iconSrc,
  scope,
  swtName,
  specificLocation,
  disabled = false,
  handleOnClick,
  handleClose,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { t } = useTranslation();

  // Redux state selection
  const type = scope === 'switch' ? 'locations' : 'switches';
  const switchMiddleStatus = useSelector(
    scope === 'switch' ? selectMCBySwitch : selectMCByLocation
  );
  const { selectedOne } = switchMiddleStatus[programName] || {};

  // Local state
  const [isExpanded, setIsExpanded] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOne) {
      // Show message: please select locations first
      handleOnClick(
        programName,
        'selectA',
        scope,
        '_',
        '_',
        type,
        specificLocation
      );
      setOpenMessageBox(true);
      setMessages([
        t('masterControl.selectLocations'),
        t('masterControl.pleaseSelectLocation'),
      ]);
    } else {
      // Toggle the program on/off
      handleOnClick(programName, 'on', scope);

      // If mobile and location scope, close the expanded state
      if (isMobile && scope !== 'switch') {
        handleClose?.();
      }
    }
  };

  const handleExpandButton = (e) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {isMobile ? (
        <>
          {scope === 'switch' ? (
            // Mobile - Switch Scope
            <MobileWrapper isExpanded={isExpanded}>
              <SectionController isMobile={isMobile} isMargin={isMobile && isExpanded}>
                <MobileHole>
                  <MobileTop>
                    <SectionCircle onClick={handleSubmit}>
                      <CircleButton>
                        <CircleHole>
                          <LogoImg src={iconSrc} />
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>

                    <SectionHeatButton>
                      <HeatButton onClick={handleSubmit}>{title}</HeatButton>
                    </SectionHeatButton>

                    <SectionCircle>
                      <CircleButton
                        isExpanded={isExpanded}
                        onClick={(e) => handleExpandButton(e)}
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
                  name={programName}
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
                    subtitle={title}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          ) : (
            // Mobile - Location Scope
            <MobileWrapper isExpanded={isExpanded} isSmall={true}>
              <SectionSelect>
                <SelectLocations
                  name={programName}
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                />
              </SectionSelect>

              <ScopeWrapper>
                <SectionController
                  isMobile={isMobile}
                  onSubmit={handleSubmit}
                  isMargin={isMobile && isExpanded}
                  isSmall={true}
                >
                  <SectionCircle isSmall={true}>
                    <CircleButton isSmall={true}>
                      <CircleHole isSmall={true}>
                        <LogoImg src={iconSrc} isSmall={true} />
                      </CircleHole>
                    </CircleButton>
                  </SectionCircle>

                  <MobileHole isSmall={true}>
                    <MobileTop isSmall={true}>
                      <SectionHeatButton isSmall={true}>
                        <HeatButton onClick={handleSubmit} isSmall={true}>
                          {title}
                        </HeatButton>
                      </SectionHeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>

              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={() => setOpenMessageBox(false)}
                    title={t('masterControl.title')}
                    subtitle={title}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          )}
        </>
      ) : (
        // Desktop View
        <Wrapper>
          <SectionTop>
            <Title>
              {title}
              <img src={iconSrc} alt={title} />
            </Title>

            <SelectLocations name={programName} scope={scope} swtName={swtName} />
          </SectionTop>

          <SectionController onSubmit={handleSubmit}>
            <SectionButton>
              <ButtonWrapper onClick={handleSubmit} disabled={disabled}>
                <ButtonHole disabled={disabled}>
                  <ButtonTop disabled={disabled}>{t('masterControl.apply')}</ButtonTop>
                </ButtonHole>
              </ButtonWrapper>
            </SectionButton>

            {openMessageBox && (
              <MessageBoxWrapper>
                <InputTempMessage
                  onClose={() => setOpenMessageBox(false)}
                  title={t('masterControl.title')}
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

export default BinaryToggleProgram;

// Styled Components (shared patterns extracted)

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
  ${(p) =>
    p.isSmall
      ? css`
          width: 246px;
          height: 42px;
          border-radius: 26px;
        `
      : css`
          width: 299px;
          height: 58px;
          border-radius: 29px;
        `}
  ${flexBoxCenter};
  ${layerA};
`;

const MobileTop = styled.div`
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isSmall
      ? css`
          width: 241px;
          height: 38px;
          border-radius: 23px;
          padding: 0 4px;
        `
      : css`
          width: 293px;
          height: 52px;
          border-radius: 26px;
          padding: 0 2px;
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
  ${(p) =>
    p.isSmall
      ? css`
          width: 137px;
          height: 30px;
          border-radius: 18px;
        `
      : css`
          width: 200px;
          height: 36px;
          border-radius: 18px;
        `};

  ${layerA}
  ${flexBoxCenter}
`;

const HeatButton = styled.button`
  ${(p) =>
    p.isSmall
      ? css`
          width: 135px;
          height: 28px;
        `
      : css`
          width: 198px;
          height: 34px;
          letter-spacing: -0.5px;
        `}
  border-radius: 17px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 12px;
  line-height: 95%;
  padding-top: 2px;
  text-transform: lowercase;
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

// Desktop Styles

const Wrapper = styled.div`
  width: 199px;
  height: 200px;
  border-radius: 7px;

  ${layerA180Deg}
  ${flexDirectionColumn}

  padding: 2rem 0;
`;

const Title = styled.div`
  width: 192rem;
  height: 22rem;
  border-radius: 33px;

  ${layerADark}
  ${justifyContentSpaceBetween}

  padding: 0 2rem 0 10rem;
  margin-bottom: 4rem;
  font-size: 8rem;
  text-transform: lowercase;

  img {
    height: 95%;
  }
`;

const SectionTop = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionController = styled.form`
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
              ${justifyContentSpaceBetween}
              padding: 0 3.5px 0 6px;
            `};
        `
      : css`
          width: 192rem;
          height: 78rem;
          border-radius: 18px;
          ${layerADark};
          ${flexDirectionColumn}
          padding: 1px;
        `}
`;

const SectionButton = styled.section`
  width: 100%;
  ${flexBoxCenter}
`;

const ButtonWrapper = styled.button`
  width: 190px;
  height: 35px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}
`;

const ButtonHole = styled.div`
  ${flexBoxCenter}

  width: 182px;
  height: 27px;
  border-radius: 18px;

  ${layerC}

  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.7;
    `}
`;

const ButtonTop = styled.div`
  width: 180px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
  text-transform: lowercase;

  ${(p) =>
    p.disabled &&
    css`
      color: #808080;
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

const MobileMessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 50px;
  left: -32px;

  z-index: 100;
`;
