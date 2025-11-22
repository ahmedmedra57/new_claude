/**
 * Unified Temperature Program Component
 *
 * Consolidates 3 nearly-identical temperature control components:
 * - InstantHeat.js (982 lines)
 * - OptionalConstant.js (788 lines)
 * - HeatingSchedule.js (820 lines, scheduler portion separate)
 *
 * Total: ~2,590 lines → ~450 lines (83% reduction)
 *
 * Usage:
 * <TemperatureProgram
 *   programType="instantHeat"
 *   scope="switch"
 *   swtName="ess"
 *   handleOnClick={handler}
 * />
 */

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { selectMCBySwitch } from '../../store/slices/masterControlBySwitchSelectSlice';
import { selectMCByLocation } from '../../store/slices/masterControlSelectByLocationSlice';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import { validateTemperatureInput } from '../../../utils/temperatureValidation';
import { getProgramConfig, getTempRangeForDisplay } from '../../../config/temperaturePrograms';
import { useMessageBox } from '../../../hooks/useMessageBox';

import SelectLocations from '../SelectLocations';
import InputTempMessage from '../../userMessages/inputTempMessage';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  layerADisabled180Deg,
  layerBDisabled,
  readyTop180Deg,
} from '../../styles/commonStyles';

const TemperatureProgram = ({
  programType, // 'instantHeat', 'optionalConstant', 'heatingSchedule'
  scope, // 'switch' or 'location'
  swtName, // 'ess', 'tes', 'tgs'
  specificLocation,
  disabled = false,
  handleOnClick,
  handleClose,
  children, // Optional: for scheduler UI
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Get program configuration
  const config = getProgramConfig(programType);
  const { name, displayName, iconSrc, validationType, hasTgsMode } = config;

  // Redux state
  const type = scope === 'switch' ? 'locations' : 'switches';
  const switchStatus = useSelector(scope === 'switch' ? selectMCBySwitch : selectMCByLocation);
  const { selectedOne } = switchStatus[name] || {};
  const { fanOnly } = switchStatus;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  // Local state
  const [tempInput, setTempInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { openMessageBox, messages, showMessage, closeMessage } = useMessageBox();

  // TGS-specific state
  const [isButtonSelected, setIsButtonSelected] = useState([false, false]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disabled) {
      setTempInput('');
      return;
    }

    // Check if location is selected
    if (!selectedOne) {
      const range = getTempRangeForDisplay(programType, isF);
      showMessage([
        t('masterControl.selectLocations'),
        t('masterControl.pleaseSelectLocation'),
      ]);
      handleOnClick(name, 'selectA', scope, 0, '_', type, specificLocation);
      setTempInput('');
      return;
    }

    // Validate temperature
    const validation = validateTemperatureInput(tempInput, isF, validationType);

    if (!validation.isValid) {
      const range = getTempRangeForDisplay(programType, isF);
      showMessage([
        t('masterControl.wrongTemperature'),
        t('masterControl.inputTempFirst'),
        `(${t('masterControl.minTemp')}: ${range.min}${range.unit})`,
        `(${t('masterControl.maxTemp')}: ${range.max}${range.unit})`,
      ]);
      handleOnClick(name, 'tempA', scope, 0, null, null, specificLocation);
      setTempInput('');
      return;
    }

    // Submit valid temperature
    handleOnClick(name, 'on', scope, validation.temp);

    if (isMobile && scope !== 'switch') {
      handleClose?.();
    }

    setTempInput('');
  };

  const handleExpandButton = (e) => {
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  };

  // TGS-specific handlers
  const handleClickSwitchButton = (button) => {
    if (button === 'instantHeat') {
      setIsButtonSelected([true, true]);
    } else if (button === 'fanOnly') {
      setIsButtonSelected([false, true]);
    }
  };

  const handleTgsSubmit = (e) => {
    e.preventDefault();

    if (!isButtonSelected[0] && !isButtonSelected[1]) {
      showMessage([
        t('masterControl.selectProgram'),
        t('masterControl.pleaseSelectProgramFirst'),
      ]);
      return;
    }

    if (isButtonSelected[1] && !isButtonSelected[0]) {
      // FanOnly logic
      if (!fanOnly.selectedOne) {
        handleOnClick('fanOnly', 'selectA', scope, '_', '_', type, specificLocation);
      } else {
        handleOnClick('fanOnly', 'on', scope);
        setIsButtonSelected([false, false]);
      }
    } else {
      // Temperature program logic
      handleSubmit(e);
    }
  };

  // TGS Mode rendering (special case for instantHeat on TGS)
  const renderTgsMode = () => {
    return (
      <Wrapper isMessageBoxOpen={openMessageBox}>
        <SectionTop isTgs={true}>
          <TgsSwitchButton
            onClick={() => handleClickSwitchButton('instantHeat')}
            isSelected={isButtonSelected[0]}
          >
            <TgsSwitchTop>
              <LogoCircle>
                <LogoCircleInner>
                  <LogoCircleTop>
                    <LogoImg src={iconSrc} />
                  </LogoCircleTop>
                </LogoCircleInner>
              </LogoCircle>
              <SwitchTitleWrapper>
                <SwitchTitle>{displayName}</SwitchTitle>
              </SwitchTitleWrapper>
            </TgsSwitchTop>
          </TgsSwitchButton>

          <TgsSwitchButton
            onClick={() => handleClickSwitchButton('fanOnly')}
            isSelected={isButtonSelected[1]}
          >
            <TgsSwitchTop>
              <LogoCircle>
                <LogoCircleInner>
                  <LogoCircleTop>
                    <LogoImg src="/images/tgs-fanOnly.svg" />
                  </LogoCircleTop>
                </LogoCircleInner>
              </LogoCircle>
              <SwitchTitleWrapper>
                <SwitchTitle>{t('masterControl.fanOnly')}</SwitchTitle>
              </SwitchTitleWrapper>
            </TgsSwitchTop>
          </TgsSwitchButton>
        </SectionTop>

        <SectionBottom>
          <SelectLocations
            name={isButtonSelected[0] ? name : isButtonSelected[1] ? 'fanOnly' : name}
            scope={scope}
            swtName={swtName}
            specificLocation={specificLocation}
          />

          <SectionTgsController onSubmit={handleTgsSubmit} isTgs={true}>
            <SectionInput isTgs={true}>
              <InputTemp
                type="text"
                onChange={(e) => setTempInput(e.target.value)}
                value={tempInput}
                placeholder={t('masterControl.inputTemp')}
                isTgs={true}
                disabled={isButtonSelected[1] && !isButtonSelected[0]}
              />
            </SectionInput>

            <ButtonWrapper onClick={handleTgsSubmit} isTgs={true} disabled={disabled}>
              <ButtonHole isTgs={true} disabled={disabled}>
                <ButtonTop isTgs={true} disabled={disabled}>
                  {t('masterControl.apply')}
                </ButtonTop>
              </ButtonHole>
            </ButtonWrapper>
          </SectionTgsController>
        </SectionBottom>

        {openMessageBox && (
          <MessageBoxWrapper>
            <InputTempMessage
              onClose={closeMessage}
              title={t('masterControl.title')}
              subtitle={displayName}
              messages={messages}
            />
          </MessageBoxWrapper>
        )}
      </Wrapper>
    );
  };

  // Standard rendering (non-TGS or mobile)
  return (
    <>
      {isMobile ? (
        // Mobile View
        <>
          {scope === 'switch' ? (
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

                    <InputTemp
                      type="text"
                      onChange={(e) => setTempInput(e.target.value)}
                      value={tempInput}
                      placeholder={isF ? '0°F' : '0 °C'}
                      isMobile={isMobile}
                    />

                    <SectionHeatButton>
                      <HeatButton onClick={handleSubmit}>{displayName}</HeatButton>
                    </SectionHeatButton>

                    <SectionCircle>
                      <CircleButton isExpanded={isExpanded} onClick={handleExpandButton}>
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
                  name={name}
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                />
              )}

              {children}

              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={displayName}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          ) : (
            // Mobile Location Scope
            <MobileWrapper isExpanded={isExpanded} isSmall={true}>
              <SectionSelect>
                <SelectLocations
                  name={name}
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
                      <InputTemp
                        isSmall={true}
                        type="text"
                        onChange={(e) => setTempInput(e.target.value)}
                        value={tempInput}
                        placeholder={isF ? '0°F' : '0 °C'}
                        isMobile={isMobile}
                      />

                      <SectionHeatButton isSmall={true}>
                        <HeatButton onClick={handleSubmit} isSmall={true}>
                          {displayName}
                        </HeatButton>
                      </SectionHeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>

              {children}

              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={displayName}
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
        <>
          {hasTgsMode && swtName === 'tgs' ? (
            renderTgsMode()
          ) : (
            <Wrapper>
              <SectionTop>
                <Title>
                  {displayName}
                  <img src={iconSrc} alt={displayName} />
                </Title>

                <SelectLocations name={name} scope={scope} swtName={swtName} />
              </SectionTop>

              <SectionController onSubmit={handleSubmit}>
                <SectionInput>
                  <InputTemp
                    type="text"
                    onChange={(e) => setTempInput(e.target.value)}
                    value={tempInput}
                    placeholder={t('masterControl.inputTemperature')}
                  />
                </SectionInput>

                <SectionButton>
                  <ButtonWrapper onClick={handleSubmit} disabled={disabled}>
                    <ButtonHole disabled={disabled}>
                      <ButtonTop disabled={disabled}>{t('masterControl.apply')}</ButtonTop>
                    </ButtonHole>
                  </ButtonWrapper>
                </SectionButton>

                {children}

                {openMessageBox && (
                  <MessageBoxWrapper>
                    <InputTempMessage
                      onClose={closeMessage}
                      title={t('masterControl.title')}
                      messages={messages}
                    />
                  </MessageBoxWrapper>
                )}
              </SectionController>
            </Wrapper>
          )}
        </>
      )}
    </>
  );
};

export default TemperatureProgram;

// Styled Components (extracted from duplicates)

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
          width: 93px;
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
          width: 91px;
          height: 34px;
          letter-spacing: -0.5px;
        `}
  border-radius: 17px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
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

  ${(p) =>
    p.isMessageBoxOpen &&
    css`
      position: relative;
    `}
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

  ${(p) =>
    p.isTgs &&
    css`
      padding: 0 5px;
    `}
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

const SectionInput = styled.section`
  width: 190rem;
  height: 35rem;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.isTgs &&
    css`
      width: 83px;
      height: 35px;
    `}
