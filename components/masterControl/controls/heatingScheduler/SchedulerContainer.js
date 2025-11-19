import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerADark,
} from '../../../styles/commonStyles';

const SchedulerContainer = ({
  handleOpenScheduler,
  start,
  end,
  ready,
  active,
  isDialSysDisabled,
  handleMessageBox,
}) => {
  const displayStart =
    start !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : ' -----------------';

  const displayEnd =
    end !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : ' -----------------';

  return (
    <Wrapper ready={ready}>
      <ContainerImg alt={'blue box'} src={'/images/schedule-date-box.svg'} />
      <ScheduleDisplayWrapper>
        <SubWrapper>
          <Title id={1}>start date : </Title>

          <DateAndTimeWrapper ready={ready} active={active}>
            {displayStart}
          </DateAndTimeWrapper>
        </SubWrapper>

        <SubWrapper>
          <Title id={2}>end date : </Title>
          <DateAndTimeWrapper ready={ready} active={active}>
            {displayEnd}
          </DateAndTimeWrapper>
        </SubWrapper>
      </ScheduleDisplayWrapper>

      <CalendarButton
        onClick={() =>
          isDialSysDisabled
            ? handleMessageBox(
                'master control',
                [
                  'm.c. shut off',
                  "can't be used another action with deactivate",
                ],
                'deactivate'
              )
            : handleOpenScheduler(1)
        }
      >
        <Img src={'/images/calendar-button.svg'} />
      </CalendarButton>
    </Wrapper>
  );
};

export default SchedulerContainer;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${({ ready }) => {
    ready
      ? css`
           {
            background: url('./images/m.c-heatingSchedule-active-calenderBackground.svg')
              no-repeat;
          }
        `
      : css`
           {
            background: url('./images/m.c-heatingSchedule-calenderBackground.svg')
              no-repeat;
          }
        `;
  }}

  ${justifyContentSpaceBetween}
  padding: 0 20px 0 15px;

  position: relative;
`;

const SubWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ScheduleDisplayWrapper = styled.div`
  height: 82%;
  z-index: 2;
  ${flexDirectionColumn}
`;

const ContainerImg = styled.img`
  position: absolute;
  left: 0;
  top: 0;
`;

const DateAndTimeWrapper = styled.div`
  width: 211px;
  height: 20px;
  border-radius: 14px;

  ${layerA}
  font-size: 8px;
  ${flexBoxCenter}

  ${(p) =>
    p.ready &&
    css`
      ${layerADark}
    `}
`;

const Title = styled.span`
  font-size: 6px;
  width: 55px;
  text-align: center;

  ${(p) =>
    p.id === 1
      ? css`
          padding-left: 4px;
        `
      : css``}
`;

const CalendarButton = styled.button`
  margin-top: 0.2px;
  /* cursor: pointer; */
  z-index: 2;
`;

const Img = styled.img``;
