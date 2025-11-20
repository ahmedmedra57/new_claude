import { useState } from 'react';
import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore } from '../zustand-stores';
import { useUnitsStore } from '../zustand-stores';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useMessageBox } from '../../hooks/useMessageBox';
import { validateTemperatureInput } from '../../utils/temperatureValidation';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerBDark,
  layerC,
  layerCLighter,
  layerA,
  readyTop180Deg,
  layerADisabled180Deg,
  layerBDisabled,
} from '../styles/commonStyles';
import styled, { css } from 'styled-components';

import SchedulerContainer2 from './SchedulerContainer2';
import SelectLocations from './SelectLocations';
import ScheduleCalendar from '../masterControl/controls/heatingScheduler/ScheduleCalendar';
import InputTempMessage from '../userMessages/inputTempMessage';

const HeatingSchedule = ({
  scope,
  swtName,
  handleOnClick,
  handleCloseSelect,
  specificLocation,
  disabled
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global
  const type = scope === 'switch' ? 'locations' : 'switches';

  const switchStatus = scope === 'switch'
    ? useMasterControlBySwitchSelectStore()
    : useMasterControlSelectByLocationStore();
  const { selectedOne } = switchStatus.heatingSchedule;
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;

  // Local
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [openScheduler, setOpenScheduler] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
    inputTemp: tempInput,
    isF: null,
  });
  const { openMessageBox, messages, showMessage, closeMessage } = useMessageBox();

  // Schedule calendar handlers
  const handleClear = () => {};

  const handleClose = () => {
    // useMCStore().closeCalendar();
    setOpenScheduler(false);
  };

  const handleSetNewSchedule = (data) => {
    // data :object / index === schedule list's index
    setScheduleData(data);
    setOpenScheduler(false);
  };

  // ***************input temp logic *****************
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate selection first
    if (!selectedOne || !scheduleData.start.date) {
      showMessage([
        t('masterControl.heatingSchedule.selectLocationsAndSchedule'),
        t('masterControl.heatingSchedule.selectDateRange'),
      ]);
      handleOnClick('heatingSchedule', 'selectB', scope, '_', '_', type, specificLocation);
      return;
    }

    // Validate temperature input
    const validation = validateTemperatureInput(tempInput, isF, 'HEATING_SCHEDULE');

    if (!validation.isValid) {
      showMessage(validation.errorKeys.map(key => t(key);
      handleOnClick('heatingSchedule', 'tempA', scope, null, null, null, specificLocation);
      setTempInput('');
      return;
    }

    // Submit if valid
    const data = {
      start: scheduleData.start,
      end: scheduleData.end,
      inputTemp: validation.temp,
      isF: isF,
    };

    handleOnClick('heatingSchedule', 'on', scope, 0, data);
    setScheduleData({
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: tempInput,
      isF: null,
    });

    if (isMobile && scope !== 'switch') {
      handleCloseSelect();
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
            <MobileWrapper isExpanded={isExpanded}>
              <SectionController
                isMobile={isMobile}
                isMargin={isMobile && isExpanded}
              >
                <MobileHole>
                  <MobileTop>
                    <SectionCircle onClick={handleSubmit}>
                      <CircleButton>
                        <CircleHole>
                          <LogoImg src='images/logo-schedule.svg' />
                        </CircleHole>
                      </CircleButton>
                    </SectionCircle>

                    <InputTemp
                      type='text'
                      onChange={(e) => setTempInput(e.target.value)}
                      value={tempInput}
                      placeholder={isF ? '0°F' : '0 °C'}
                      isMobile={isMobile}
                    />

                    <SectionHeatButton>
                      <HeatButton onClick={handleSubmit}>
                        {t('masterControl.programs.heatingSchedule')}
                      </HeatButton>
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
                <>
                  <SelectLocations
                    name='heatingSchedule'
                    scope={scope}
                    swtName={swtName}
                    specificLocation={specificLocation}
                  />

                  <SchedulerContainer2
                    isSmall={false}
                    handleOpenScheduler={() => setOpenScheduler(!openScheduler)}
                    start={scheduleData.start}
                    end={scheduleData.end}
                  />
                </>
              )}

              {openScheduler && (
                <ScheduleCalendarWrapper isMobile={true}>
                  <ScheduleCalendar
                    handleScheduler={handleSetNewSchedule}
                    handleClose={handleClose}
                    handleClear={handleClear}
                    scheduleList={scheduleData}
                    unit={isF}
                  />
                </ScheduleCalendarWrapper>
              )}

              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.heatingSchedule')}
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
                  name='heatingSchedule'
                  scope={scope}
                  swtName={swtName}
                  specificLocation={specificLocation}
                />
              </SectionSelect>

              <SectionSelect>
                <SchedulerContainer2
                  handleOpenScheduler={() => setOpenScheduler(!openScheduler)}
                  start={scheduleData.start}
                  end={scheduleData.end}
                  isSmall={true}
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
                        <LogoImg src='images/logo-schedule.svg' />
                      </CircleHole>
                    </CircleButton>
                  </SectionCircle>

                  <MobileHole isSmall={true}>
                    <MobileTop isSmall={true}>
                      <InputTemp
                        type='text'
                        onChange={(e) => setTempInput(e.target.value)}
                        value={tempInput}
                        placeholder={isF ? '0°F' : '0 °C'}
                        isMobile={isMobile}
                        isSmall={true}
                      />

                      <SectionHeatButton isSmall={true}>
                        <HeatButton onClick={handleSubmit} isSmall={true}>
                          {t('masterControl.programs.heatingSchedule')}
                        </HeatButton>
                      </SectionHeatButton>
                    </MobileTop>
                  </MobileHole>
                </SectionController>
              </ScopeWrapper>

              {openScheduler && (
                <ScheduleCalendarWrapper isMobile={true}>
                  <ScheduleCalendar
                    handleScheduler={handleSetNewSchedule}
                    handleClose={handleClose}
                    handleClear={handleClear}
                    scheduleList={scheduleData}
                    unit={isF}
                  />
                </ScheduleCalendarWrapper>
              )}

              {openMessageBox && (
                <MobileMessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.heatingSchedule')}
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
              <Title>{t('masterControl.programs.heatingSchedule')}</Title>
              <ImgWrapper>
                <Img src='images/logo-schedule.svg' />
              </ImgWrapper>
            </TitleWrapper>

            <SelectLocations
              size={1}
              name='heatingSchedule'
              scope={scope}
              swtName={swtName}
              specificLocation={specificLocation}
            />
          </SectionTop>

          <SectionScheduler>
            <SchedulerTitle>{t('masterControl.heatingSchedule.startEndDate')}</SchedulerTitle>
            <SchedulerContainer2
              handleOpenScheduler={() => setOpenScheduler(!openScheduler)}
              start={scheduleData.start}
              end={scheduleData.end}
            />
          </SectionScheduler>

          <SectionInputAndButton>
            <InputAndButtonWrapper onSubmit={handleSubmit}>
              <InputWrapper>
                <InputTemp
                  type='text'
                  onChange={(e) => setTempInput(e.target.value)}
                  value={tempInput}
                  placeholder={t('masterControl.heatingSchedule.inputTemp')}
                />
              </InputWrapper>

              <ButtonWrapper disabled={disabled}>
                <ButtonHole disabled={disabled}>
                  <ButtonTop disabled={disabled}>{t('common.apply')}</ButtonTop>
                </ButtonHole>
              </ButtonWrapper>
            </InputAndButtonWrapper>
          </SectionInputAndButton>
          

          {openScheduler && (
            <ScheduleCalendarWrapper>
              <ScheduleCalendar
                handleScheduler={handleSetNewSchedule}
                handleClose={handleClose}
                handleClear={handleClear}
                scheduleList={scheduleData}
                unit={isF}
              />
            </ScheduleCalendarWrapper>
          )}
          {openMessageBox && (
                <MessageBoxWrapper>
                  <InputTempMessage
                    onClose={closeMessage}
                    title={t('masterControl.title')}
                    subtitle={t('masterControl.programs.heatingSchedule')}
                    messages={messages}
                    isMobile={isMobile}
                  />
                </MessageBoxWrapper>
              )}
        </Wrapper>
      )}
    </>
  );
};
export default HeatingSchedule;

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
          ${flexBoxCenter};
          ${layerC};

          ${(p) =>
            p.isExpanded &&
            css`
              height: auto;
              border-radius: 36px;
              ${flexDirectionColumn};
              padding: 2px 0 3px 0;
            `}
          margin-bottom: 8px;
        `}
`;
const MessageBoxWrapper = styled.div`
  width: auto;
  height: auto;

  ${flexBoxCenter}

  position: absolute;
  top: 180px;
  right: 150px;

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

const SectionController = styled.form`
  ${(p) =>
    p.isMargin &&
    css`
      margin-bottom: 6px;
    `};

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
          padding: 0 4px 0 1px;
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
        `}
  border-radius: 17px;
  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10px;
  line-height: 95%;
  padding-top: 2px;
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

const SectionScheduler = styled.section`
  width: 201rem;
  height: 87rem;
  border-radius: 18px;

  ${layerADark}
  ${flexDirectionColumn}
  
  
  padding: 7px 0 2px 0;
