import { START_DATE, useDatepicker, useMonth } from '@datepicker-react/hooks';
import { useState, useEffect } from 'react';
import moment from 'moment';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerB,
  layerC,
  layerA90Deg,
  justifyContentFlexStart,
  layerADark,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

import Month from '../../masterControl/controls/heatingScheduler/Month';
import SchedulerButton from '../../masterControl/controls/heatingScheduler/SchedulerButton';
import TimePicker from '../../masterControl/controls/heatingScheduler/TimePicker';
import TempInputAndSelectBox from './TempInputAndSelectBox';

import InputTempMessage from '../../userMessages/inputTempMessage';
import DatepickerContext from '../../masterControl/controls/heatingScheduler/datepickerContext';

const MCScheduleCalender = ({
  handleScheduler,
  handleClose,
  handleClear,
  scheduleList,
 
   // unit is about °F or °C
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const currHour = moment().format('hh');
  const currMinutes = moment().format('mm');
  const currDivision = moment().format('HH') > 12 ? 'pm' : 'am';

  const [isFirstSchedule, setIsFirstSchedule] = useState(
    scheduleList[0].start.date ? true : false
  );
  // const [start, setStart] = useState(scheduleList[0].start);
  // const [end, setEnd] = useState(scheduleList[0].end);
  const [currSchedule, setCurrSchedule] = useState(0);
  const [scheduleNumber, setScheduleNumber] = useState(scheduleList.length);
  const [message, setMessage] = useState([]);
  const [displayMessageBox, setDisplayMessageBox] = useState(false);

  const [editable, setEditable] = useState(true);

  const [startTime, setStartTime] = useState({
    hour: scheduleList[0].start.time
      ? scheduleList[0].start.time.hour
      : currHour,
    minute: scheduleList[0].start.time
      ? scheduleList[0].start.time.minute
      : currMinutes,
    division: scheduleList[0].start.time
      ? scheduleList[0].start.time.division
      : currDivision,
  });
  const [endTime, setEndTime] = useState({
    hour: scheduleList[0].end.time ? scheduleList[0].end.time.hour : '00',
    minute: scheduleList[0].end.time ? scheduleList[0].end.time.minute : '00',
    division: scheduleList[0].end.time
      ? scheduleList[0].end.time.division
      : 'am',
  });

  const [dateState, setDateState] = useState({
    startDate: scheduleList[0].start.date
      ? new Date(scheduleList[0].start.date)
      : scheduleList[0].start.date,
    endDate: scheduleList[0].end.date
      ? new Date(scheduleList[0].end.date)
      : scheduleList[0].end.date,
    focusedInput: START_DATE,
  });

  useEffect(() => {
    if (scheduleList[currSchedule].start.date) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  }, [scheduleList[currSchedule], currSchedule]);

  useEffect(() => {
    if (!scheduleList[0].start.date) {
      setIsFirstSchedule(false);
    } else {
      setIsFirstSchedule(true);
      setScheduleNumber(scheduleList.length);
    }
  }, [scheduleList]);

  useEffect(() => {
    // setStart(scheduleList[currSchedule].start);
    // setEnd(scheduleList[currSchedule].end);
    // set time and date states to display
    setStartTime({
      hour: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.hour
        : currHour,
      minute: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.minute
        : currMinutes,
      division: scheduleList[currSchedule].start.time
        ? scheduleList[currSchedule].start.time.division
        : currDivision,
    });
    setEndTime({
      hour: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.hour
        : '00',
      minute: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.minute
        : '00',
      division: scheduleList[currSchedule].end.time
        ? scheduleList[currSchedule].end.time.division
        : 'am',
    });
    setDateState({
      startDate: scheduleList[currSchedule].start.date
        ? new Date(scheduleList[currSchedule].start.date)
        : scheduleList[currSchedule].start.date,
      endDate: scheduleList[currSchedule].end.date
        ? new Date(scheduleList[currSchedule].end.date)
        : scheduleList[currSchedule].end.date,
      focusedInput: START_DATE,
    });
  }, [currSchedule, scheduleList[currSchedule]]);

  //****** Date format logic ******
  const startArray =
    dateState.startDate &&
    dateState.startDate
      .toLocaleString('en-ca', {
        year: 'numeric',
        month: 'short',
        weekday: 'short',
        day: 'numeric',
      })
      .replace(/\,/g, '')
      .split(' ');

  const endArray =
    dateState.endDate &&
    dateState.endDate
      .toLocaleString('en-ca', {
        year: 'numeric',
        month: 'short',
        weekday: 'short',
        day: 'numeric',
      })
      .replace(/\,/g, '')
      .split(' ');

  const startDate =
    dateState.startDate &&
    `${startArray[3]} / ${startArray[1]} / ${startArray[0]} ${startArray[2]}`;

  const endDate =
    dateState.endDate &&
    `${endArray[3]} / ${endArray[1]} / ${endArray[0]} ${endArray[2]}`;

  const handleDateChange = (data) => {
    if (!data.focusedInput) {
      setDateState({ ...data, focusedInput: START_DATE });
    } else {
      setDateState(data);
    }
  };
  //****** Date format logic ******

  // ***** Time picker *****
  const handleSetTime = (time, id) => {
    if (id === 'start') {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
  };

  const startTimeSet = `${startTime.hour}:${startTime.minute} ${startTime.division}`;
  const endTimeSet = `${endTime.hour}:${endTime.minute} ${endTime.division}`;

  // ***** Time picker *****
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
    goToPreviousYear,
    goToNextMonthsByOneMonth,
    goToNextYear,
    onResetDates,
    isStartDate,
  } = useDatepicker({
    startDate: dateState.startDate,
    endDate: dateState.endDate,
    focusedInput: dateState.focusedInput,
    onDatesChange: handleDateChange,
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currMonth = months[activeMonths[0].month];
  const nextMonth = months[activeMonths[1].month];

  // Pass them as props to Day component For styling(border-radious)
  const startDay =
    dateState.startDate &&
    `${dateState.startDate.getMonth()}${dateState.startDate.getDate()}`;
  const endDay =
    dateState.endDate &&
    `${dateState.endDate.getMonth()}${dateState.endDate.getDate()}`;

  const handleOnClick = (id) => {
    // id  is the button number (1 - clear / 2 - close / 3 - add schedule and ready)
    switch (id) {
      // clear logic
      case '1': {
        // reset calender library
        onResetDates();
        setStartTime({
          hour: currHour,
          minute: currMinutes,
          division: currDivision,
        });
        setEndTime({
          hour: '00',
          minute: '00',
          division: 'am',
        });

        // setEditable(false);
        // target index to delete
        handleClear(currSchedule);
        return;
      }
      case '2': {
        // close logic
        handleClose();
        return;
      }
      case '4': {

        // add a schedule
        // 1. check schedule (dateState)
        // 2. check unit
        // 3. check temperature range
        if (dateState.startDate && dateState.endDate) {
          handleScheduler(
            {
              start: { date: dateState.startDate, time: startTime },
              end: { date: dateState.endDate, time: endTime },
            },
            currSchedule
          );
        } else {
          if (!isMobile) {
            setMessage([
              'in order to finalize your heating schedule, ',
              'please choose your start date and end date',
            ]);
            setDisplayMessageBox(true);
          } else {
            handleClose();
          }
        }

        return;
      }
      default:
        return;
    }
  };

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
      }}
    >
      {isMobile ? (
        <MobileWrapper>
          <MobileHeader>
            <Title isMobile={isMobile}>start date - end date</Title>
          </MobileHeader>

          <MobileContentsWrapper>
            <CalendarWrapper isMobile={isMobile}>
              <CalendarInnerWrapper>
                <Calendar isMobile={isMobile}>
                  <YearAndMonthWrapper isMobile={isMobile}>
                    <YearOuter isMobile={isMobile}>
                      <YearInner isMobile={isMobile}>
                        <YearTop isMobile={isMobile}>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-previous.svg'
                            onClick={() => goToPreviousYear(`1`)}
                          />
                          <YearTitle isMobile={isMobile}>
                            {activeMonths[0].year}
                          </YearTitle>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-next.svg'
                            onClick={() => goToNextYear('1')}
                          />
                        </YearTop>
                      </YearInner>
                    </YearOuter>

                    <MonthOuter isMobile={isMobile}>
                      <MonthInner isMobile={isMobile}>
                        <MonthTop isMobile={isMobile}>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-previous.svg'
                            onClick={goToPreviousMonths}
                          />
                          <MonthTitle isMobile={isMobile}>
                            {currMonth}
                          </MonthTitle>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-next.svg'
                            onClick={goToNextMonthsByOneMonth}
                          />
                        </MonthTop>
                      </MonthInner>
                    </MonthOuter>
                  </YearAndMonthWrapper>
                  <Month
                    key={`${activeMonths[0].year}-${activeMonths[0].month}`}
                    year={activeMonths[0].year}
                    month={activeMonths[0].month}
                    firstDayOfWeek={firstDayOfWeek}
                    startDay={dateState.startDate && startDay}
                    endDay={dateState.endDate && endDay}
                    isDisabled={!editable}
                  />
                </Calendar>

                <WatchWrapper isMobile={isMobile}>
                  <TimePicker
                    id='start'
                    time={startTime}
                    setTime={handleSetTime}
                  />
                </WatchWrapper>
              </CalendarInnerWrapper>

              <CalendarInnerWrapper>
                <Calendar isMobile={isMobile}>
                  <YearAndMonthWrapper isMobile={isMobile}>
                    <YearOuter isMobile={isMobile}>
                      <YearInner isMobile={isMobile}>
                        <YearTop isMobile={isMobile}>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-previous.svg'
                            onClick={() => goToPreviousYear(`1`)}
                          />
                          <YearTitle isMobile={isMobile}>
                            {activeMonths[1].year}
                          </YearTitle>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-next.svg'
                            onClick={() => goToNextYear('1')}
                          />
                        </YearTop>
                      </YearInner>
                    </YearOuter>

                    <MonthOuter isMobile={isMobile}>
                      <MonthInner isMobile={isMobile}>
                        <MonthTop isMobile={isMobile}>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-previous.svg'
                            onClick={goToPreviousMonths}
                          />
                          <MonthTitle isMobile={isMobile}>
                            {nextMonth}
                          </MonthTitle>
                          <GoButton
                            isMobile={isMobile}
                            src='/images/go-next.svg'
                            onClick={goToNextMonthsByOneMonth}
                          />
                        </MonthTop>
                      </MonthInner>
                    </MonthOuter>
                  </YearAndMonthWrapper>

                  <Month
                    key={`${activeMonths[1].year}-${activeMonths[1].month}`}
                    year={activeMonths[1].year}
                    month={activeMonths[1].month}
                    firstDayOfWeek={firstDayOfWeek}
                    startDay={dateState.startDate && startDay}
                    endDay={dateState.endDate && endDay}
                    isDisabled={!editable}
                  />
                </Calendar>

                <WatchWrapper isMobile={isMobile}>
                  <TimePicker id='end' time={endTime} setTime={handleSetTime} />
                </WatchWrapper>
              </CalendarInnerWrapper>
            </CalendarWrapper>

            <DisplayAndButtonWrapper isMobile={isMobile}>
              <DisplayDateWrapper isMobile={isMobile}>
                <DisplayDateOuter isMobile={isMobile}>
                  <DisplayDateInner isMobile={isMobile}>
                    <DateTitleWrapper isMobile={isMobile}>
                      <DateTitle isMobile={isMobile}>start date</DateTitle>
                    </DateTitleWrapper>

                    <DisplayTop isMobile={isMobile}>
                      <DisplayDate isMobile={isMobile}>
                        {dateState.startDate
                          ? startDate
                          : 'Choose the start date'}
                        {dateState.startDate && ` - ${startTimeSet}`}
                      </DisplayDate>
                    </DisplayTop>
                  </DisplayDateInner>
                </DisplayDateOuter>

                <DisplayDateOuter isMobile={isMobile}>
                  <DisplayDateInner isMobile={isMobile}>
                    <DateTitleWrapper isMobile={isMobile}>
                      <DateTitle isMobile={isMobile}>end date</DateTitle>
                    </DateTitleWrapper>

                    <DisplayTop isMobile={isMobile}>
                      <DisplayDate isMobile={isMobile}>
                        {dateState.endDate ? endDate : 'Choose the end date'}

                        {dateState.endDate && ` -  ${endTimeSet}`}
                      </DisplayDate>
                    </DisplayTop>
                  </DisplayDateInner>
                </DisplayDateOuter>
              </DisplayDateWrapper>

              <ButtonWrapper isMobile={isMobile}>
                <ButtonGroupWrapper isMobile={isMobile}>
                  <SchedulerButton
                    isMobile={isMobile}
                    name='clear'
                    id='1'
                    onClickHandler={handleOnClick}
                  />
                  <SchedulerButton
                    isMobile={isMobile}
                    name='close'
                    id='2'
                    onClickHandler={handleOnClick}
                  />
                  <SchedulerButton
                    isMobile={isMobile}
                    name={'apply'}
                    id='4'
                    onClickHandler={handleOnClick}
                  />
                </ButtonGroupWrapper>
              </ButtonWrapper>
            </DisplayAndButtonWrapper>
          </MobileContentsWrapper>

          {displayMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setDisplayMessageBox(false)}
                messages={message}
                title='heating schedule'
              />
            </MessageBoxWrapper>
          )}
        </MobileWrapper>
      ) : (
        <Wrapper>
          <HatWrapper imgSrc={'/images/scheduler-hat.svg'}>
            <TitleIcon src={'/images/scheduler-icon.svg'} />
            <Title>start date - end date</Title>
          </HatWrapper>

          <SectionMain>
            <CalendarWrapper>
              <Calendar>
                <YearAndMonthWrapper>
                  <YearOuter>
                    <YearInner>
                      <YearTop>
                        <GoButton
                          src='/images/go-previous.svg'
                          onClick={() => goToPreviousYear(`1`)}
                        />
                        <YearTitle>{activeMonths[0].year}</YearTitle>
                        <GoButton
                          src='/images/go-next.svg'
                          onClick={() => goToNextYear('1')}
                        />
                      </YearTop>
                    </YearInner>
                  </YearOuter>

                  <MonthOuter>
                    <MonthInner>
                      <MonthTop>
                        <GoButton
                          src='/images/go-previous.svg'
                          onClick={goToPreviousMonths}
                        />
                        <MonthTitle>{currMonth}</MonthTitle>
                        <GoButton
                          src='/images/go-next.svg'
                          onClick={goToNextMonthsByOneMonth}
                        />
                      </MonthTop>
                    </MonthInner>
                  </MonthOuter>
                </YearAndMonthWrapper>
                <Month
                  key={`${activeMonths[0].year}-${activeMonths[0].month}`}
                  year={activeMonths[0].year}
                  month={activeMonths[0].month}
                  firstDayOfWeek={firstDayOfWeek}
                  startDay={dateState.startDate && startDay}
                  endDay={dateState.endDate && endDay}
                  isDisabled={!editable}
                />
              </Calendar>

              <WatchWrapper>
                <TimePicker
                  id='start'
                  time={startTime}
                  setTime={handleSetTime}
                />
              </WatchWrapper>

              <Calendar>
                <YearAndMonthWrapper>
                  <YearOuter>
                    <YearInner>
                      <YearTop>
                        <GoButton
                          src='/images/go-previous.svg'
                          onClick={() => goToPreviousYear(`1`)}
                        />
                        <YearTitle>{activeMonths[1].year}</YearTitle>
                        <GoButton
                          src='/images/go-next.svg'
                          onClick={() => goToNextYear('1')}
                        />
                      </YearTop>
                    </YearInner>
                  </YearOuter>

                  <MonthOuter>
                    <MonthInner>
                      <MonthTop>
                        <GoButton
                          src='/images/go-previous.svg'
                          onClick={goToPreviousMonths}
                        />
                        <MonthTitle>{nextMonth}</MonthTitle>
                        <GoButton
                          src='/images/go-next.svg'
                          onClick={goToNextMonthsByOneMonth}
                        />
                      </MonthTop>
                    </MonthInner>
                  </MonthOuter>
                </YearAndMonthWrapper>

                <Month
                  key={`${activeMonths[1].year}-${activeMonths[1].month}`}
                  year={activeMonths[1].year}
                  month={activeMonths[1].month}
                  firstDayOfWeek={firstDayOfWeek}
                  startDay={dateState.startDate && startDay}
                  endDay={dateState.endDate && endDay}
                  isDisabled={!editable}
                />
              </Calendar>

              <WatchWrapper>
                <TimePicker id='end' time={endTime} setTime={handleSetTime} />
              </WatchWrapper>
            </CalendarWrapper>

            <DisplayAndButtonWrapper>
              <DisplayDateWrapper>
                <DisplayDateOuter>
                  <DisplayDateInner>
                    <DateTitleWrapper>
                      <DateTitle>start date</DateTitle>
                    </DateTitleWrapper>

                    <DisplayTop>
                      <DisplayDate>
                        {dateState.startDate
                          ? startDate
                          : 'Choose the start date'}
                        {dateState.startDate && ` - ${startTimeSet}`}
                      </DisplayDate>
                    </DisplayTop>
                  </DisplayDateInner>
                </DisplayDateOuter>

                <DisplayDateOuter>
                  <DisplayDateInner>
                    <DateTitleWrapper>
                      <DateTitle>end date</DateTitle>
                    </DateTitleWrapper>

                    <DisplayTop>
                      <DisplayDate>
                        {dateState.endDate ? endDate : 'Choose the end date'}

                        {dateState.endDate && ` -  ${endTimeSet}`}
                      </DisplayDate>
                    </DisplayTop>
                  </DisplayDateInner>
                </DisplayDateOuter>
              </DisplayDateWrapper>

              <ButtonWrapper>
                <ButtonGroupWrapper isInvisible={true}>
                  {/* <TempInputAndSelectBox
                  tempInput={tempInput}
                  setTempInput={setTempInput}
                  unit={unit}
                  currSchedule={currSchedule}
                  setCurrSchedule={setCurrSchedule}
                  isFirstSchedule={isFirstSchedule}
                  scheduleNumber={scheduleNumber}
                  scheduleList={scheduleList}
                  editable={editable}
                /> */}
                </ButtonGroupWrapper>
                <ButtonGroupWrapper>
                  <SchedulerButton
                    name='clear'
                    id='1'
                    onClickHandler={handleOnClick}
                  />
                  <SchedulerButton
                    name='close'
                    id='2'
                    onClickHandler={handleOnClick}
                  />
                  <SchedulerButton
                    name={'apply'}
                    id='4'
                    onClickHandler={handleOnClick}
                  />
                </ButtonGroupWrapper>
              </ButtonWrapper>
            </DisplayAndButtonWrapper>
          </SectionMain>

          {displayMessageBox && (
            <MessageBoxWrapper>
              <InputTempMessage
                onClose={() => setDisplayMessageBox(false)}
                messages={message}
                title={'switch control'}
                subtitle={'heating schedule program'}
              />
            </MessageBoxWrapper>
          )}
        </Wrapper>
      )}
    </DatepickerContext.Provider>
  );
};

