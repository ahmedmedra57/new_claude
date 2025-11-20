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
  layerBDark,
  justifyContentFlexStart,
  layerADisabled,
} from '../styles/commonStyles';

import SelectLocations from './SelectLocations';
import AtsSelectBox from './AtsSelectBox';
import InputTempMessage from '../userMessages/inputTempMessage';

const Ats = ({
  scope,
  swtName,
  handleOnClick,
  handleClose,
  isMasterControl,
  specificLocation,
  disabled,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global

  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = useSelector(
    scope === 'switch' ? selectMCBySwitch : selectMCByLocation
  );
  const { selectedOne } = switchStatus.ats;

  // Local
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedForMobile, setIsExpandedForMobile] = useState(false);
  const [isSelected, setIsSelected] = useState([false, false, false]);

  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messages, setMessages] = useState([]);

  const imgSrc = 'images/logo-ats-active.svg';

  const selectOptions = {
    ess: [
      t('masterControl.ats.options.ess.block'),
      t('masterControl.ats.options.ess.reactivate'),
    ],
    tgs: [
      t('masterControl.ats.options.tgs.reactivate'),
      t('masterControl.ats.options.tgs.block'),
    ],
    tes: [
      t('masterControl.ats.options.tes.switchToTgs'),
      t('masterControl.ats.options.tes.reactivate'),
      t('masterControl.ats.options.tes.remainOff'),
    ],
  };

  const handleApply = () => {
    if (!selectedOne) {
      // Message box
      setOpenMessageBox(true);
      setMessages([t('masterControl.ats.selectLocations'), t('masterControl.ats.selectLocationPrompt')]);
      // please select locations first
      handleOnClick('ats', 'selectA', scope, '_', '_', type, specificLocation);
    } else if (!isSelected.includes(true)) {
      handleOnClick(
        'ats',
        'selectC',
        scope,
        null,
        null,
        null,
        specificLocation
      );
      // Message box
      setOpenMessageBox(true);
      setMessages([t('masterControl.ats.selectAts'), t('masterControl.ats.selectAtsPrompt')]);
    } else {
      // turn on
      handleOnClick('ats', 'on', scope, null, isSelected);
      setIsSelected([false, false, false]);
    }
  };

  const handleOpenAts = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAtsSelect = (id) => {
    if (id === 0) {
      setIsSelected([true, false, false]);
    } else if (id === 1) {
      setIsSelected([false, true, false]);
    } else if (id === 2) {
      setIsSelected([false, false, true]);
    }
  };

  const handleAtsButtons = (id) => {
    if (id === 0) {
      // clear selections
      setIsSelected([false, false, false]);
    } else if (id === 1) {
      setIsExpanded(false);
      if (isMobile && scope !== 'switch') {
        handleApply();
        handleClose();
      } else if (isMasterControl) {
        handleOnClick(isSelected);
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <>
          {isMasterControl ? (
            <AtsSelectBox
              isMasterControl={isMasterControl}
              isMobile={true}
              handleButtons={handleAtsButtons}
              handleSelect={handleAtsSelect}
              isSelected={isSelected}
              handleOpenAts={handleOpenAts}
              swtName={swtName}
              options={
                swtName === 'ess'
                  ? selectOptions.ess
                  : swtName === 'tes'
                  ? selectOptions.tes
                  : selectOptions.tgs
              }
            />
          ) : (
            <>
              {scope === 'switch' ? (
                <MobileWrapper isExpanded={isExpandedForMobile}>
                  <SectionController
                    isMobile={isMobile}
                    isMargin={isMobile && isExpandedForMobile}
                  >
                    <MobileHole>
                      <MobileTop disabled={disabled}>
                        <SectionCircle disabled={disabled}>
                          <CircleButton
                            onClick={handleApply}
                            disabled={disabled}
                          >
                            <CircleHole disabled={disabled}>
                              <LogoImg src={imgSrc} />
                            </CircleHole>
                          </CircleButton>
                        </SectionCircle>

                        <SectionHeatButton disabled={disabled}>
                          <HeatButton onClick={handleApply} disabled={disabled}>
                            {t('masterControl.ats.title')}
                          </HeatButton>
                        </SectionHeatButton>

                        <SectionCircle disabled={disabled}>
                          <CircleButton
                            isExpanded={isExpandedForMobile}
                            disabled={disabled}
                            onClick={() => {
                              setIsExpandedForMobile(!isExpandedForMobile);
                            }}
                          >
                            <CircleHole disabled={disabled}>
                              <CircleTop
                                isExpanded={isExpandedForMobile}
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

                  {isExpandedForMobile && (
                    <SectionSelects swtName={swtName}>
                      <SelectLocations
                        name='ats'
                        scope={scope}
                        swtName={swtName}
                        specificLocation={specificLocation}
                      />
                      <AtsSelectBox
                        isMobile={true}
                        handleButtons={handleAtsButtons}
                        handleSelect={handleAtsSelect}
                        isSelected={isSelected}
                        handleOpenAts={handleOpenAts}
                        swtName={swtName}
                        options={
                          swtName === 'ess'
                            ? selectOptions.ess
                            : swtName === 'tes'
                            ? selectOptions.tes
                            : selectOptions.tgs
                        }
                      />
                    </SectionSelects>
                  )}
                  {openMessageBox && (
                    <MobileMessageBoxWrapper>
                      <InputTempMessage
                        onClose={() => setOpenMessageBox(false)}
                        title={'master control'}
                        subtitle={'select ats'}
                        messages={messages}
                        isMobile={isMobile}
                      />
                    </MobileMessageBoxWrapper>
                  )}
                </MobileWrapper>
              ) : (
                <MobileWrapper isSmall={scope !== 'switch'}>
                  <SelectLocations
                    name='ats'
                    scope={scope}
                    swtName={swtName}
                    specificLocation={specificLocation}
                  />
                  <SelectWrapper swtName={swtName}>
                    <AtsSelectBox
                      isMobile={true}
                      isSmall={true}
                      handleButtons={handleAtsButtons}
                      handleSelect={handleAtsSelect}
                      isSelected={isSelected}
                      handleOpenAts={handleOpenAts}
                      swtName={swtName}
                      options={
                        swtName === 'ess'
                          ? selectOptions.ess
                          : swtName === 'tes'
                          ? selectOptions.tes
                          : selectOptions.tgs
                      }
                    />
                  </SelectWrapper>
                  {openMessageBox && (
                    <MobileMessageBoxWrapper>
                      <InputTempMessage
                        onClose={() => setOpenMessageBox(false)}
                        title={'master control'}
                        subtitle={'select ats'}
                        messages={messages}
                        isMobile={isMobile}
                      />
                    </MobileMessageBoxWrapper>
                  )}
                </MobileWrapper>
              )}
            </>
          )}
        </>
      ) : (
        <Wrapper disabled={disabled}>
          <SectionTop disabled={disabled}>
            <Title disabled={disabled}>
              ATS
              <img src={imgSrc} />
            </Title>
            <SelectLocations
              size={2}
              disabled={disabled}
              name='ats'
              scope={scope}
              swtName={swtName}
              specificLocation={specificLocation}
            />
          </SectionTop>

          <SectionBottom isExpanded={isExpanded}>
            {isExpanded ? (
              <AtsSelectBox
                handleButtons={handleAtsButtons}
                handleSelect={handleAtsSelect}
                isSelected={isSelected}
                handleOpenAts={handleOpenAts}
                swtName={swtName}
                options={
                  swtName === 'ess'
                    ? selectOptions.ess
                    : swtName === 'tes'
                    ? selectOptions.tes
                    : selectOptions.tgs
                }
              />
            ) : (
              <>
                <AtsSelectWrapper disabled={disabled}>
                  <AtsSelectInner disabled={disabled}>
                    <AtsSelectTop disabled={disabled}>
                      <SelectedOneSpan disabled={disabled}>
                        {isSelected.includes(true) ? 'selected' : 'select ats'}
                      </SelectedOneSpan>
                    </AtsSelectTop>
                    <ArrowImg
                      src='/images/masterCtr-select-btn.svg'
                      onClick={handleOpenAts}
                      disabled={disabled}
                    />
                  </AtsSelectInner>
                </AtsSelectWrapper>

                <ButtonWrapper disabled={disabled} onClick={handleApply}>
                  <ButtonInner disabled={disabled}>
                    <ButtonHole disabled={disabled}>
                      <ButtonTop disabled={disabled}>apply</ButtonTop>
                    </ButtonHole>
                  </ButtonInner>
                </ButtonWrapper>
              </>
            )}
            {openMessageBox && (
              <MessageBoxWrapper>
                <InputTempMessage
                  onClose={() => setOpenMessageBox(false)}
                  title={'master control'}
                  subtitle={'select ats'}
                  messages={messages}
                  isMobile={isMobile}
                />
              </MessageBoxWrapper>
            )}
          </SectionBottom>
        </Wrapper>
      )}
    </>
  );
};