`;
const SchedulerTitle = styled.span`
  font-size: 8px;
  letter-spacing: 0.8px;
  text-align: center;
`;

const SectionInputAndButton = styled.section`
  width: 201px;
  height: 37px;
  border-radius: 18px;

  ${layerBDark}
  ${justifyContentSpaceBetween}

  padding: 0 1px;
`;

const InputAndButtonWrapper = styled.form`
  width: 100%;
  ${justifyContentSpaceBetween}
`;
const InputWrapper = styled.div`
  ${flexBoxCenter}

  width: 92px;
  height: 35px;
  border-radius: 25px;

  ${layerA180Deg}
`;
const InputTemp = styled.input`
  width: 84px;
  height: 27px;
  border-radius: 18px;
  ${layerADark};

  font-size: 8rem;

  &::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 91px;
      height: 36px;
      font-size: 14px;
    `}
`;

const ButtonWrapper = styled.button`
  ${flexBoxCenter}

  width: 92px;
  height: 35px;
  border-radius: 25px;

  ${layerA180Deg}

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg};
      cursor: not-allowed;
    `}
`;
const ButtonHole = styled.div`
  ${flexBoxCenter}

  width: 84px;
  height: 27px;
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

  width: 82px;
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

const ScheduleCalendarWrapper = styled.div`
  width: 100%;
  ${flexBoxCenter}
  position: absolute;
  top: 0;
  left: 0;
  z-index: 105;

  ${(p) => p.isMobile && css``}
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