export default MCScheduleCalender;

const MobileWrapper = styled.div``;
const MobileHeader = styled.div`
  width: 273px;
  height: 29px;
  background-image: url('/images/mobile-scheduler-header.svg');
  ${justifyContentFlexStart}
  padding-left:10px;
`;

const MobileContentsWrapper = styled.div`
  width: 332px;
  height: 540px;
  border-radius: 0px 12px 12px 12px;
  ${layerA90Deg};
  ${flexDirectionColumn};
  padding: 8px;
`;

const CalendarInnerWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
`;

// for desktop
const Wrapper = styled.div`
  width: 826px;
  height: 445px;
`;

const HatWrapper = styled.div`
  width: 409px;
  height: 35px;
  background: url(${(p) => p.imgSrc}) no-repeat;

  ${justifyContentFlexStart}
  padding-left: 14px;
`;

const SectionMain = styled.div`
  width: 826px;
  height: 411px;
  border-radius: 0px 16px 16px 16px;
  ${layerA180Deg};
  ${flexDirectionColumn};
  padding: 4px;
`;

const TitleIcon = styled.img`
  margin-right: 10px;
`;
const Title = styled.span`
  font-size: 16px;
  letter-spacing: 1.6px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;
    `}
`;
const CalendarWrapper = styled.div`
  height: 273px;
  width: 100%;

  ${justifyContentSpaceBetween};

  ${(p) =>
    p.isMobile &&
    css`
      height: 411px;
      ${flexDirectionColumn};
    `};
`;

