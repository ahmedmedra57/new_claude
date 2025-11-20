import { useState } from 'react';
import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore, useUnitsStore } from '../zustand-stores';


import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useMessageBox } from '../../hooks/useMessageBox';
import { validateTemperatureInput } from '../../utils/temperatureValidation';

import styled, { css } from 'styled-components';
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

import SelectLocations from './SelectLocations';
import InputTempMessage from '../userMessages/inputTempMessage';

const OptionalConstant = ({
  scope,
  swtName,
  handleOnClick,
  disabled,
  handleClose,
  specificLocation,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global states
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = scope === 'switch'
    ? useMasterControlBySwitchSelectStore()
    : useMasterControlSelectByLocationStore();
  const { selectedOne } = switchStatus.optionalConstant;

  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Local states
  const [tempInput, setTempInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { openMessageBox, messages, showMessage, closeMessage } = useMessageBox();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Early return if disabled
    if (disabled) {
      setTempInput('');
      return;
    }

    // Validate selection
    if (!selectedOne) {
      showMessage([
        t('masterControl.optionalConstant.selectLocations'),
        t('masterControl.optionalConstant.selectLocationPrompt')
      ]);
      handleOnClick('constantTemp', 'selectA', scope, '_', '_', type);
      setTempInput('');
      return;
    }

    // Validate temperature input
    const validation = validateTemperatureInput(tempInput, isF, 'OPTIONAL_CONSTANT');

    if (!validation.isValid) {
      showMessage(validation.errorKeys.map(key => t(key)));
      handleOnClick('constantTemp', 'tempB', scope);
      setTempInput('');
      return;
    }

    // Submit if valid
    handleOnClick('constantTemp', 'on', scope, validation.temp);

    if (isMobile && scope !== 'switch') {
      handleClose();
    }

    setTempInput('');
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
            <MobileWrapper isExpanded={isExpanded} disabled={disabled}>
              <SectionController
                isMobile={isMobile}
                isMargin={isMobile && isExpanded}
              >
                <MobileHole>
                  <MobileTop disabled={disabled}>
                    <SectionCircle disabled={disabled} onClick={handleSubmit}>
                      <CircleButton disabled={disabled}>
                        <CircleHole disabled={disabled}>
                          <LogoImg
                            src={
                              disabled
                                ? 'images/logo-constantTemp-disabled.svg'
                                : 'images/logo-constantTemp.svg'
                            }
                          />
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>

                    <InputTemp
                      type='text'
                      onChange={(e) => setTempInput(e.target.value)}
                      value={tempInput}
                      placeholder={isF ? '0°F' : '0 °C'}
                      disabled={disabled}
                      isMobile={isMobile}
                    />

                    <SectionHeatButton disabled={disabled}>
                      <HeatButton onClick={handleSubmit} disabled={disabled}>
                        {t('masterControl.programs.optionalConstant')}
                      </HeatButton>
                    </SectionHeatButton>

                    <SectionCircle disabled={disabled}>
                      <CircleButton
                        disabled={disabled}
                        isExpanded={isExpanded}
                        onClick={(e) => handleExpandButton(e)}
                      >
                        <CircleHole disabled={disabled}>
                          <CircleTop
                            isExpanded={isExpanded}
                            disabled={disabled}
                          >
                            <LogoImg
                              isSm={true}
                              src={
                                disabled
                                  ? '/images/MC-expand-disabled.svg'
                                  : isExpanded
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
                  name='optionalConstant'
                  scope={scope}
                  swtName={swtName}
                  disabled={disabled}
                  specificLocation={specificLocation}
                />
              )}
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.optionalConstant')}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          ) : (
            <MobileWrapper
              isExpanded={isExpanded}
              disabled={disabled}
              isSmall={true}
            >
              <SectionSelect>
                <SelectLocations
                  name='optionalConstant'
                  scope={scope}
                  swtName={swtName}
                  disabled={disabled}
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
                  <SectionCircle disabled={disabled} isSmall={true}>
                    <CircleButton disabled={disabled} isSmall={true}>
                      <CircleHole disabled={disabled} isSmall={true}>
                        <LogoImg
                          src={
                            disabled
                              ? 'images/logo-constantTemp-disabled.svg'
                              : 'images/logo-constantTemp.svg'
                          }
                        />
                      </CircleHole>
                    </CircleButton>
                  </SectionCircle>

                  <MobileHole isSmall={true}>
                    <MobileTop disabled={disabled} isSmall={true}>
                      <InputTemp
                        type='text'
                        onChange={(e) => setTempInput(e.target.value)}
                        value={tempInput}
                        placeholder={isF ? '0°F' : '0 °C'}
                        disabled={disabled}
                        isMobile={isMobile}
                        isSmall={true}
                      />

                      <SectionHeatButton disabled={disabled} isSmall={true}>
                        <HeatButton
                          onClick={handleSubmit}
                          disabled={disabled}
                          isSmall={true}
                        >
                          {t('masterControl.programs.optionalConstant')}
                        </HeatButton>
                      </SectionHeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>
              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.optionalConstant')}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MobileMessageBoxWrapper>
              )}
            </MobileWrapper>
          )}
        </>
      ) : (
        <Wrapper disabled={disabled}>
          <SectionTop disabled={disabled}>
            <Title disabled={disabled}>
              opt. const. temp. program
              <img
                src={
                  disabled
                    ? 'images/logo-constantTemp-disabled.svg'
                    : 'images/logo-constantTemp.svg'
                }
              />
            </Title>
            <SelectLocations
              size={1}
              name='optionalConstant'
              scope={scope}
              swtName={swtName}
              disabled={disabled}
              specificLocation={specificLocation}
            />
          </SectionTop>
          <SectionController onSubmit={handleSubmit} disabled={disabled}>
            <SectionInput disabled={disabled}>
              <InputTemp
                type='text'
                onChange={(e) => setTempInput(e.target.value)}
                value={tempInput}
                placeholder='input temperature'
                disabled={disabled}
              />
            </SectionInput>

            <SectionButton>
              <ButtonWrapper onClick={handleSubmit} disabled={disabled}>
                <ButtonHole disabled={disabled}>
                  <ButtonTop disabled={disabled}>apply</ButtonTop>
                </ButtonHole>
              </ButtonWrapper>
            </SectionButton>
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
  );
};
export default OptionalConstant;
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
const MessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 50px;
  left: 30px;

  z-index: 100;
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
        `};

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const LogoImg = styled.img`
  height: 100%;
  margin-bottom: 5px;
  ${(p) =>
    p.isSm &&
    css`
      height: auto;
      margin-bottom: 0;
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

  ${layerA};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
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
        `}
  border-radius: 17px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
  line-height: 95%;
  padding-top: 2px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
    `}
`;

const SectionTop = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionController = styled.form`
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
          width: 201rem;
          height: 78rem;
          border-radius: 18px;
          ${layerADark}
          ${flexDirectionColumn}  
  padding: 1px;
        `}

  ${(p) =>
    p.isMargin &&
    css`
      margin-bottom: 6px;
    `}

    ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const SectionInput = styled.section`
  width: 199rem;
  height: 35rem;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
`;
const InputTemp = styled.input`
  width: 190px;
  height: 27px;
  border-radius: 18px;

  ${layerADark}
  font-size: 8rem;

  &::placeholder {
    ${(p) =>
      p.disabled
        ? css`
            color: #808080;
          `
        : css`
            color: #fff;
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
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
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
      ${layerBDisabled}
    `}
`;
const ButtonTop = styled.div`
  ${flexBoxCenter}

  width: 189px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}

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
