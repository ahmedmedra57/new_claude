import { useEffect, useState } from 'react';
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
  flexDirectionColumn,
  justifyContentSpaceBetween,
  grayModeLayer,
  DisableButtonIndentTop,
} from '../../styles/commonStyles';

import InputTempMessage from '../../userMessages/inputTempMessage';
import MCScheduleCalender from './MCScheduleCalendar';
import { useSelector } from 'react-redux';
import { selectUnits } from '../../store/slices/settings/unitsSlice';
import { useMemo } from 'react';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';

const MCHeatingSchedule = ({
  handleOnClick,
  heatingScheduleList,
  isActivated,
  isReady,
  tempInput,
  setTempInput,
  isMobile,
  isDisabled,
  swtName,
  location,
  machine
}) => {
  const unitsStatus = useSelector(selectUnits);
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
  // local states
  const [openScheduler, setOpenScheduler] = useState(false);
  const { start, end } = heatingScheduleList[0];
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [readyToInputTemp, setReadyToInputTemp] = useState(true);

  const startDate =
    start.date instanceof Date ? start.date : new Date(start.date);
  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${startDate.getDate()} / ${
          startDate.getMonth() + 1
        } / ${startDate.getFullYear()} `
      : ' -----------------';

  const endDate = end.date instanceof Date ? end.date : new Date(end.date);
  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${endDate.getDate()} / ${
          endDate.getMonth() + 1
        } / ${endDate.getFullYear()} `
      : ' -----------------';

  const temp =
    typeof tempInput === 'number' ? tempInput : Number(tempInput?.slice(0, -3));

  // temporary variables
  // const isF = false;
  // const isActivated = false;
  // const isReady = true;

  const isValidTemp = useMemo(() => {
    if (isF) {
      return temp >= 250 && temp <= 1830;
    } else {
      return temp >= 121 && temp <= 999;
    }
  }, [isF, temp]);

  const handleClear = (index) => {
    // delete
    setTempInput('');
    handleOnClick('heatingSchedule', 'clear', 0, null, index);
  };

  const handleClose = () => {
    setOpenScheduler(false);
  };

  const handleSetNewSchedule = (data, index) => {
    if (isValidTemp) {
      handleOnClick('heatingSchedule', 'on', temp, data, index);
      setOpenScheduler(false);
    } else {
      setOpenMessageBox(true);
    }
  };

  const handleOpenCalenderButton = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    if (isValidTemp) {
      setOpenScheduler(true);
    } else {
      setTempInput('');
      setOpenMessageBox(true);
    }
  };

  // for mobile
  const handleApply = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    if (isValidTemp) {
      handleOnClick('heatingSchedule', 'on', temp, heatingScheduleList[0], 0);
    } else {
      setTempInput('');
      setOpenMessageBox(true);
    }
  };

  const logo = (EBP_mode === 0 && isEbp)|| isDisabled
    ? '/images/logo-schedule-disabled.svg'
    : '/images/logo-schedule.svg';

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <SectionMobileTop>
            <ControllerForm
              onSubmit={handleApply}
              isReady={isReady}
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
                    <LogoImg src={logo} />
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
                  isReady={isReady}
                  // onClick={handleSubmit}
                >
                  <MobileInput
                    isActivated={isActivated}
                    isDisabled={isDisabled}
                    disabled={isDisabled}
                    isReady={isReady}
                    degree={true}
                    placeholder={isF ? '--- °F' : '--- °C'}
                    value={tempInput}
                    onChange={(e) =>
                      setTempInput(
                        Number(
                          e.target.value.includes('°')
                            ? e.target.value?.slice(0, -3)
                            : e.target.value
                        )
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                  />

                  <MobileButton onClick={handleApply}>
                    <MobileButtonTop
                      isActivated={isActivated}
                      isDisabled={isDisabled}
                      isReady={isReady}
                    >
                      heating schedule<br></br>program
                    </MobileButtonTop>
                  </MobileButton>
                </MobileMainTop>
              </SectionMobileMain>
            </ControllerForm>

            {openScheduler && !isDisabled && (
              <ScheduleCalendarWrapper isMobile={true}>
                {/* <ScheduleCalendar
                  handleScheduler={handleMobileSetNewSchedule}
                  handleClose={handleClose}
                  handleClear={handleClear}
                  scheduleList={heatingScheduleList}
                  // heatingScheduleCalendar.id  == number of schedulers
                  unit={isF}
                /> */}
                <MCScheduleCalender
                  handleScheduler={handleSetNewSchedule}
                  handleClose={handleClose}
                  handleClear={handleClear}
                  // start={start}
                  // end={end}
                  scheduleList={heatingScheduleList}
                  // heatingScheduleCalendar.id  == number of schedulers
                  unit={isF}
                  tempInput={tempInput}
                  setTempInput={setTempInput}
                 
                />
              </ScheduleCalendarWrapper>
            )}

            {openMessageBox && (
              <MessageBoxWrapper>
                <InputTempMessage
                  onClose={() => setOpenMessageBox(false)}
                  messages={[
                    'wrong temperature,',
                    'please input your temperature',
                    '( the minimum temperature is 121°C - 250°F )',
                    '( the maximum temperature is 999°C - 1830°F )',
                  ]}
                  title={'switch control'}
                  subtitle={'heating schedule program'}
                />
              </MessageBoxWrapper>
            )}
          </SectionMobileTop>

          <MobileSectionBottom >
            <BottomInner isDisabled={isDisabled}>
              <DisplayWrapper>
                <TitleAndDisplayWrapper isMobile={true}>
                  <Title isDisplay={true} isMobile={true}>
                    start date:
                  </Title>
                  <DisplaySchedule isMobile={true} isDisabled={isDisabled} isActivated={isActivated}>
                    {displayStart}
                  </DisplaySchedule>
                </TitleAndDisplayWrapper>

                <TitleAndDisplayWrapper isMobile={true}>
                  <Title isDisplay={true} isMobile={true}>
                    end date:
                  </Title>
                  <DisplaySchedule isMobile={true} isDisabled={isDisabled} isActivated={isActivated}>
                    {displayEnd}
                  </DisplaySchedule>
                </TitleAndDisplayWrapper>
              </DisplayWrapper>

              <SchedulerButton onClick={() => setOpenScheduler(true)}>
                <ArrowImg src='/images/masterCtr-select-btn.svg' />
              </SchedulerButton>
            </BottomInner>
          </MobileSectionBottom>
        </Wrapper>
      ) : (
        <Wrapper>
          <MainOuterHole>
            <MainOuterLayer
              isActivated={isActivated}
              isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
              isReady={isReady}
              style={{
                  pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                  cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                         }}
            >
              <MainInnerHole isActivated={isActivated} isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}>
                <MainTopForm
                  isActivated={isActivated}
                  isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                  isReady={isReady}
                  onSubmit={handleOpenCalenderButton}
                  onClick={handleOpenCalenderButton}
                  style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                >
                  <SectionTop>
                    <Title>
                      heating schedule <br></br>program
                    </Title>
                    <DegreeInput
                      isActivated={isActivated}
                      isDisabled={(EBP_mode === 0 && isEbp) ||isDisabled}
                      disabled={(EBP_mode === 0 && isEbp)||isDisabled}
                      style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                      isReady={isReady}
                      degree={true}
                      placeholder={isF ? '--- °F' : '--- °C'}
                      value={tempInput}
                      onChange={(e) => {
                        e.stopPropagation();
                        setTempInput(
                          Number(
                            e.target.value.includes('°')
                              ? e.target.value?.slice(0, -3)
                              : e.target.value
                          )
                        );
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <SectionButton
                      isActivated={isActivated}
                      isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                      style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                      isReady={isReady}
                    >
                      <Button
                        isActivated={isActivated}
                        isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                        style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                        isReady={isReady}
                        onClick={handleOpenCalenderButton}
                      >
                        <ButtonTop
                          isActivated={isActivated}
                          isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                          style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                          isReady={isReady}
                        >
                          <LogoImg src={logo} />
                        </ButtonTop>
                      </Button>
                    </SectionButton>
                  </SectionTop>

                  <SectionBottom>
                    <TitleAndDisplayWrapper>
                      <Title isDisplay={true}>start date</Title>
                      <DisplaySchedule
                        isActivated={isActivated}
                        isDisabled={(EBP_mode === 0 && isEbp) || isDisabled}
                         style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                      >
                        {displayStart}
                      </DisplaySchedule>
                    </TitleAndDisplayWrapper>

                    <TitleAndDisplayWrapper>
                      <Title isDisplay={true}>end date</Title>
                      <DisplaySchedule
                        isActivated={isActivated}
                        isDisabled={ (EBP_mode === 0 && isEbp) ||isDisabled}
                         style={{
                      pointerEvents: (EBP_mode === 0 && isEbp)? 'none' : 'auto',
                      cursor: (EBP_mode === 0 && isEbp) ? 'not-allowed' : 'auto',
                             }}
                      >
                        {displayEnd}
                      </DisplaySchedule>
                    </TitleAndDisplayWrapper>
                  </SectionBottom>
                </MainTopForm>
              </MainInnerHole>
            </MainOuterLayer>
          </MainOuterHole>

          {openScheduler && (
            <ScheduleCalendarWrapper>
              {/* <ScheduleCalendar
            handleScheduler={handleSetNewSchedule}
            handleClose={handleClose}
            handleClear={handleClear}
            // start={start}
            // end={end}
            scheduleList={heatingScheduleList}
            // heatingScheduleCalendar.id  == number of schedulers
            unit={isF}
          /> */}
              <MCScheduleCalender
                handleScheduler={handleSetNewSchedule}
                handleClose={handleClose}
                handleClear={handleClear}
                // start={start}
                // end={end}
                scheduleList={heatingScheduleList}
                // heatingScheduleCalendar.id  == number of schedulers
                unit={isF}
                tempInput={tempInput}
                setTempInput={setTempInput}
              />
            </ScheduleCalendarWrapper>
          )}

          {openMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setOpenMessageBox(false)}
                messages={[
                  'wrong temperature,',
                  'please input your temperature',
                  '( the minimum temperature is 121°C - 250°F )',
                  '( the maximum temperature is 999°C - 1830°F )',
                ]}
                title={'switch control'}
                subtitle={'heating schedule program'}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default MCHeatingSchedule;

const SectionMobileTop = styled.section`
  width: 303px;
  height: 54px;
  border-radius: 33px;
  ${layerA};
  ${flexBoxCenter};
  margin-bottom: 4px;
`;
const ControllerForm = styled.form`
  width: 299px;
  height: 50px;
  border-radius: 31px;

  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 3px 0 5px;

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
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 2px #000000;
      border: 0.5px solid #000000;
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
    `};
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
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
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
  line-height: 98%;
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
    `};
  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;

const MobileSectionBottom = styled.section`
  width: 303px;
  height: 72px;
  border-radius: 36px;
  ${layerA};
  ${flexBoxCenter};

  
`;
const BottomInner = styled.div`
  width: 299px;
  height: 68px;
  border-radius: 34px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 10px 0 6px;

  ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};

`;

const DisplayWrapper = styled.div`
  width: 248px;
`;

const SchedulerButton = styled.button`
  height: 24px;
  width: 27px;
  ${flexBoxCenter};
`;
const ArrowImg = styled.img`
  height: 100%;
`;

// for desktop
const Wrapper = styled.div`
  ${(p) =>
    p.isMobile
      ? css`
          width: 100%;
          height: auto;
          ${flexDirectionColumn};
        `
      : css`
          width: 397px;
          height: 154px;
          border-radius: 6px;

          ${flexBoxCenter};
          ${layerA90Deg};
        `};

  position: relative;
`;
const MainOuterHole = styled.div`
  width: 389px;
  height: 143px;
  border-radius: 39px;
  ${layerA}
  ${flexBoxCenter}
`;

const MainOuterLayer = styled.div`
  width: 385px;
  height: 139px;
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
  height: 123px;
  border-radius: 29px;

  ${layerB};
  ${flexBoxCenter}

  ${(p) =>
    p.isActivated &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}
    ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};
