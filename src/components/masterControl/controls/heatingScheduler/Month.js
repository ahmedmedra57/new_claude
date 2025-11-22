import { useMonth } from '@datepicker-react/hooks';
import { useMediaQuery } from 'react-responsive';

import styled, { css } from 'styled-components';

import Day from './Day';

const Month = ({
  year,
  month,
  firstDayOfWeek,
  startDay,
  endDay,
  isDisabled,
  noTimePicker,
  isToSelectPastDates,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const { days, weekdayLabels } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });

  return (
    <Wrapper>
      <WeekDayWrapper isMobile={isMobile}>
        {weekdayLabels.map((dayLabel) => (
          <Weekday key={dayLabel} isMobile={isMobile}>
            {dayLabel}
          </Weekday>
        ))}
      </WeekDayWrapper>
      <WeekdayUnderline isMobile={isMobile} />

      <DateWrapper isMobile={isMobile}>
        {days.map((day, index) => {
          if (typeof day === 'object') {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
                startDay={startDay}
                endDay={endDay}
                month={month}
                isDisabled={isDisabled}
                noTimePicker={noTimePicker}
                isToSelectPastDates={isToSelectPastDates}
              />
            );
          }

          return <div key={index} />;
        })}
      </DateWrapper>
    </Wrapper>
  );
};

export default Month;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
`;

const WeekDayWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  font-size: 14px;
  width: 100%;
  /* border: 1px solid red; */
  margin-bottom: 1.6rem;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}
`;
const WeekdayUnderline = styled.div`
  width: 94%;
  border-bottom: 1px solid #ffff;
  margin-bottom: 8rem;

  ${(p) =>
    p.isMobile &&
    css`
      margin-bottom: 4px;
    `}
`;

const Weekday = styled.div`
  text-align: center;
  /* border: 1px solid red; */
`;

const DateWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: space-between;
  /* border: 1px solid red; */
`;