const Calendar = styled.div`
  width: 266px;
  height: 273px;
  border-radius: 20px 20px 12px 12px;

  ${layerC};
  padding: 0.1rem 0.1rem;

  ${(p) =>
    p.isMobile &&
    css`
      width: 200px;
      height: 200px;
      ${layerADark};

      padding: 3px;
    `}
`;

const YearAndMonthWrapper = styled.div`
  height: 38px;
  width: 100%;

  ${justifyContentSpaceBetween};
  margin-bottom: 22px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      height: auto;
      margin-bottom: 4px;
    `};
`;

const YearOuter = styled.div`
  width: 119px;
  height: 38px;
  border-radius: 18px;

  ${layerA180Deg};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 77px;
      height: 30px;
      border-radius: 25px;
    `}
`;
const YearInner = styled.div`
  width: 104px;
  height: 24px;
  border-radius: 12px;
  ${layerB};
  ${flexBoxCenter};

  ${(p) => p.isMobile && css``}
`;
const YearTop = styled.div`
  width: 102px;
  height: 22px;
  border-radius: 16px;
  border: 1px solid #233a54;

  ${flexBoxCenter};
  ${(p) =>
    p.isMobile &&
    css`
      width: 69px;
      height: 22px;
      border-radius: 20px;
      ${layerADark};
    `}

  &:first-child {
    justify-content: space-between;
  }
`;