`;
const MainTopForm = styled.form`
  width: 367px;
  height: 121px;
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

  ${flexDirectionColumn};
  padding: 2px 2px 6px 2px;
`;

const SectionTop = styled.section`
  width: 100%;
  ${justifyContentSpaceBetween};
  padding-left: 17px;
`;

const Title = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  line-height: 98%;
  text-align: center;

  ${(p) =>
    p.isDisplay &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;
      text-align: left;
      ${p.isMobile &&
      css`
        width: 85px;

        font-size: 9px;
        letter-spacing: 0.9px;
        text-align: right;
        padding-right: 1.5px;
      `}
    `}
`;

const DegreeInput = styled.input`
  width: 72px;
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
      ${DisableButtonIndentTop};
    `};

  ${flexBoxCenter}
  margin-left: 15px;

  ::placeholder {
    color: #fff;
  }
`;

const Degree = styled.span`
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

const SectionButton = styled.section`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  ${layerA}

  ${(p) =>
    p.isActivated &&
    css`
      /*   active style
  background: #124000;
  box-shadow: inset 0px 0px 3px #000000; */
      ${activeInput}
    `}
    ${(p) =>
    p.isDisabled &&
    css`
      ${grayModeLayer};
    `};

  ${flexBoxCenter}
`;
const Button = styled.button`
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
  height: 120%;
