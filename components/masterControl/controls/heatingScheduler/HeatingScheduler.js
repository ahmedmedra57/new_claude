import styled, { css } from 'styled-components';
import {
import { useMCStore } from '../../zustand-stores';
  MC_SELECTED_READY,
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
} from '../../../styles/commonStyles';

import { useEffect, useState } from 'react';
import { useUnitsStore } from '../../../zustand-stores';

import SchedulerContainer from './SchedulerContainer';
import ScheduleCalendar from './ScheduleCalendar';
import { selectUnits } from '../../../store/slices/settings/unitsSlice';

const HeatingScheduler = ({
  isSelected,
  handleSelect,
  buttonHandler,
  tempInput,
  setTempInput,
  isReady,
  heatingScheduleList,
  isReadyToDispatch,

  isEditable,
  handleCreateNewCommandMessageBox,
  setDisplayMessageBox,
  setMessage,
  setMessageTitle,
  isDialSysDisabled,
  setSubtitle,
}) => {
  const unitsStatus = useUnitsStore();
  const { isF } = unitsStatus;
  const unit = isF ? `°F` : `°C`;

  // Local states
  const [title, setTitle] = useState('select');
  const [src, setSrc] = useState('');

  const [displayScheduler, setDisplayScheduler] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    if (isReadyToDispatch) {
      setScheduleData(heatingScheduleList);
    } else {
      setScheduleData(null);
    }
  }, [isReadyToDispatch]);

  useEffect(() => {
    if (isReady) {
      setSrc('/images/bg-schedule-ready.svg');
    } else if (isReadyToDispatch) {
      setSrc('/images/bg-schedule-focus.svg');
      setTitle('selected');
    } else {
      setSrc('/images/bg-schedule-none.svg');
      setTitle('select');
    }
  }, [isReadyToDispatch, isReady]);

  // Schedule calendar handlers
  const handleOpenScheduler = () => {
    if (isSelected) {
      setDisplayScheduler(true);
    }
  };

  const handleClear = () => {
    // useMCStore().clearScheduler();
  };
  const handleClose = () => {
    setDisplayScheduler(false);
  };

  const handleSetNewSchedule = (data) => {
    setScheduleData(data);
    setDisplayScheduler(false);
  };

  const select = () => {
    if (!isEditable) {
      handleCreateNewCommandMessageBox();
    } else {
      handleSelect();
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isSelected) {
      if (isReadyToDispatch) {
        setTempInput('');
        buttonHandler('heatingSchedule', 'off');
      } else {
        const temp = Number(tempInput);
        const data = {
          start: scheduleData && scheduleData.start,
          end: scheduleData && scheduleData.end,
          inputTemp: temp,
          isF,
        };

        // check if the temperature, start date and end date are valid or not
        if (tempInput && data.start && data.end) {
          if (isF) {
            if (temp >= 250 && temp <= 1830) {
              buttonHandler('heatingSchedule', 'on', data);

              setTempInput(`${temp} °F`);
            } else {
              setTempInput('');
              buttonHandler('heatingSchedule', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 250°F and 1830°F  ',
                ],
                'controls'
              );
            }
          } else {
            if (temp >= 121 && temp <= 999) {
              // id === instantHeat, state, scope, temp
              buttonHandler('heatingSchedule', 'on', data);

              setTempInput(`${temp} °C`);
            } else {
              setTempInput('');
              buttonHandler('heatingSchedule', 'message');
              handleMessageBox(
                'master control',
                [
                  'wrong temperature',
                  'please input temperature between 121°C and 999°C  ',
                ],
                'controls'
              );
            }
          }
        } else {
          handleMessageBox(
            'master control',
            [
              'dates and temperature missing',
              'please input temperature and choose your start date and end date.',
            ],
            'heating schedule program'
          );
          return;
        }
      }
    } else if (!isEditable) {
      handleCreateNewCommandMessageBox();
    }
  };

  const handleMessageBox = (swtName, message, subtitle) => {
    setMessage(message);
    setMessageTitle(swtName);
    setDisplayMessageBox(true);
    setSubtitle(subtitle);
  };

  return (
    <Wrapper onClick={() => isSelected || select()}>
      <Img src={src} />

      <ContentsPositionAbsolute>
        <ControllerTitle ready={isReady}>
          <Title>heating schedule program</Title>
          <Icon src='/images/logo-schedule.svg' />
        </ControllerTitle>

        <SchedulerOuterWrapper>
          <SchedulerWrapper ready={isReady}>
            <SchedulerContainer
              handleOpenScheduler={handleOpenScheduler}
              start={scheduleData ? scheduleData.start : null}
              end={scheduleData ? scheduleData.end : null}
              ready={isReady}
              isDialSysDisabled={isDialSysDisabled}
              handleMessageBox={handleMessageBox}
            />
          </SchedulerWrapper>
        </SchedulerOuterWrapper>

        <ContentsWrapperHole ready={isReady} onSubmit={handleOnSubmit}>
          <SectionInput>
            <InputTitle>input temp</InputTitle>
            <InputWrapper ready={isReady}>
              <TempInput
                type='text'
                placeholder={`---${unit}`}
                onChange={(e) =>
                  isDialSysDisabled
                    ? handleMessageBox(
                        'master control',
                        [
                          'm.c. shut off',
                          "can't be used another action with deactivate",
                        ],
                        'deactivate'
                      )
                    : isSelected && setTempInput(e.target.value)
                }
                value={tempInput}
                ready={isReady}
              />
            </InputWrapper>
          </SectionInput>

          <SectionButton>
            <ButtonWrapper
              apply={false}
              ready={isReady}
              onClick={handleOnSubmit}
              isReadyToDispatch={isReadyToDispatch}
            >
              <ButtonHole apply={false} ready={isReady}>
                <ButtonTop apply={false} ready={isReady}>
                  {title}
                </ButtonTop>
              </ButtonHole>
            </ButtonWrapper>
          </SectionButton>
        </ContentsWrapperHole>
      </ContentsPositionAbsolute>

      {displayScheduler && (
        <ScheduleCalendarWrapper>
          <ScheduleCalendar
            handleScheduler={handleSetNewSchedule}
            handleClose={handleClose}
            handleClear={handleClear}
            scheduleList={heatingScheduleList}
            unit={isF}
          />
        </ScheduleCalendarWrapper>
      )}
    </Wrapper>
  );
};