export default Ats;

const MobileWrapper = styled.div`
  position: relative;
  ${(p) =>
    p.isSmall
      ? css`
          ${flexDirectionColumn};
          padding-top: 6px;
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
              border-radius: 36px 36px 26px 26px;
            `}

          margin-bottom:8px;
        `};
`;

const SelectWrapper = styled.div`
  width: 305px;
  height: ${(p) => (p.swtName === 'tes' ? `246px` : `206px`)};
  background: #233a54;
  border-radius: 11px 11px 26px 26px;
  ${flexBoxCenter};
  margin-top: 8px;
`;

const SectionController = styled.section`
  width: 310px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;

const MessageBoxWrapper = styled.div`
  width: 1180px;
  height: 300px;
  position: absolute;

  ${flexBoxCenter}

  top: 40%;
  left: 0;
  z-index: 100;
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
  padding: 0 2px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
    `}
`;

const SectionCircle = styled.section`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  ${layerC}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
    `}
`;
const CircleHole = styled.div`
  width: 36px;
  height: 36px;
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

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const LogoImg = styled.img`
  width: 65%;

  ${(p) =>
    p.isSm &&
    css`
      height: auto;
      width: auto;
    `}
`;

const SectionHeatButton = styled.section`
  width: 188px;
  height: 36px;
  border-radius: 18px;

  ${layerA}
  ${flexBoxCenter}

  
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const HeatButton = styled.button`
  width: 186px;
  height: 34px;

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

const SectionSelects = styled.section`
  margin-top: 6px;
  ${flexDirectionColumn}
