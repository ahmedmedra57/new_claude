import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerADark,
} from '../../styles/commonStyles';

const SchedulerDisplay = ({
  handleOpenScheduler,
  start,
  end,
  ready,
  active,
}) => {
  const displayStart =
    start.date !== null
      ? `${start.time.hour}:${start.time.minute} ${
          start.time.division
        }-${start.date.getDate()}/${
          start.date.getMonth() + 1
        }/${start.date.getFullYear()}`
      : '--:--------/--/----';

  const displayEnd =
    end.date !== null
      ? `${end.time.hour}:${end.time.minute} ${
          end.time.division
        }-${end.date.getDate()}/${
          end.date.getMonth() + 1
        }/${end.date.getFullYear()}`
      : '--:--------/--/----';

  return (
    <Wrapper>
      <SubWrapper>
        <DateAndTimeWrapper ready={ready} active={active}>
          <DateAndTime>{displayStart}</DateAndTime>
        </DateAndTimeWrapper>
      </SubWrapper>

      <SubWrapper>
        <DateAndTimeWrapper ready={ready} active={active}>
          <DateAndTime>{displayEnd}</DateAndTime>
        </DateAndTimeWrapper>
      </SubWrapper>

      <CalendarButton onClick={() => handleOpenScheduler(1)}>
        <Img src={'/images/select-arrow-icon.svg'} />
      </CalendarButton>
    </Wrapper>
  );
};

export default SchedulerDisplay;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${justifyContentSpaceBetween}
  box-sizing: border-box;
`;

const SubWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DateAndTimeWrapper = styled.div`
  width: 184px;
  height: 33px;
  margin-left: 4px;

  ${layerADark}

  border-radius: 33px;
  opacity: 1;

  ${justifyContentFlexStart}

  ${(p) =>
    p.ready &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%)
        0% 0%;
      box-shadow: inset 0px 0px 6px #000000;
    `}
`;

const DateAndTime = styled.p`
  margin-left: 10px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
`;

const CalendarButton = styled.button`
  margin-top: 0.2px;
  margin-right: 8px;
  cursor: pointer;
  ${flexBoxCenter}
`;

const Img = styled.img``;