const GoButton = styled.img`
  cursor: pointer;
  ${(p) =>
    p.isMobile &&
    css`
      height: 70%;
      width: auto;
    `}
`;

const YearTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
      letter-spacing: 1px;
    `}
`;

const MonthOuter = styled.div`
  width: 140px;
  height: 38px;
  border-radius: 18px;

  ${layerA180Deg};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 115px;
      height: 30px;
      border-radius: 25px;
    `}
`;
const MonthInner = styled.div`
  width: 124px;
  height: 24px;
  border-radius: 12px;
  ${layerB};
  ${flexBoxCenter}
`;
const MonthTop = styled.div`
  width: 122px;
  height: 22px;
  border-radius: 16px;
  border: 1px solid #233a54;

  ${justifyContentSpaceBetween};

  ${(p) =>
    p.isMobile &&
    css`
      width: 107px;
      height: 22px;
      border-radius: 20px;
      ${layerADark};
    `}
`;

const MonthTitle = styled.span`
  font-size: 12px;
  letter-spacing: 0.1px;
  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}
`;

const WatchWrapper = styled.div`
  width: 130px;
  height: 273px;
  border-radius: 12px;

  ${layerADark};
  padding: 1px;

  ${(p) => p.noTimePicker && css``}
  ${(p) =>
    p.isMobile &&
    css`
      width: 100px;
      height: 200px;
      border-radius: 12px;
      ${layerADark};
      padding: 0;
    `}