`;

// -- for desktop
const Wrapper = styled.div`
  width: 208px;
  height: 95px;
  border-radius: 7px;
  ${layerA180Deg}
  ${flexDirectionColumn}

  padding: 2rem 0;

  ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff29, 0px 0px 2px #000000;
      border: 0.5px solid #000000;
    `}
`;
const Title = styled.div`
  width: 201rem;
  height: 22rem;
  border-radius: 33px;
  font-size: 8rem;

  ${layerADark}
  ${justifyContentSpaceBetween}
  
  padding: 0 4rem 0 10rem;
  margin-bottom: 4rem;

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 6px #000000;
    `}
`;

const SectionTop = styled.section``;

const SectionBottom = styled.section`
  width: 201px;
  ${justifyContentSpaceBetween}

  ${({ isExpanded }) =>
    isExpanded &&
    css`
      position: relative;
      height: 28px;
    `}
`;

const AtsSelectWrapper = styled.div`
  width: 127px;
  height: 28px;
  border-radius: 27px;
  ${layerBDark}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
      cursor: not-allowed;
    `}
`;
const AtsSelectInner = styled.div`
  width: 125px;
  height: 26px;
  border-radius: 25px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 5px 0 2.5px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const ArrowImg = styled.img`
  margin-top: 3px;
  height: 75%;
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `}
`;
const AtsSelectTop = styled.div`
  width: 95px;
  height: 18px;
  border-radius: 18px;
  ${layerADark};
  ${justifyContentFlexStart};
  padding-left: 10px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;

const SelectedOneSpan = styled.span`
  font-size: 8px;
`;

const ButtonWrapper = styled.button`
  width: 72px;
  height: 30px;
  border-radius: 18px;

  ${layerB}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b 0% 0%;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonInner = styled.div`
  width: 70px;
  height: 28px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
    `}
`;
const ButtonHole = styled.div`
  width: 62px;
  height: 20px;
  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      background: #3b3b3b;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonTop = styled.div`
  width: 60px;
  height: 18px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      background: transparent linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      color: #808080;
    `}

  font-size: 10px;
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
