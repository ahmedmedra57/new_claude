import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectMC } from '../../store/slices/mCSlice';
import { selectTelemetry } from '../../store/slices/telemetrySlice';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA90Deg,
  layerBDark,
} from '../../styles/commonStyles';

const TitleOfSelectedSystem = ({ scheduleData }) => {
  const telemetryState = useSelector(selectTelemetry);
  const selectedSwitch = useSelector(selectMC);
  const isSearch = telemetryState.isSearch;
  const { ess, tgs, tes, essDc, tgsDc, tesDc, hpDc, hpGc, hpEc, tgsTesDc } =
    selectedSwitch.selectSystem;

  const displayStart =
    scheduleData.start.date !== null
      ? `${scheduleData.start.time.hour} : ${scheduleData.start.time.minute} ${
          scheduleData.start.time.division
        } - ${scheduleData.start.date.getDate()} / ${
          scheduleData.start.date.getMonth() + 1
        } / ${scheduleData.start.date.getFullYear()} `
      : ' -----';

  const displayEnd =
    scheduleData.end.date !== null
      ? `${scheduleData.end.time.hour} : ${scheduleData.end.time.minute} ${
          scheduleData.end.time.division
        } - ${scheduleData.end.date.getDate()} / ${
          scheduleData.end.date.getMonth() + 1
        } / ${scheduleData.end.date.getFullYear()} `
      : ' -----';

  const systemTitle =
    isSearch && ess
      ? 'ess - switch systems'
      : isSearch && tgs
      ? 'tgs - typhoon gas systems'
      : isSearch && tes
      ? 'tes - typhoon electric systems'
      : isSearch && (hpEc || hpDc || hpGc)
      ? 'hp - heated platform'
      : essDc
      ? 'ess - systems'
      : tgsDc || tesDc || tgsTesDc
      ? 'tgs/tes typhoon - systems'
      : '----------------------------------------------';

  const EnergyAndTime =
    isSearch && (ess || tes || hpEc)
      ? 'energy consumption vs time'
      : isSearch && (tgs || hpGc)
      ? 'gas consumption vs time'
      : isSearch && (essDc || tgsDc || tesDc || tgsTesDc || hpDc)
      ? 'data consumption vs time'
      : '-----';

  const splittedEnergyAndTime = EnergyAndTime.split('vs');

  const startDate = isSearch ? displayStart : '----------';

  const endDate = isSearch ? displayEnd : '----------';

  return (
    <ShadowWrapper>
      <Wrapper>
        <IndentWrapper>
          {/* Title of Selected System */}
          <Title1
            isColor={isSearch}
            ess={ess}
            tgs={tgs}
            tes={tes}
            isDataConsumption={essDc || tgsDc || tesDc || tgsTesDc}
          >
            {systemTitle}
          </Title1>
          {/*Title of Energy And Time */}
          <Title>
            <Span>{splittedEnergyAndTime[0]}</Span>
            <Span>vs</Span>
            <Span>{splittedEnergyAndTime[1] ?? '-----'}</Span>
          </Title>
          {/* dates */}
          <Calender>
            <Dates>{startDate}</Dates>
            <Dates>{endDate}</Dates>
          </Calender>
        </IndentWrapper>
      </Wrapper>
    </ShadowWrapper>
  );
};

export default TitleOfSelectedSystem;

const ShadowWrapper = styled.div`
  width: 1202px;
  height: 50px;

  ${layerBDark}

  border-radius: 5px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1198px;
  height: 46px;

  ${layerA90Deg}

  border-radius: 3px;
  opacity: 1;
  ${flexBoxCenter}
`;

const IndentWrapper = styled.div`
  width: 1192px;
  height: 40px;

  ${layerA}

  border-radius: 1px;
  opacity: 1;
  ${flexBoxCenter}
  flex-direction: column;
`;

const Title1 = styled.p`
  width: fit-content;
  height: 12px;
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
  ${({ isColor, tgs, tes, ess, isDataConsumption }) =>
    isColor && ess
      ? css`
          color: #83ffff;
        `
      : isColor && tgs
      ? css`
          color: #ff7800;
        `
      : isColor && tes
      ? css`
          color: #95ff45;
        `
      : isColor && isDataConsumption
      ? css`
          color: #ff0080;
        `
      : css`
          color: #ffff;
        `}
  opacity: 1;
`;

const Title = styled.div`
  width: fit-content;
  height: 12px;
`;

const Span = styled.span`
  width: fit-content;
  height: 12px;
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #ffff;
  opacity: 1;

  :nth-child(2) {
    text-transform: lowercase;
    margin: 0 4px 0 4px;
  }
`;

const Dates = styled.span`
  width: fit-content;

  text-align: left;
  font-size: 10px;
  letter-spacing: 1.2px;
  color: #ffff;
  opacity: 1;
`;

const Calender = styled.div`
  width: 420px;
  ${justifyContentSpaceBetween}
`;