`;

const DisplayAndButtonWrapper = styled.div`
  ${flexBoxCenter}

  /* border: 1px solid blue; */
  width: 100%;
  height: 112px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      height: 106px;
      ${flexDirectionColumn};
    `}
`;

const DisplayDateWrapper = styled.div`
  width: 50%;
  height: 112px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
      height: 66px;
      ${flexDirectionColumn};
    `}
`;

const DisplayDateOuter = styled.div`
  width: 404px;
  height: 54px;
  border-radius: 27px;
  ${layerB};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 314px;
      height: 32px;
      border-radius: 19px;
      ${layerADark};
    `}
`;

const DisplayDateInner = styled.div`
  width: 399px;
  height: 50px;
  border-radius: 27px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 8px;

  ${(p) =>
    p.isMobile &&
    css`
      width: 312px;
      height: 30px;
      border-radius: 25px;
      ${layerA180Deg};
      padding: 0 4px;
    `}
`;

const DateTitleWrapper = styled.div`
  ${flexBoxCenter}
  /* border: 1px solid red; */
  width: 31%;
  ${(p) => p.isMobile && css``}
`;
const DateTitle = styled.span`
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fcff01;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
      letter-spacing: 1px;
    `}
`;

const DisplayTop = styled.div`
  width: 259px;
  height: 36px;
  border-radius: 20px;

  ${layerC};
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 208px;
      height: 22px;
      border-radius: 20px;
      ${layerADark};
    `}
`;

const DisplayDate = styled.span`
  /* text-align: left; */
  font-size: 10px;
  letter-spacing: 0.9px;
  color: #fcff01;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 8px;
      letter-spacing: 0.8px;
    `}
`;

const ButtonWrapper = styled.div`
  width: 50%;
  height: 112px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;

  ${(p) =>
    p.isMobile &&
    css`
      width: 314px;
      height: 32px;
      border-radius: 19px;
      ${layerADark};
      flex-direction: row;
      ${justifyContentSpaceBetween}
    `}
`;
const ButtonGroupWrapper = styled.div`
  width: 404px;
  height: 54px;
  border-radius: 27px;

  ${justifyContentSpaceBetween};
  padding: 0 2px;
  ${layerB};

  ${(p) =>
    p.isInvisible &&
    css`
      visibility: hidden;
    `}
`;

const MessageBoxWrapper = styled.div`
  width: 825px;
  height: 450px;

  ${flexBoxCenter}
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
`;
