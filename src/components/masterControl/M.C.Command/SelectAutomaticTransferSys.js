import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerADark,
  scrollbarY,
} from '../../styles/commonStyles';

function SelectAutomaticTransferSys({
  atsMessage,
  instantHeatTemp,
  snowSensorTemp,
  constantTemp,
  schedule,
  isWindFactor,
  fanOnly,
  tgs,
  isF,
  scheduleDates,
  hp,
}) {
  // set unit measured
  const unitMeasure = isF ? '°F' : '°C';

  // check if the scheduler is ready
  const checkSchedulerStatus = schedule.split(' ')[0] === 'ready';
  // time and date
  const start = scheduleDates.start;
  const end = scheduleDates.end;
  const startTime = checkSchedulerStatus
    ? `${start.time.hour}:${start.time.minute}`
    : '-----';
  const startDate =
    checkSchedulerStatus && `${start.date.toLocaleDateString()}`;
  const endTime = checkSchedulerStatus
    ? `${end.time.hour}:${end.time.minute}`
    : '-----';
  const endDate = checkSchedulerStatus && `${end.date.toLocaleDateString()}`;

  return (
    <Wrapper>
      <ScrollBar>
        <Div>
          <P>selected automatic transfer system</P>
        </Div>
        <Div isNoUnderline={true}>
          <P isAtsMessage={true}>{atsMessage}</P>
        </Div>
        <Div>
          <P>selected heating program</P>
        </Div>
        <Div1>
          <Div2>
            <P>parameters</P>
          </Div2>
          <Ul>
            <DivList>
              <Li>instant Heat program</Li>
              <Li>
                {instantHeatTemp}
                {unitMeasure}
              </Li>
            </DivList>
            <DivList>
              <Li>
                {tgs
                  ? 'fan only program'
                  : hp
                  ? 'snow sensor & wind factor program'
                  : 'snow sensor program'}
              </Li>
              <Li>
                {tgs ? fanOnly : snowSensorTemp}
                {unitMeasure}
              </Li>
            </DivList>
            {!hp && (
              <DivList>
                <Li>
                  {tgs ? 'snow sensor program' : 'opt. cons. temp. program'}
                </Li>
                <Li>
                  {tgs ? snowSensorTemp : constantTemp}
                  {unitMeasure}
                </Li>
              </DivList>
            )}
            <DivList>
              <Li>heating schedule program</Li>
              <Li>
                {schedule}
                {unitMeasure}
              </Li>
            </DivList>
            <DivList isCalender={true}>
              <Li startTime={checkSchedulerStatus}>
                {startTime}
                <Span>{checkSchedulerStatus && start.time.division}</Span>-
                {startDate}
              </Li>
              <Li>
                {endTime}
                <Span>{checkSchedulerStatus && end.time.division}</Span>-
                {endDate}
              </Li>
            </DivList>
            {!hp && (
              <DivList>
                <Li>wind factor program</Li>
                <Li>
                  {isWindFactor}
                  {unitMeasure}
                </Li>
              </DivList>
            )}
          </Ul>
        </Div1>
      </ScrollBar>
    </Wrapper>
  );
}

export default SelectAutomaticTransferSys;

const Wrapper = styled.div`
  width: 292px;
  max-height: 122px;
  min-height: 122px;
  padding: 4px;

  ${justifyContentFlexStart}
  border-radius: 4px;

  ${layerADark}/* border-radius: 4px;
  opacity: 1;
  ${flexBoxCenter}
  flex-direction: column; */
`;

const ScrollBar = styled.div`
  width: 100%;
  min-height: 114px;
  max-height: 114px;

  ${scrollbarY}
  overflow-y: scroll;

  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

const Div = styled.div`
  width: 271px;
  height: 12px;
  margin-top: 4px;
  margin-bottom: 2px;

  opacity: 1;

  ${justifyContentSpaceBetween}

  ${({ isNoUnderline }) =>
    !isNoUnderline
      ? css`
          border-bottom: 1px solid #ffff;
        `
      : css`
          height: 17px;
        `}
`;

const Div1 = styled.div`
  width: 271px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
`;

const Div2 = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const P = styled.p`
  font-size: 8px;
  letter-spacing: 0.8px;
  margin-bottom: 2px;

  ${({ isAtsMessage }) =>
    isAtsMessage
      ? css`
          color: #95ff45;
          text-align: center;
          margin-top: 2px;
        `
      : css`
          color: #ffffff;
        `}
`;

const Ul = styled.ul`
  width: 100%;
  padding-bottom: 2px;
`;

const DivList = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
  ${({ isCalender }) =>
    isCalender &&
    css`
      ${justifyContentSpaceBetween}/* gap:8px; */
    `}
`;

const Li = styled.li`
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
  display: inline-block;
  position: relative;

  ${({ startTime }) =>
    startTime &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 50%; /* aligns the line with the vertical middle of the text */
        left: 97%; /* positions the line just after the text */
        width: 26px; /* length of the line */
        margin-left: 10px;
        border-bottom: 1px solid #ffff;
      }
    `}
`;

const Span = styled.span`
  text-transform: lowercase;
`;
