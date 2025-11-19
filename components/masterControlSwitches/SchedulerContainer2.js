import { useMediaQuery } from 'react-responsive';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
} from '../styles/commonStyles';

const SchedulerContainer2 = ({ handleOpenScheduler, start, end, isSmall }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : ' -----------------';

  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : ' -----------------';

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile} isSmall={isSmall}>
          <ScheduleDisplayWrapper isMobile={isMobile} isSmall={isSmall}>
            <TitleAndDisplayWrapper>
              <MobileTitle isMobile={isMobile} isSmall={isSmall}>
                start Date :{' '}
              </MobileTitle>
              <DateAndTimeWrapper isMobile={isMobile} isSmall={isSmall}>
                {displayStart}
              </DateAndTimeWrapper>
            </TitleAndDisplayWrapper>

            <TitleAndDisplayWrapper isSmall={isSmall}>
              <MobileTitle isMobile={isMobile} isSmall={isSmall}>
                end date :{' '}
              </MobileTitle>
              <DateAndTimeWrapper isMobile={isMobile} isSmall={isSmall}>
                {displayEnd}
              </DateAndTimeWrapper>
            </TitleAndDisplayWrapper>
          </ScheduleDisplayWrapper>

          <CalendarButton onClick={handleOpenScheduler} isMobile={isMobile}>
            <Img src={'/images/calendar-button.svg'} isMobile={isMobile} />
          </CalendarButton>
        </Wrapper>
      ) : (
        <Wrapper>
          <ScheduleDisplayWrapper>
            <DateAndTimeWrapper>{displayStart}</DateAndTimeWrapper>
            <DateAndTimeWrapper>{displayEnd}</DateAndTimeWrapper>
          </ScheduleDisplayWrapper>

          <CalendarButton onClick={handleOpenScheduler}>
            <Img src={'/images/calendar-button.svg'} />
          </CalendarButton>
        </Wrapper>
      )}
    </>
  );
};

export default SchedulerContainer2;

const Wrapper = styled.div`
  width: 197px;
  height: 65px;
  border-radius: 16px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 5px 0 2px;

  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 34px;
      padding: 2px 8px 2px 10px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 299px;
              height: 68px;
            `
          : css`
              width: 310px;
              height: 68px;
              margin-top: 6px;
            `}
    `}
`;

const ScheduleDisplayWrapper = styled.div`
  height: 100%;

  ${flexDirectionColumn};
  padding: 2px 0;

  ${(p) =>
    p.isMobile &&
    css`
      width: ${(p) => (p.isSmall ? `247px` : `256px`)};
    `}
`;

const TitleAndDisplayWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

const MobileTitle = styled.span`
  width: ${(p) => (p.isSmall ? `80px` : `82px`)};
  font-size: ${(p) => (p.isSmall ? `9px` : `10px`)};
  text-align: right;
`;
const DateAndTimeWrapper = styled.div`
  width: 164px;
  height: 28px;
  border-radius: 14px;

  ${layerA}
  font-size: 8px;
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 29px;
    `}
`;

const CalendarButton = styled.button`
  margin-top: 0.2rem;
  cursor: pointer;

  ${(p) =>
    p.isMobile &&
    css`
      width: 32px;
      height: 29px;
      margin-top: 8px;
    `}
`;

const Img = styled.img`
  ${(p) =>
    p.isMobile &&
    css`
      width: 100%;
    `}
`;