`;

const SectionBottom = styled.section`
  width: 100%;
  height: 59px;

  ${flexDirectionColumn}
  padding: 0 5px;
`;
const TitleAndDisplayWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
`;

const DisplaySchedule = styled.div`
  ${flexBoxCenter};
  ${layerA};

  ${(p) =>
    p.isMobile
      ? css`
          width: 164px;
          height: 28px;
          border-radius: 29px;
          font-size: 10px;
        `
      : css`
          width: 240px;
          height: 28px;
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: 1.2px;
        `}

  ${(p) =>
    p.isActivated &&
    css`
      ${activeInput}
    `};
  ${(p) =>
    p.isDisabled &&
    css`
      ${DisableButtonIndentTop};
    `};
`;

const ScheduleCalendarWrapper = styled.div`
  position: absolute;
  ${flexBoxCenter}
  z-index: 100;

  ${(p) =>
    p.isMobile
      ? css`
          top: -152px;
          left: -12px;
        `
      : css`
          width: 1205px;
          height: 700px;

          top: -400px;
          left: -20px;
        `}
`;

const MessageBoxWrapper = styled.div`
  width: 1180px;
  height: 600px;
  position: absolute;

  ${flexBoxCenter}

  top: -230px;
  left: 0;
  z-index: 1000;
`;