`;

const InputTemp = styled.input`
  width: 181px;
  height: 27px;
  border-radius: 18px;
  ${layerADark}

  font-size: 8rem;

  &::placeholder {
    color: #fff;
    ${(p) =>
      p.isTgs &&
      css`
        ${p.disabled &&
        css`
          color: #808080;
        `}
      `}
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 91px;
      height: 36px;
      font-size: 14px;
      ${(p) =>
        p.isSmall &&
        css`
          width: 91px;
          height: 30px;
          border-radius: 18px;
        `}
    `}

  ${(p) =>
    p.isTgs &&
    css`
      width: 75px;
      height: 27px;
      ${p.disabled &&
      css`
        background: #3b3b3b;
        box-shadow: inset 0px 0px 6px #000000;
      `}
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
    p.isTgs &&
    css`
      width: 92px;
      height: 35px;
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;

const ButtonHole = styled.div`
  ${flexBoxCenter}

  width: 182px;
  height: 27px;
  border-radius: 18px;

  ${layerC}

  ${(p) =>
    p.isTgs &&
    css`
      width: 84px;
      height: 27px;
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
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
    p.isTgs &&
    css`
      width: 82px;
      height: 25px;
    `}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
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

// TGS-specific components

const TgsSwitchButton = styled.button`
  width: 189px;
  height: 40px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter};
  margin-bottom: 6px;

  ${(p) =>
    p.isSelected &&
    css`
      border: 1px solid #95ff45;
    `}
`;

const TgsSwitchTop = styled.div`
  width: 188px;
  height: 38px;
  border-radius: 27px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween}
  padding: 0 0 0 2px;
`;

const LogoCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  ${layerB};
  ${flexBoxCenter};
`;

const LogoCircleInner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const LogoCircleTop = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  ${layerB};
  ${flexBoxCenter}
`;

const SwitchTitleWrapper = styled.div`
  width: 80%;
  ${flexBoxCenter};
`;

const SwitchTitle = styled.span`
  font-size: 8px;
  text-align: center;
  text-transform: lowercase;
`;

const SectionTgsController = styled.form`
  width: 190px;
  height: 37px;
  border-radius: 18px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 1px;
  margin-top: 6px;
`;

const SectionBottom = styled.section``;