export default HeatingScheduler;

const Wrapper = styled.div`
  width: 60%;

  margin-left: 262rem;
  margin-top: -5rem;

  position: relative;
`;

const Img = styled.img``;

const ControllerTitle = styled.div`
  width: 318px;
  height: 22px;
  border-radius: 11px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 2px 0 10px;
  margin-left: 32rem;

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}
`;

const Title = styled.span`
  font-size: 8px;
`;

const Icon = styled.img`
  height: 95%;
`;

const ContentsPositionAbsolute = styled.div`
  width: 350px;
  position: absolute;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  top: 9rem;
  left: 20rem;
`;

const SchedulerOuterWrapper = styled.div`
  margin-top: 4rem;
  margin-left: 16rem;

  padding: 0 0 0 0;
  width: 340px;
  height: 50px;

  background: url('/images/bg-scheduler-wrapper.svg') no-repeat;
`;
const SchedulerWrapper = styled.div`
  width: 340px;
  height: 50px;

  background: url('/images/bg-scheduler.svg') no-repeat;
  ${(p) =>
    p.ready &&
    css`
      background: url('/images/scheduler-ready.svg') no-repeat;
    `}
`;

const ContentsWrapperHole = styled.form`
  margin-top: 4rem;
  margin-left: 2rem;

  width: 334px;
  height: 27px;
  border-radius: 24px;
  ${layerA}

  ${justifyContentSpaceBetween}
  padding: 0 2rem 0 15rem;

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}
`;

const SectionInput = styled.section`
  height: 100%;

  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  width: 120px;
  height: 24px;
  border-radius: 22px;
  ${layerA180Deg}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0px 1px #000000;
    `}

  ${(p) =>
    p.active &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

    ${flexBoxCenter};
`;
const TempInput = styled.input`
  width: 112px;
  height: 16px;

  ${layerADark}
  border-radius: 18px;
  font-size: 10px;
  ::placeholder {
    color: #fff;
  }
  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}

  ${(p) => p.active && css``}
`;

const SectionButton = styled.section`
  height: 100%;
  ${flexBoxCenter}
`;
const ButtonWrapper = styled.button`
  width: 120px;
  height: 24px;

  ${layerA180Deg}

  border-radius: 25px;

  ${(p) =>
    p.isReadyToDispatch &&
    css`
      ${MC_SELECTED_READY}
    `}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${flexBoxCenter}
  ${(p) =>
    p.apply &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}
`;
const ButtonHole = styled.div`
  width: 112px;
  height: 16px;
  border-radius: 18px;
  ${layerA}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}

  ${(p) =>
    p.apply &&
    css`
      background: #124000;
      box-shadow: inset 0px 0px 1px #000000;
    `}
`;
const ButtonTop = styled.span`
  width: 110px;
  height: 14px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

  ${(p) =>
    p.apply &&
    css`
      background: transparent linear-gradient(180deg, #4baf00 0%, #124000 100%);
      box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
      border: 0.5px solid #000000;
    `}

    font-size:10rem;
`;

const InputTitle = styled.span`
  font-size: 8px;
  margin-right: 10rem;
`;

const ScheduleCalendarWrapper = styled.div`
  width: 1000rem;
  height: 600rem;
  ${flexBoxCenter}
  position: absolute;
  top: -300rem;
  left: -270rem;
  z-index: 100;
`;
