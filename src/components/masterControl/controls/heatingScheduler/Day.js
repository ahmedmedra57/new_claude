import { useRef, useContext } from 'react';
import { useDay } from '@datepicker-react/hooks';
import DatepickerContext from './datepickerContext';
import { useMediaQuery } from 'react-responsive';

import getColor from './getColor';
import styled, { css } from 'styled-components';
import moment from 'moment';

const Day = ({
  dayLabel,
  date,
  startDay,
  endDay,
  month,
  isDisabled,
  noTimePicker,
  isToSelectPastDates,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const today = `${month}` + Number(dayLabel);

  const MDate = moment(date);
  const currDate = moment();
  const diffDays = MDate.diff(currDate, 'days');
  const diffHours = MDate.diff(currDate, 'hours');

  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
  } = useContext(DatepickerContext);

  const {
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex,
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef,
  });

  if (!dayLabel) {
    return <div />;
  }

  const getColorFn = getColor(
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate
  );

  const btnStyle = {
    padding: '6.4rem 6rem',
    // border: '1px solid red',

    color: getColorFn({
      selectedFirstOrLastColor: '#1B2B44',
      normalColor: '#FFFFFF',
      selectedColor: '#FFFFFF',
      rangeHoverColor: '#FFFFFF',
      disabledColor: '#707070',
    }),
    background: getColorFn({
      selectedFirstOrLastColor: '#95FF45',
      normalColor: 'none',
      selectedColor: '#95FF4566',
      rangeHoverColor: '#95FF4566',
      disabledColor: 'transparent',
    }),
  };

  return (
    <Date
      isMobile={isMobile}
      onClick={() => {
        if (noTimePicker) {
          onClick();
        } else if (diffDays >= 0) {
          onClick();
        }
      }}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type='button'
      ref={dayRef}
      style={btnStyle}
      isStartDay={today === startDay ? true : false}
      isEndDay={today === endDay ? true : false}
      isDisabled={
        isToSelectPastDates ? diffDays > 0 : noTimePicker ? false : diffDays < 0
      }
      isThePast={diffDays < 0}
      isToday={diffDays === 0 && diffHours <= 0}
    >
      {dayLabel}
    </Date>
  );
};

export default Day;

const Date = styled.div`
  font-size: 14px;
  text-align: center;
  /* border: 1px solid red; */
  ${(p) =>
    p.isDisabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `};

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}

  ${(p) =>
    p.isToday &&
    css`
      border-radius: 50%;
      border: 2px solid #95ff4566;
    `}

    border-radius: ${(p) => p.isStartDay && '50% 0 0 50%'};
  border-radius: ${(p) => p.isEndDay && '0 50% 50% 0 '};
`;
